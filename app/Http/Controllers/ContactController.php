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
     * Store a new contact form submission
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

            // Setup SMTP transport (using the working configuration)
            $transport = new EsmtpTransport('mail.firstdraft.sa', 465, true);
            $transport->setUsername('contact@firstdraft.sa');
            $transport->setPassword('B8tV#k2$!mY');
            $mailer = new Mailer($transport);

            $emailResults = [
                'user_email_sent' => false,
                'admin_email_sent' => false,
                'errors' => []
            ];

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
     * Get all contacts (for admin panel)
     */
    public function index(Request $request): JsonResponse
    {
        $query = Contact::query();

        // Filter by status if provided
        if ($request->has('status'))
        {
            $query->byStatus($request->status);
        }

        // Search functionality
        if ($request->has('search'))
        {
            $search = $request->search;
            $query->where(function ($q) use ($search)
            {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('company', 'like', "%{$search}%")
                    ->orWhere('message', 'like', "%{$search}%");
            });
        }

        // Order by latest
        $query->orderBy('created_at', 'desc');

        // Paginate results
        $contacts = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $contacts
        ]);
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
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Thank you for contacting us</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; margin: 0; padding: 0; }
                .email-wrapper { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
                .header { background: linear-gradient(135deg, #5956e9 0%, #7c3aed 100%); color: white; padding: 40px 30px; text-align: center; }
                .header h1 { font-size: 28px; font-weight: 600; margin: 0 0 8px 0; }
                .header p { font-size: 16px; opacity: 0.9; margin: 0; }
                .content { padding: 40px 30px; }
                .greeting { font-size: 20px; font-weight: 600; color: #1f2937; margin-bottom: 20px; }
                .message-box { background: #f3f4f6; border-left: 4px solid #5956e9; padding: 20px; margin: 24px 0; border-radius: 8px; }
                .message-box h3 { color: #374151; font-size: 16px; margin: 0 0 12px 0; }
                .message-box p { color: #6b7280; font-style: italic; line-height: 1.6; margin: 0; }
                .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 24px 0; }
                .info-item { background: #f9fafb; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb; }
                .info-label { font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
                .info-value { color: #1f2937; font-weight: 500; }
                .footer { background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; }
                .footer p { color: #6b7280; font-size: 14px; margin: 0 0 16px 0; }
                @media (max-width: 600px) {
                    .email-wrapper { margin: 20px; border-radius: 8px; }
                    .header, .content, .footer { padding: 24px 20px; }
                    .info-grid { grid-template-columns: 1fr; }
                }
            </style>
        </head>
        <body>
            <div class="email-wrapper">
                <div class="header">
                    <div style="font-size: 24px; margin-bottom: 12px;">🎉</div>
                    <h1>Thank You!</h1>
                    <p>We\'ve received your message and will get back to you soon</p>
                </div>
                
                <div class="content">
                    <div class="greeting">Hi ' . htmlspecialchars($contact->name) . ',</div>
                    
                    <p style="color: #4b5563; margin-bottom: 20px;">
                        Thank you for reaching out to us! We\'ve successfully received your message and our team will review it carefully. 
                        You can expect to hear back from us within 24 hours.
                    </p>
                    
                    <div class="message-box">
                        <h3>Your Message:</h3>
                        <p>"' . htmlspecialchars($contact->message) . '"</p>
                    </div>
                    
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">Submission ID</div>
                            <div class="info-value">#' . str_pad($contact->id, 6, '0', STR_PAD_LEFT) . '</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Submitted At</div>
                            <div class="info-value">' . $contact->created_at->format('M d, Y \a\t g:i A') . '</div>
                        </div>
                    </div>
                    
                    <p style="color: #4b5563; margin-top: 24px;">
                        If you have any urgent questions or need immediate assistance, please don\'t hesitate to contact us directly at admin@firstdraft.sa.
                    </p>
                </div>
                
                <div class="footer">
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
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>New Contact Form Submission</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; margin: 0; padding: 0; }
                .email-wrapper { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
                .header { background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 40px 30px; text-align: center; }
                .header h1 { font-size: 28px; font-weight: 600; margin: 0 0 8px 0; }
                .header p { font-size: 16px; opacity: 0.9; margin: 0; }
                .content { padding: 40px 30px; }
                .alert-badge { display: inline-block; background: #fef2f2; color: #dc2626; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; margin-bottom: 24px; border: 1px solid #fecaca; }
                .contact-details { background: #f9fafb; border-radius: 12px; padding: 24px; margin: 24px 0; border: 1px solid #e5e7eb; }
                .detail-row { display: flex; margin-bottom: 16px; align-items: flex-start; }
                .detail-row:last-child { margin-bottom: 0; }
                .detail-label { min-width: 100px; font-weight: 600; color: #374151; font-size: 14px; }
                .detail-value { flex: 1; color: #1f2937; word-break: break-word; }
                .message-content { background: white; border: 2px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-top: 8px; white-space: pre-wrap; line-height: 1.6; }
                .actions { background: #f3f4f6; padding: 24px; border-radius: 8px; margin: 24px 0; }
                .actions h3 { color: #374151; font-size: 16px; margin: 0 0 16px 0; }
                .btn { display: inline-block; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 500; font-size: 14px; margin-right: 12px; margin-bottom: 8px; }
                .btn-primary { background: #5956e9; color: white; }
                @media (max-width: 600px) {
                    .email-wrapper { margin: 20px; border-radius: 8px; }
                    .header, .content { padding: 24px 20px; }
                    .detail-row { flex-direction: column; gap: 4px; }
                    .detail-label { min-width: auto; }
                }
            </style>
        </head>
        <body>
            <div class="email-wrapper">
                <div class="header">
                    <h1>🚨 New Contact Form</h1>
                    <p>Someone just submitted a contact form on your website</p>
                </div>
                
                <div class="content">
                    <div class="alert-badge">⚡ Requires Response</div>
                    
                    <p style="color: #4b5563; margin-bottom: 24px;">
                        You have received a new contact form submission. Please review the details below and respond as needed.
                    </p>
                    
                    <div class="contact-details">
                        <div class="detail-row">
                            <div class="detail-label">Name:</div>
                            <div class="detail-value"><strong>' . htmlspecialchars($contact->name) . '</strong></div>
                        </div>
                        
                        <div class="detail-row">
                            <div class="detail-label">Email:</div>
                            <div class="detail-value">
                                <a href="mailto:' . htmlspecialchars($contact->email) . '" style="color: #5956e9; text-decoration: none;">
                                    ' . htmlspecialchars($contact->email) . '
                                </a>
                            </div>
                        </div>
                        
                        ' . ($contact->company ? '<div class="detail-row"><div class="detail-label">Company:</div><div class="detail-value">' . htmlspecialchars($contact->company) . '</div></div>' : '') . '
                        
                        <div class="detail-row">
                            <div class="detail-label">Submitted:</div>
                            <div class="detail-value">' . $contact->created_at->format('M d, Y \a\t g:i A T') . '</div>
                        </div>
                        
                        <div class="detail-row">
                            <div class="detail-label">Message:</div>
                            <div class="detail-value">
                                <div class="message-content">' . htmlspecialchars($contact->message) . '</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="actions">
                        <h3>Quick Actions</h3>
                        <a href="mailto:' . htmlspecialchars($contact->email) . '?subject=Re:%20Your%20Contact%20Form%20Submission&body=Hi%20' . htmlspecialchars($contact->name) . ',%0D%0A%0D%0AThank%20you%20for%20contacting%20us..." class="btn btn-primary">
                            📧 Reply via Email
                        </a>
                    </div>
                </div>
            </div>
        </body>
        </html>';
    }
}
