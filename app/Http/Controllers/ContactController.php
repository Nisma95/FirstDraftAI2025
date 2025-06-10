<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactFormSubmitted;
use App\Mail\ContactFormNotification;

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

            // Send confirmation email to user (optional)
            try
            {
                Mail::to($contact->email)->send(new ContactFormSubmitted($contact));
            }
            catch (\Exception $e)
            {
                // Log email error but don't fail the request
                \Log::warning('Failed to send contact confirmation email: ' . $e->getMessage());
            }

            // Send notification email to admin (optional)
            try
            {
                $adminEmail = config('mail.admin_email', 'admin@firstdraft.sa');
                Mail::to($adminEmail)->send(new ContactFormNotification($contact));
            }
            catch (\Exception $e)
            {
                // Log email error but don't fail the request
                \Log::warning('Failed to send contact notification email: ' . $e->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Thank you for your message! We\'ll get back to you soon.',
                'contact_id' => $contact->id
            ], 201);
        }
        catch (\Exception $e)
        {
            \Log::error('Contact form submission failed: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Something went wrong. Please try again later.'
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
}
