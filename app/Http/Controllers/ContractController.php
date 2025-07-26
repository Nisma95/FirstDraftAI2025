<?php

namespace App\Http\Controllers;

use App\Models\Contract;

use App\Services\AiContractService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;

class ContractController extends Controller
{
    protected $aiContractService;

    public function __construct(AiContractService $aiContractService)
    {
        $this->aiContractService = $aiContractService;
    }

    /**
     * Display a listing of contracts for the authenticated user.
     */
    public function index()
    {
        $contracts = Auth::user()->contracts()
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Contracts/Index', [
            'contracts' => $contracts
        ]);
    }

    /**
     * Show the form for creating a new contract.
     */
    public function create()
    {
        $contractTypes = AiContractService::getEnhancedContractTypes();
        // Get contract templates for pre-filling
        $templates = $this->getContractTemplates();

        // Get user's recent contracts for quick copying
        $recentContracts = Auth::user()->contracts()
            ->select('id', 'title', 'contract_type', 'contract_data')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Contracts/Create', [
            'contractTypes' => $contractTypes,
            'templates' => $templates,
            'recentContracts' => $recentContracts
        ]);
    }

    /**
     * Get contract templates
     */
    private function getContractTemplates()
    {
        return [
            'employment' => [
                'basic' => 'Standard Employment Contract',
                'executive' => 'Executive Employment Agreement',
                'part_time' => 'Part-Time Employment Contract',
                'contractor' => 'Independent Contractor Agreement'
            ],
            'service' => [
                'consulting' => 'Professional Consulting Agreement',
                'maintenance' => 'Service Maintenance Contract',
                'subscription' => 'Subscription Service Agreement'
            ],
            'rental' => [
                'residential' => 'Residential Lease Agreement',
                'commercial' => 'Commercial Lease Agreement',
                'short_term' => 'Short-Term Rental Agreement'
            ],
            'nda' => [
                'mutual' => 'Mutual Non-Disclosure Agreement',
                'one_way' => 'One-Way Non-Disclosure Agreement',
                'employee' => 'Employee Confidentiality Agreement'
            ]
        ];
    }

    /**
     * Generate contract preview
     */
    public function preview(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'contract_type' => 'required|string',
            'contract_details' => 'required|array',
        ]);

        try {
            // Generate preview content (shorter version)
            $previewContent = $this->aiContractService->generateContractPreview(
                $request->contract_type,
                $request->contract_details
            );

            return response()->json([
                'success' => true,
                'preview' => $previewContent
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate preview: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Duplicate an existing contract
     */
    public function duplicate(Contract $contract)
    {
        // Ensure user can only duplicate their own contracts
        if ($contract->user_id !== Auth::id()) {
            abort(403);
        }

        $newContract = $contract->replicate();
        $newContract->title = $contract->title . ' (Copy)';
        $newContract->status = 'draft';
        $newContract->file_path = null;
        $newContract->save();

        return redirect()->route('contracts.show', $newContract)
            ->with('success', 'Contract duplicated successfully!');
    }

    /**
     * Update contract status
     */
    public function updateStatus(Request $request, Contract $contract)
    {
        $request->validate([
            'status' => 'required|in:draft,completed,signed,cancelled'
        ]);

        // Ensure user can only update their own contracts
        if ($contract->user_id !== Auth::id()) {
            abort(403);
        }

        $contract->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => 'Contract status updated successfully!'
        ]);
    }

    /**
     * Get contract analytics
     */
    public function analytics()
    {
        $user = Auth::user();

        $analytics = [
            'total_contracts' => $user->contracts()->count(),
            'completed_contracts' => $user->contracts()->where('status', 'completed')->count(),
            'signed_contracts' => $user->contracts()->where('status', 'signed')->count(),
            'draft_contracts' => $user->contracts()->where('status', 'draft')->count(),
            'contracts_this_month' => $user->contracts()->whereMonth('created_at', now()->month)->count(),
            'contract_types' => $user->contracts()
                ->select('contract_type')
                ->selectRaw('count(*) as count')
                ->groupBy('contract_type')
                ->get()
                ->pluck('count', 'contract_type')
                ->toArray(),
            'recent_activity' => $user->contracts()
                ->select('id', 'title', 'status', 'created_at', 'updated_at')
                ->orderBy('updated_at', 'desc')
                ->take(10)
                ->get()
        ];

        return Inertia::render('Contracts/Analytics', [
            'analytics' => $analytics
        ]);
    }

    /**
     * Generate contract content using AI and create PDF.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'contract_type' => 'required|string',
            'contract_details' => 'required|array',
        ]);

        try {
            Log::info('Contract creation started', [
                'title' => $request->title,
                'contract_type' => $request->contract_type,
                'contract_details' => $request->contract_details
            ]);

            // Generate contract content using AI service
            $contractContent = $this->aiContractService->generateContract(
                $request->contract_type,
                $request->contract_details
            );

            Log::info('AI contract content generated', [
                'content_length' => strlen($contractContent),
                'content_preview' => substr($contractContent, 0, 200)
            ]);

            // Create contract record
            $contract = Contract::create([
                'user_id' => Auth::id(),
                'title' => $request->title,
                'contract_type' => $request->contract_type,
                'content' => $contractContent,
                'contract_data' => $request->contract_details,
                'status' => 'draft',
            ]);

            Log::info('Contract saved to database', [
                'contract_id' => $contract->id,
                'has_content' => !empty($contract->content),
                'has_contract_data' => !empty($contract->contract_data)
            ]);

            // Generate PDF
            $this->generatePDF($contract);

            return response()->json([
                'success' => true,
                'message' => 'Contract created and PDF generated successfully!',
                'contract' => $contract->load('user'),
                'redirect' => route('contracts.show', $contract)
            ]);
        } catch (\Exception $e) {
            Log::error('Contract creation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to create contract: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified contract.
     */
    public function show(Contract $contract)
    {
        // Ensure user can only view their own contracts
        if ($contract->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Contracts/Show', [
            'contract' => $contract->load('user')
        ]);
    }

    /**
     * Download the contract PDF.
     */
    /**
     * Download the contract PDF.
     */
    public function downloadPdf(Contract $contract)
    {
        // Set longer execution time for PDF generation
        set_time_limit(300); // 5 minutes
        ini_set('memory_limit', '512M');

        if ($contract->user_id !== Auth::id()) {
            abort(403);
        }

        if (!$contract->hasPdf()) {
            // If no PDF exists, generate it quickly
            try {
                $this->generatePDF($contract);
            } catch (\Exception $e) {
                return back()->withErrors(['error' => 'Failed to generate PDF: ' . $e->getMessage()]);
            }
        }

        $filePath = storage_path('app/public/' . $contract->file_path);

        if (!file_exists($filePath)) {
            return back()->withErrors(['error' => 'PDF file not found. Regenerating...']);
        }

        $fileName = $contract->title . '_contract.pdf';
        return response()->download($filePath, $fileName);
    }
    /**
     * Generate PDF from contract content using a blade template.
     */
    private function generatePDF(Contract $contract)
    {
        try {
            $pdf = PDF::loadView('pdfs.contract', compact('contract'))
                ->setPaper('a4', 'portrait')
                ->setWarnings(false); // Disable warnings for faster generation

            $fileName = 'contracts/' . $contract->id . '_' . time() . '.pdf';
            $filePath = storage_path('app/public/' . $fileName);

            Storage::disk('public')->makeDirectory('contracts');
            $pdf->save($filePath);

            $contract->update(['file_path' => $fileName]);
        } catch (\Exception $e) {
            Log::error('PDF Generation Error', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * Regenerate PDF for existing contract
     */
    public function regeneratePdf(Contract $contract)
    {
        // Ensure user can only regenerate their own contracts
        if ($contract->user_id !== Auth::id()) {
            abort(403);
        }

        try {
            // Delete old PDF if exists
            if ($contract->file_path && Storage::disk('public')->exists($contract->file_path)) {
                Storage::disk('public')->delete($contract->file_path);
            }

            // Generate new PDF
            $this->generatePDF($contract);

            return response()->json([
                'success' => true,
                'message' => 'PDF regenerated successfully!'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to regenerate PDF: ' . $e->getMessage()
            ], 500);
        }
    }
}
