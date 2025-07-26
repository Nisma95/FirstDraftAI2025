<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MeeserPaymentService
{
    private $apiKey;
    private $secretKey;
    private $baseUrl;
    private $environment;

    public function __construct()
    {
        $this->apiKey = config('services.meeser.api_key');
        $this->secretKey = config('services.meeser.secret_key');
        $this->environment = config('services.meeser.environment', 'test');
        $this->baseUrl = $this->environment === 'production'
            ? 'https://api.meeser.sa/v1'
            : 'https://test-api.meeser.sa/v1';
    }

    /**
     * Process payment with Meeser.
     */
    public function processPayment(array $paymentData): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ])->post($this->baseUrl . '/payments', [
                'amount' => $paymentData['amount'],
                'currency' => $paymentData['currency'],
                'customer' => $paymentData['customer'],
                'order_reference' => $paymentData['order_reference'],
                'callback_url' => $paymentData['callback_url'],
                'success_url' => route('payments.success'),
                'failure_url' => route('payments.failure'),
                'metadata' => $paymentData['metadata'],
                'payment_method_id' => $paymentData['payment_method_id'],
                'description' => 'اشتراك في منصة خطط العمل',
            ]);

            if ($response->successful()) {
                $data = $response->json();

                return [
                    'success' => true,
                    'transaction_id' => $data['transaction_id'],
                    'status' => $data['status'],
                    'payment_url' => $data['payment_url'] ?? null,
                    'redirect_required' => isset($data['payment_url']),
                ];
            }

            Log::error('Meeser API Error: ' . $response->body());

            return [
                'success' => false,
                'error' => $response->json()['message'] ?? 'خطأ في معالجة الدفع',
            ];
        } catch (\Exception $e) {
            Log::error('Meeser Payment Error: ' . $e->getMessage());

            return [
                'success' => false,
                'error' => 'خطأ في الاتصال بخدمة الدفع',
            ];
        }
    }

    /**
     * Get payment status.
     */
    public function getPaymentStatus(string $transactionId): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Accept' => 'application/json',
            ])->get($this->baseUrl . '/payments/' . $transactionId);

            if ($response->successful()) {
                return $response->json();
            }

            return [
                'error' => 'لم يتم العثور على المعاملة',
            ];
        } catch (\Exception $e) {
            Log::error('Get Payment Status Error: ' . $e->getMessage());

            return [
                'error' => 'خطأ في جلب حالة الدفع',
            ];
        }
    }

    /**
     * Get available payment methods.
     */
    public function getPaymentMethods(): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Accept' => 'application/json',
            ])->get($this->baseUrl . '/payment-methods');

            if ($response->successful()) {
                return $response->json()['payment_methods'] ?? [];
            }

            return [];
        } catch (\Exception $e) {
            Log::error('Get Payment Methods Error: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Create recurring payment subscription.
     */
    public function createRecurringSubscription(array $subscriptionData): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ])->post($this->baseUrl . '/subscriptions', [
                'customer' => $subscriptionData['customer'],
                'plan' => $subscriptionData['plan'],
                'billing_cycle' => $subscriptionData['billing_cycle'],
                'start_date' => $subscriptionData['start_date'],
                'metadata' => $subscriptionData['metadata'],
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            return [
                'success' => false,
                'error' => $response->json()['message'] ?? 'خطأ في إنشاء الاشتراك',
            ];
        } catch (\Exception $e) {
            Log::error('Create Subscription Error: ' . $e->getMessage());

            return [
                'success' => false,
                'error' => 'خطأ في إنشاء الاشتراك المتكرر',
            ];
        }
    }

    /**
     * Cancel recurring subscription.
     */
    public function cancelSubscription(string $subscriptionId): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Accept' => 'application/json',
            ])->delete($this->baseUrl . '/subscriptions/' . $subscriptionId);

            if ($response->successful()) {
                return [
                    'success' => true,
                    'message' => 'تم إلغاء الاشتراك بنجاح',
                ];
            }

            return [
                'success' => false,
                'error' => $response->json()['message'] ?? 'خطأ في إلغاء الاشتراك',
            ];
        } catch (\Exception $e) {
            Log::error('Cancel Subscription Error: ' . $e->getMessage());

            return [
                'success' => false,
                'error' => 'خطأ في إلغاء الاشتراك',
            ];
        }
    }

    /**
     * Process refund.
     */
    public function processRefund(string $transactionId, float $amount = null): array
    {
        try {
            $data = ['transaction_id' => $transactionId];

            if ($amount !== null) {
                $data['amount'] = $amount;
            }

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ])->post($this->baseUrl . '/refunds', $data);

            if ($response->successful()) {
                return $response->json();
            }

            return [
                'success' => false,
                'error' => $response->json()['message'] ?? 'خطأ في معالجة الاسترداد',
            ];
        } catch (\Exception $e) {
            Log::error('Process Refund Error: ' . $e->getMessage());

            return [
                'success' => false,
                'error' => 'خطأ في معالجة طلب الاسترداد',
            ];
        }
    }

    /**
     * Verify webhook signature.
     */
    public function verifyWebhookSignature($request): bool
    {
        try {
            $payload = $request->getContent();
            $signature = $request->header('X-Meeser-Signature');

            if (!$signature) {
                return false;
            }

            $expectedSignature = hash_hmac('sha256', $payload, $this->secretKey);

            return hash_equals($expectedSignature, $signature);
        } catch (\Exception $e) {
            Log::error('Webhook Signature Verification Error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get transaction details.
     */
    public function getTransactionDetails(string $transactionId): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Accept' => 'application/json',
            ])->get($this->baseUrl . '/transactions/' . $transactionId);

            if ($response->successful()) {
                return $response->json();
            }

            return [
                'error' => 'لم يتم العثور على المعاملة',
            ];
        } catch (\Exception $e) {
            Log::error('Get Transaction Details Error: ' . $e->getMessage());

            return [
                'error' => 'خطأ في جلب تفاصيل المعاملة',
            ];
        }
    }

    /**
     * Create payment link for sharing.
     */
    public function createPaymentLink(array $linkData): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ])->post($this->baseUrl . '/payment-links', [
                'amount' => $linkData['amount'],
                'currency' => $linkData['currency'],
                'description' => $linkData['description'],
                'customer' => $linkData['customer'] ?? null,
                'expires_at' => $linkData['expires_at'] ?? null,
                'metadata' => $linkData['metadata'] ?? [],
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            return [
                'success' => false,
                'error' => $response->json()['message'] ?? 'خطأ في إنشاء رابط الدفع',
            ];
        } catch (\Exception $e) {
            Log::error('Create Payment Link Error: ' . $e->getMessage());

            return [
                'success' => false,
                'error' => 'خطأ في إنشاء رابط الدفع',
            ];
        }
    }
}
