<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Services\PDFService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class PDFController extends Controller
{
    protected $pdfService;

    public function __construct(PDFService $pdfService)
    {
        $this->pdfService = $pdfService;
    }

    /**
     * Generate and download plan PDF.
     */
    public function generate(Plan $plan)
    {
        Gate::authorize('view', $plan);

        try {
            $user = $plan->project->user;
            $isPremium = $user->subscription_type === 'premium';

            // Check if plan is ready for PDF generation
            if (!$this->canGeneratePDF($plan)) {
                return back()->with('error', 'لا يمكن توليد ملف PDF لهذه الخطة حالياً. يرجى إكمال جميع الأقسام المطلوبة.');
            }

            // Generate PDF
            $options = [
                'watermark' => !$isPremium,
                'show_premium_content' => $isPremium,
                'include_ai_analysis' => true,
                'language' => $user->language ?? 'ar',
                'format' => $plan->status === 'premium' ? 'professional' : 'standard',
            ];

            $pdfPath = $this->pdfService->generatePlanPDF($plan, $options);

            // Update plan with PDF path
            $plan->updatePdfPath($pdfPath);

            // Return PDF file
            return response()->download(storage_path('app/' . $pdfPath), $this->generateFileName($plan))
                ->deleteFileAfterSend(false);
        } catch (\Exception $e) {
            \Log::error('PDF Generation Error: ' . $e->getMessage());
            return back()->with('error', 'حدث خطأ أثناء توليد ملف PDF. يرجى المحاولة مرة أخرى.');
        }
    }

    /**
     * Preview PDF in browser.
     */
    public function preview(Plan $plan)
    {
        Gate::authorize('view', $plan);

        try {
            $user = $plan->project->user;
            $isPremium = $user->subscription_type === 'premium';

            // Generate preview PDF (with watermark for non-premium)
            $options = [
                'watermark' => !$isPremium,
                'show_premium_content' => $isPremium,
                'include_ai_analysis' => $isPremium,
                'language' => $user->language ?? 'ar',
                'format' => 'preview',
            ];

            $pdfPath = $this->pdfService->generatePlanPDF($plan, $options);

            // Display PDF in browser
            return response()->file(storage_path('app/' . $pdfPath), [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="' . $this->generateFileName($plan) . '"',
            ]);
        } catch (\Exception $e) {
            \Log::error('PDF Preview Error: ' . $e->getMessage());
            return back()->with('error', 'حدث خطأ أثناء معاينة ملف PDF.');
        }
    }

    /**
     * Generate section-specific PDF.
     */
    public function generateSection(Plan $plan, string $section)
    {
        Gate::authorize('view', $plan);

        try {
            $validSections = ['market', 'finance', 'swot', 'operations', 'marketing'];

            if (!in_array($section, $validSections)) {
                return back()->with('error', 'القسم المطلوب غير موجود.');
            }

            $user = $plan->project->user;
            $isPremium = $user->subscription_type === 'premium';

            // Check premium access for specific sections
            if (in_array($section, ['swot', 'operations']) && !$isPremium) {
                return back()->with('error', 'هذا القسم متاح للمشتركين المتميزين فقط.');
            }

            $options = [
                'section' => $section,
                'watermark' => !$isPremium,
                'language' => $user->language ?? 'ar',
                'format' => 'section',
            ];

            $pdfPath = $this->pdfService->generateSectionPDF($plan, $options);

            return response()->download(storage_path('app/' . $pdfPath), $this->generateFileName($plan, $section))
                ->deleteFileAfterSend(true);
        } catch (\Exception $e) {
            \Log::error('Section PDF Generation Error: ' . $e->getMessage());
            return back()->with('error', 'حدث خطأ أثناء توليد قسم PDF.');
        }
    }

    /**
     * Generate branded PDF with company logo.
     */
    public function generateBranded(Plan $plan)
    {
        Gate::authorize('view', $plan);

        $user = $plan->project->user;

        // Check premium access
        if ($user->subscription_type !== 'premium') {
            return back()->with('error', 'الـ PDF المخصص متاح للمشتركين المتميزين فقط.');
        }

        try {
            $options = [
                'watermark' => false,
                'show_premium_content' => true,
                'include_ai_analysis' => true,
                'language' => $user->language ?? 'ar',
                'format' => 'branded',
                'company_logo' => $user->company_logo ?? null,
                'company_colors' => $user->company_colors ?? null,
                'branding' => [
                    'logo_path' => $user->profile_photo ?? null,
                    'primary_color' => '#1a365d',
                    'secondary_color' => '#718096',
                    'header_text' => $plan->project->name,
                    'footer_text' => 'تم إنشاؤه بواسطة منصة خطط العمل',
                ],
            ];

            $pdfPath = $this->pdfService->generatePlanPDF($plan, $options);

            return response()->download(storage_path('app/' . $pdfPath), $this->generateFileName($plan, 'branded'))
                ->deleteFileAfterSend(false);
        } catch (\Exception $e) {
            \Log::error('Branded PDF Generation Error: ' . $e->getMessage());
            return back()->with('error', 'حدث خطأ أثناء توليد النسخة المخصصة.');
        }
    }

    /**
     * Generate executive summary PDF.
     */
    public function generateExecutiveSummary(Plan $plan)
    {
        Gate::authorize('view', $plan);

        try {
            $user = $plan->project->user;
            $isPremium = $user->subscription_type === 'premium';

            $options = [
                'section' => 'executive_summary',
                'watermark' => !$isPremium,
                'language' => $user->language ?? 'ar',
                'format' => 'summary',
                'include_financials' => true,
                'include_highlights' => true,
            ];

            $pdfPath = $this->pdfService->generateExecutiveSummaryPDF($plan, $options);

            return response()->download(storage_path('app/' . $pdfPath), $this->generateFileName($plan, 'summary'))
                ->deleteFileAfterSend(true);
        } catch (\Exception $e) {
            \Log::error('Executive Summary PDF Error: ' . $e->getMessage());
            return back()->with('error', 'حدث خطأ أثناء توليد الملخص التنفيذي.');
        }
    }

    /**
     * Email PDF to specified recipients.
     */
    public function email(Request $request, Plan $plan)
    {
        Gate::authorize('view', $plan);

        $request->validate([
            'recipients' => 'required|array',
            'recipients.*' => 'email',
            'message' => 'nullable|string|max:1000',
            'include_attachments' => 'boolean',
        ]);

        try {
            $user = $plan->project->user;
            $isPremium = $user->subscription_type === 'premium';

            // Generate PDF if not exists
            if (!$plan->pdf_path || !Storage::exists($plan->pdf_path)) {
                $options = [
                    'watermark' => !$isPremium,
                    'show_premium_content' => $isPremium,
                    'language' => $user->language ?? 'ar',
                ];

                $pdfPath = $this->pdfService->generatePlanPDF($plan, $options);
                $plan->updatePdfPath($pdfPath);
            }

            // Prepare email data
            $emailData = [
                'recipients' => $request->recipients,
                'subject' => 'خطة العمل: ' . $plan->title,
                'message' => $request->message ?? 'مرفق خطة العمل للمراجعة.',
                'sender_name' => $user->name,
                'plan' => $plan,
                'attachments' => [
                    [
                        'path' => storage_path('app/' . $plan->pdf_path),
                        'name' => $this->generateFileName($plan),
                        'mime' => 'application/pdf',
                    ]
                ],
            ];

            // Send email
            $this->pdfService->emailPDF($emailData);

            return back()->with('success', 'تم إرسال خطة العمل بنجاح إلى المستلمين.');
        } catch (\Exception $e) {
            \Log::error('Email PDF Error: ' . $e->getMessage());
            return back()->with('error', 'حدث خطأ أثناء إرسال البريد الإلكتروني.');
        }
    }

    /**
     * Generate multiple plans as a single PDF.
     */
    public function generateMultiple(Request $request)
    {
        $request->validate([
            'plan_ids' => 'required|array',
            'plan_ids.*' => 'exists:plans,id',
        ]);

        try {
            $plans = Plan::whereIn('id', $request->plan_ids)
                ->whereHas('project', function ($query) {
                    $query->where('user_id', auth()->id());
                })
                ->get();

            if ($plans->isEmpty()) {
                return back()->with('error', 'لم يتم العثور على خطط صالحة.');
            }

            $user = auth()->user();
            $isPremium = $user->subscription_type === 'premium';

            $options = [
                'watermark' => !$isPremium,
                'show_premium_content' => $isPremium,
                'language' => $user->language ?? 'ar',
                'format' => 'portfolio',
                'include_cover' => true,
                'include_toc' => true,
            ];

            $pdfPath = $this->pdfService->generateMultiplePlansPDF($plans, $options);

            $fileName = 'business-plans-' . Carbon::now()->format('Y-m-d') . '.pdf';

            return response()->download(storage_path('app/' . $pdfPath), $fileName)
                ->deleteFileAfterSend(true);
        } catch (\Exception $e) {
            \Log::error('Multiple Plans PDF Error: ' . $e->getMessage());
            return back()->with('error', 'حدث خطأ أثناء توليد ملف PDF المجمع.');
        }
    }

    /**
     * Check if plan can generate PDF.
     */
    private function canGeneratePDF(Plan $plan): bool
    {
        // Basic requirements
        if (empty($plan->title) || empty($plan->summary)) {
            return false;
        }

        // Must have at least some financial data
        if (!$plan->finance || !$plan->finance->hasBasicFinancials()) {
            return false;
        }

        // Must have market data
        if (!$plan->market || !$plan->market->hasBasicData()) {
            return false;
        }

        // Must have at least one audience
        if ($plan->audiences->isEmpty()) {
            return false;
        }

        return true;
    }

    /**
     * Generate filename for PDF.
     */
    private function generateFileName(Plan $plan, string $suffix = null): string
    {
        $slug = \Str::slug($plan->title);
        $timestamp = Carbon::now()->format('Y-m-d');

        $fileName = "{$slug}-{$timestamp}";

        if ($suffix) {
            $fileName .= "-{$suffix}";
        }

        return "{$fileName}.pdf";
    }
}
