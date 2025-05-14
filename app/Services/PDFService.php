<?php

namespace App\Services;

use App\Models\Plan;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class PDFService
{
    private $defaultOptions = [
        'watermark' => false,
        'show_premium_content' => true,
        'include_ai_analysis' => true,
        'language' => 'ar',
        'format' => 'standard',
        'orientation' => 'portrait',
    ];

    /**
     * Generate plan PDF.
     */
    public function generatePlanPDF(Plan $plan, array $options = []): string
    {
        $options = array_merge($this->defaultOptions, $options);

        // Load plan data
        $plan->load([
            'project',
            'finance',
            'market',
            'audiences',
            'goals.tasks',
            'aiSuggestions',
        ]);

        // Prepare data for PDF
        $data = $this->preparePDFData($plan, $options);

        // Select appropriate template
        $template = $this->getTemplate($options['format']);

        // Generate PDF
        $pdf = Pdf::loadView($template, $data)
            ->setPaper('a4', $options['orientation'])
            ->setOptions([
                'font_path' => storage_path('fonts/'),
                'font_cache' => storage_path('fonts/'),
                'temp_dir' => storage_path('temp/'),
                'chroot' => storage_path(),
                'enable_font_subsetting' => true,
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled' => true,
                'defaultFont' => 'arabic',
            ]);

        // Add watermark if needed
        if ($options['watermark']) {
            $this->addWatermark($pdf);
        }

        // Save PDF
        $fileName = $this->generateFileName($plan);
        $path = "plans/pdfs/{$fileName}";

        Storage::put($path, $pdf->output());

        return $path;
    }

    /**
     * Generate section-specific PDF.
     */
    public function generateSectionPDF(Plan $plan, array $options = []): string
    {
        $options = array_merge($this->defaultOptions, $options);

        // Load required data for section
        $this->loadSectionData($plan, $options['section']);

        // Prepare section data
        $data = $this->prepareSectionData($plan, $options['section'], $options);

        // Generate PDF
        $pdf = Pdf::loadView("pdfs.sections.{$options['section']}", $data)
            ->setPaper('a4', $options['orientation']);

        // Add watermark if needed
        if ($options['watermark']) {
            $this->addWatermark($pdf);
        }

        // Save PDF
        $fileName = $this->generateFileName($plan, $options['section']);
        $path = "plans/pdfs/sections/{$fileName}";

        Storage::put($path, $pdf->output());

        return $path;
    }

    /**
     * Generate executive summary PDF.
     */
    public function generateExecutiveSummaryPDF(Plan $plan, array $options = []): string
    {
        $options = array_merge($this->defaultOptions, $options);

        // Load required data
        $plan->load(['project', 'finance', 'market']);

        // Prepare summary data
        $data = [
            'plan' => $plan,
            'summary' => $this->generateExecutiveSummaryContent($plan),
            'highlights' => $this->extractKeyHighlights($plan),
            'financials' => $options['include_financials'] ? $this->getFinancialSummary($plan) : null,
            'options' => $options,
            'generated_at' => Carbon::now(),
        ];

        // Generate PDF
        $pdf = Pdf::loadView('pdfs.executive-summary', $data)
            ->setPaper('a4', 'portrait');

        // Save PDF
        $fileName = $this->generateFileName($plan, 'executive-summary');
        $path = "plans/pdfs/summaries/{$fileName}";

        Storage::put($path, $pdf->output());

        return $path;
    }

    /**
     * Generate multiple plans as portfolio PDF.
     */
    public function generateMultiplePlansPDF($plans, array $options = []): string
    {
        $options = array_merge($this->defaultOptions, $options);

        // Prepare data for each plan
        $portfolioData = [
            'plans' => [],
            'options' => $options,
            'generated_at' => Carbon::now(),
            'user' => auth()->user(),
        ];

        foreach ($plans as $plan) {
            $plan->load(['project', 'finance', 'market', 'audiences']);
            $portfolioData['plans'][] = $this->preparePDFData($plan, $options);
        }

        // Generate PDF
        $pdf = Pdf::loadView('pdfs.portfolio', $portfolioData)
            ->setPaper('a4', 'portrait');

        // Save PDF
        $fileName = 'business-plans-portfolio-' . Carbon::now()->format('Y-m-d') . '.pdf';
        $path = "plans/pdfs/portfolios/{$fileName}";

        Storage::put($path, $pdf->output());

        return $path;
    }

    /**
     * Email PDF to recipients.
     */
    public function emailPDF(array $emailData): void
    {
        Mail::send('emails.plan-pdf', [
            'message' => $emailData['message'],
            'sender_name' => $emailData['sender_name'],
            'plan' => $emailData['plan'],
        ], function ($mail) use ($emailData) {
            $mail->to($emailData['recipients'])
                ->subject($emailData['subject'])
                ->from(config('mail.from.address'), config('mail.from.name'));

            foreach ($emailData['attachments'] as $attachment) {
                $mail->attach($attachment['path'], [
                    'as' => $attachment['name'],
                    'mime' => $attachment['mime'],
                ]);
            }
        });
    }

    /**
     * Prepare PDF data.
     */
    private function preparePDFData(Plan $plan, array $options): array
    {
        $data = [
            'plan' => $plan,
            'project' => $plan->project,
            'options' => $options,
            'generated_at' => Carbon::now(),
            'user' => $plan->project->user,
        ];

        // Add sections based on format
        switch ($options['format']) {
            case 'professional':
                $data['sections'] = $this->getProfessionalSections($plan, $options);
                break;
            case 'standard':
                $data['sections'] = $this->getStandardSections($plan, $options);
                break;
            case 'preview':
                $data['sections'] = $this->getPreviewSections($plan, $options);
                break;
            case 'branded':
                $data['branding'] = $options['branding'] ?? [];
                $data['sections'] = $this->getBrandedSections($plan, $options);
                break;
        }

        return $data;
    }

    /**
     * Get template for PDF format.
     */
    private function getTemplate(string $format): string
    {
        $templates = [
            'professional' => 'pdfs.templates.professional',
            'standard' => 'pdfs.templates.standard',
            'preview' => 'pdfs.templates.preview',
            'branded' => 'pdfs.templates.branded',
            'portfolio' => 'pdfs.templates.portfolio',
        ];

        return $templates[$format] ?? $templates['standard'];
    }

    /**
     * Add watermark to PDF.
     */
    private function addWatermark($pdf): void
    {
        $pdf->setOptions([
            'isHtml5ParserEnabled' => true,
            'isRemoteEnabled' => true,
            'customOptions' => [
                'dpi' => 150,
                'enable_php' => true,
            ],
        ]);

        // Add watermark style
        $pdf->getDomPDF()->getCanvas()->page_script(function ($pageNumber, $pageCount, $canvas, $fontMetrics) {
            $canvas->set_opacity(.1);
            $canvas->text(150, 500, 'نسخة مجانية - ترقية للنسخة الكاملة', 'Arial', 30, [0, 0, 0], 45);
        });
    }

    /**
     * Generate file name for PDF.
     */
    private function generateFileName(Plan $plan, string $suffix = null): string
    {
        $slug = \Str::slug($plan->title);
        $timestamp = Carbon::now()->format('Ymd_His');

        $fileName = "{$slug}_{$timestamp}";

        if ($suffix) {
            $fileName .= "_{$suffix}";
        }

        return "{$fileName}.pdf";
    }

    /**
     * Get professional sections.
     */
    private function getProfessionalSections(Plan $plan, array $options): array
    {
        return [
            'cover' => $this->generateCoverPage($plan),
            'toc' => $this->generateTableOfContents($plan),
            'executive_summary' => $this->generateExecutiveSummaryContent($plan),
            'market_analysis' => $this->generateMarketAnalysis($plan),
            'marketing_strategy' => $this->generateMarketingStrategy($plan),
            'financial_plan' => $this->generateFinancialPlan($plan),
            'swot_analysis' => $options['show_premium_content'] ? $this->generateSWOTAnalysis($plan) : null,
            'operational_plan' => $options['show_premium_content'] ? $this->generateOperationalPlan($plan) : null,
            'ai_insights' => $options['include_ai_analysis'] ? $this->generateAIInsights($plan) : null,
            'appendix' => $this->generateAppendix($plan),
        ];
    }

    /**
     * Get standard sections.
     */
    private function getStandardSections(Plan $plan, array $options): array
    {
        return [
            'cover' => $this->generateCoverPage($plan),
            'executive_summary' => $this->generateExecutiveSummaryContent($plan),
            'market_analysis' => $this->generateMarketAnalysis($plan),
            'financial_plan' => $this->generateFinancialPlan($plan),
        ];
    }

    /**
     * Get preview sections.
     */
    private function getPreviewSections(Plan $plan, array $options): array
    {
        return [
            'cover' => $this->generateCoverPage($plan),
            'executive_summary' => $this->generateExecutiveSummaryContent($plan),
            'preview_notice' => 'هذه معاينة من خطة العمل. للحصول على النسخة الكاملة يرجى الترقية.',
        ];
    }

    /**
     * Load section-specific data.
     */
    private function loadSectionData(Plan $plan, string $section): void
    {
        $loadMaps = [
            'market' => ['market', 'audiences'],
            'finance' => ['finance'],
            'swot' => ['market', 'finance', 'goals'],
            'operations' => ['goals.tasks', 'audiences'],
            'marketing' => ['audiences', 'market'],
        ];

        if (isset($loadMaps[$section])) {
            $plan->load($loadMaps[$section]);
        }
    }

    /**
     * Generate executable summary content.
     */
    private function generateExecutiveSummaryContent(Plan $plan): string
    {
        $ai_summary = $plan->ai_analysis['executive_summary'] ?? '';

        if (!empty($ai_summary)) {
            return $ai_summary;
        }

        // Generate fallback summary
        $summary = "**نظرة عامة على المشروع**\n\n";
        $summary .= $plan->summary ?? '';
        $summary .= "\n\n**السوق المستهدف**\n\n";
        $summary .= $plan->market->target_market ?? 'غير محدد';
        $summary .= "\n\n**الموارد المالية**\n\n";

        if ($plan->finance) {
            $summary .= "- رأس المال المطلوب: " . $plan->finance->formatted_initial_budget . "\n";
            $summary .= "- الدخل المتوقع: " . $plan->finance->formatted_expected_income . "\n";
            $summary .= "- الربح المتوقع: " . $plan->finance->formatted_profit_estimate . "\n";
        }

        return $summary;
    }

    /**
     * Extract key highlights.
     */
    private function extractKeyHighlights(Plan $plan): array
    {
        $highlights = [];

        if ($plan->finance) {
            $highlights[] = [
                'title' => 'رأس المال المطلوب',
                'value' => $plan->finance->formatted_initial_budget,
                'icon' => 'currency',
            ];

            if ($plan->finance->break_even_months) {
                $highlights[] = [
                    'title' => 'نقطة التعادل',
                    'value' => $plan->finance->break_even_months . ' شهر',
                    'icon' => 'calendar',
                ];
            }
        }

        if ($plan->market) {
            $highlights[] = [
                'title' => 'حجم السوق',
                'value' => $plan->market->market_size ?? 'غير محدد',
                'icon' => 'chart',
            ];
        }

        return $highlights;
    }

    /**
     * Generate cover page data.
     */
    private function generateCoverPage(Plan $plan): array
    {
        return [
            'title' => $plan->title,
            'project_name' => $plan->project->name,
            'company' => $plan->project->user->name,
            'date' => Carbon::now()->format('F Y'),
            'logo' => $plan->project->user->profile_photo ?? null,
        ];
    }

    /**
     * Generate other sections...
     */
    private function generateTableOfContents(Plan $plan): array
    { /* ... */
    }
    private function generateMarketAnalysis(Plan $plan): array
    { /* ... */
    }
    private function generateMarketingStrategy(Plan $plan): array
    { /* ... */
    }
    private function generateFinancialPlan(Plan $plan): array
    { /* ... */
    }
    private function generateSWOTAnalysis(Plan $plan): array
    { /* ... */
    }
    private function generateOperationalPlan(Plan $plan): array
    { /* ... */
    }
    private function generateAIInsights(Plan $plan): array
    { /* ... */
    }
    private function generateAppendix(Plan $plan): array
    { /* ... */
    }
}
