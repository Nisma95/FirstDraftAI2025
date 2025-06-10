<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\Mailer\Transport\Smtp\EsmtpTransport;
use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mime\Email;

class ContactController extends Controller
{
    /**
     * Store a new contact form submission with working email
     */
    public function store(Request $request): JsonResponse
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'company' => 'nullable|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string|max:5000',
        ]);

        if ($validator->fails())
        {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try
        {
            // Create the contact record
            $contact = Contact::create([
                'name' => $request->name,
                'company' => $request->company,
                'email' => $request->email,
                'message' => $request->message,
                'status' => 'new',
                'metadata' => [
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                    'referer' => $request->header('referer'),
                    'submitted_at' => now()->toISOString(),
                ]
            ]);

            \Log::info('Contact form submitted', [
                'contact_id' => $contact->id,
                'email' => $contact->email,
                'name' => $contact->name
            ]);

            // Email sending using direct SMTP (bypassing Laravel config issues)
            $emailResults = [
                'user_email_sent' => false,
                'admin_email_sent' => false,
                'errors' => []
            ];

            // Setup SMTP transport
            $transport = new EsmtpTransport('mail.firstdraft.sa', 465, true);
            $transport->setUsername('contact@firstdraft.sa');
            $transport->setPassword('B8tV#k2$!mY');
            $mailer = new Mailer($transport);

            // Send confirmation email to user
            try
            {
                $userEmail = (new Email())
                    ->from('contact@firstdraft.sa')
                    ->to($contact->email)
                    ->subject('Thank you for contacting us - First Draft')
                    ->html($this->getUserEmailTemplate($contact));

                $mailer->send($userEmail);
                $emailResults['user_email_sent'] = true;
                \Log::info('User confirmation email sent', ['to' => $contact->email]);
            }
            catch (\Exception $e)
            {
                $emailResults['errors'][] = 'User email failed: ' . $e->getMessage();
                \Log::error('Failed to send user confirmation email', [
                    'contact_id' => $contact->id,
                    'to' => $contact->email,
                    'error' => $e->getMessage()
                ]);
            }

            // Send notification email to admin
            try
            {
                $adminEmail = (new Email())
                    ->from('contact@firstdraft.sa')
                    ->to('admin@firstdraft.sa')
                    ->replyTo($contact->email)
                    ->subject('New Contact Form Submission - ' . $contact->name)
                    ->html($this->getAdminEmailTemplate($contact));

                $mailer->send($adminEmail);
                $emailResults['admin_email_sent'] = true;
                \Log::info('Admin notification email sent', ['to' => 'admin@firstdraft.sa']);
            }
            catch (\Exception $e)
            {
                $emailResults['errors'][] = 'Admin email failed: ' . $e->getMessage();
                \Log::error('Failed to send admin notification email', [
                    'contact_id' => $contact->id,
                    'error' => $e->getMessage()
                ]);
            }

            // Prepare response
            $message = 'Thank you for your message! We\'ll get back to you soon.';

            if (!empty($emailResults['errors']))
            {
                $message .= ' (Some email notifications may have failed - check logs for details)';
            }

            return response()->json([
                'success' => true,
                'message' => $message,
                'contact_id' => $contact->id,
                'email_status' => $emailResults
            ], 201);
        }
        catch (\Exception $e)
        {
            \Log::error('Contact form submission failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Something went wrong. Please try again later.',
                'error' => app()->hasDebugModeEnabled() ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Generate user confirmation email template
     */
    private function getUserEmailTemplate($contact)
    {
        return '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #5956e9; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
                .message-box { background: #f3f4f6; border-left: 4px solid #5956e9; padding: 20px; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Thank You, ' . htmlspecialchars($contact->name) . '!</h1>
                </div>
                <div class="content">
                    <p>Thank you for reaching out to us! We\'ve received your message and will get back to you within 24 hours.</p>
                    
                    <div class="message-box">
                        <h3>Your Message:</h3>
                        <p><em>"' . htmlspecialchars($contact->message) . '"</em></p>
                    </div>
                    
                    <p>Contact ID: #' . str_pad($contact->id, 6, '0', STR_PAD_LEFT) . '</p>
                    <p>Submitted: ' . $contact->created_at->format('M d, Y \a\t g:i A') . '</p>
                    
                    <p>Best regards,<br><strong>The First Draft Team</strong></p>
                </div>
            </div>
        </body>
        </html>';
    }

    /**
     * Generate admin notification email template
     */
    private function getAdminEmailTemplate($contact)
    {
        return '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
                .field { margin-bottom: 15px; }
                .label { font-weight: bold; color: #555; }
                .value { margin-top: 5px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🚨 New Contact Form Submission</h1>
                </div>
                <div class="content">
                    <div class="field">
                        <div class="label">Name:</div>
                        <div class="value"><strong>' . htmlspecialchars($contact->name) . '</strong></div>
                    </div>
                    
                    <div class="field">
                        <div class="label">Email:</div>
                        <div class="value"><a href="mailto:' . htmlspecialchars($contact->email) . '">' . htmlspecialchars($contact->email) . '</a></div>
                    </div>
                    
                    ' . ($contact->company ? '<div class="field"><div class="label">Company:</div><div class="value">' . htmlspecialchars($contact->company) . '</div></div>' : '') . '
                    
                    <div class="field">
                        <div class="label">Message:</div>
                        <div class="value">' . nl2br(htmlspecialchars($contact->message)) . '</div>
                    </div>
                    
                    <div class="field">
                        <div class="label">Submitted At:</div>
                        <div class="value">' . $contact->created_at->format('M d, Y \a\t g:i A T') . '</div>
                    </div>
                    
                    <p><strong>Contact ID:</strong> #' . str_pad($contact->id, 6, '0', STR_PAD_LEFT) . '</p>
                    <p><a href="mailto:' . htmlspecialchars($contact->email) . '?subject=Re:%20Your%20Contact%20Form%20Submission">📧 Reply to ' . htmlspecialchars($contact->name) . '</a></p>
                </div>
            </div>
        </body>
        </html>';
    }

    /**
     * Get a specific contact
     */
    public function show(Contact $contact): JsonResponse
    {
        // Mark as read when viewing
        if ($contact->status === 'new')
        {
            $contact->markAsRead();
        }

        return response()->json([
            'success' => true,
            'data' => $contact
        ]);
    }

    /**
     * Update contact status
     */
    public function updateStatus(Request $request, Contact $contact): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:new,read,replied,archived'
        ]);

        if ($validator->fails())
        {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $contact->update(['status' => $request->status]);

        // Update timestamps based on status
        if ($request->status === 'read' && !$contact->read_at)
        {
            $contact->markAsRead();
        }
        elseif ($request->status === 'replied')
        {
            $contact->markAsReplied();
        }

        return response()->json([
            'success' => true,
            'message' => 'Contact status updated successfully',
            'data' => $contact->fresh()
        ]);
    }

    /**
     * Delete a contact
     */
    public function destroy(Contact $contact): JsonResponse
    {
        try
        {
            $contact->delete();

            return response()->json([
                'success' => true,
                'message' => 'Contact deleted successfully'
            ]);
        }
        catch (\Exception $e)
        {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete contact'
            ], 500);
        }
    }

    /**
     * Get contact statistics
     */
    public function stats(): JsonResponse
    {
        $stats = [
            'total' => Contact::count(),
            'new' => Contact::byStatus('new')->count(),
            'read' => Contact::byStatus('read')->count(),
            'replied' => Contact::byStatus('replied')->count(),
            'archived' => Contact::byStatus('archived')->count(),
            'this_week' => Contact::recent(7)->count(),
            'this_month' => Contact::recent(30)->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
