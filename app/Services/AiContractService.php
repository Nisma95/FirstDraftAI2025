<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiContractService
{
    private $apiKey;
    private $baseUrl = 'https://api.openai.com/v1';

    public function __construct()
    {
        $this->apiKey = config('services.openai.api_key');
    }




    /**
     * Generate contract content using OpenAI GPT-4
     */
    public function generateContract(string $contractType, array $contractDetails): string
    {
        try {
            $prompt = $this->buildPrompt($contractType, $contractDetails);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(120)->post($this->baseUrl . '/chat/completions', [
                'model' => 'gpt-4',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are a professional legal contract writer. Generate comprehensive, legally sound contracts based on the provided information. Format the contract with proper sections, headings, and legal language. Include all necessary clauses for the contract type specified.'
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ]
                ],
                'max_tokens' => 4000,
                'temperature' => 0.2,
            ]);

            if (!$response->successful()) {
                Log::error('OpenAI API Error', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                throw new \Exception('Failed to generate contract content: ' . $response->body());
            }

            $data = $response->json();

            if (!isset($data['choices'][0]['message']['content'])) {
                throw new \Exception('Invalid response from OpenAI API');
            }

            return $data['choices'][0]['message']['content'];
        } catch (\Exception $e) {
            Log::error('Contract generation failed', [
                'error' => $e->getMessage(),
                'contract_type' => $contractType,
                'details' => $contractDetails
            ]);
            throw new \Exception('Failed to generate contract: ' . $e->getMessage());
        }
    }

    /**
     * Build detailed prompt for contract generation
     */
    private function buildPrompt(string $contractType, array $contractDetails): string
    {
        $detailsText = '';
        foreach ($contractDetails as $key => $value) {
            if (is_array($value)) {
                $value = implode(', ', $value);
            }
            $detailsText .= ucfirst(str_replace('_', ' ', $key)) . ': ' . $value . "\n";
        }

        $contractTypes = [
            'employment' => 'Employment Contract',
            'service' => 'Service Agreement',
            'rental' => 'Rental Agreement',
            'nda' => 'Non-Disclosure Agreement',
            'freelance' => 'Freelance Contract',
            'partnership' => 'Partnership Agreement',
            'sale' => 'Sale Agreement',
            'consulting' => 'Consulting Agreement'
        ];

        $contractName = $contractTypes[$contractType] ?? ucfirst($contractType) . ' Contract';

        return "Generate a professional {$contractName} with the following specifications:

{$detailsText}

Please structure the contract with:
1. Contract title and parties involved
2. Purpose and scope of the agreement
3. Terms and conditions
4. Payment terms (if applicable)
5. Duration and termination clauses
6. Responsibilities of each party
7. Legal provisions and governing law
8. Signature sections

Ensure the contract is legally comprehensive, professionally formatted, and includes all standard clauses for this type of agreement. Use clear, formal legal language throughout.";
    }

    /**
     * Generate contract preview (shorter version)
     */
    public function generateContractPreview(string $contractType, array $contractDetails): string
    {
        try {
            $prompt = $this->buildPreviewPrompt($contractType, $contractDetails);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(60)->post($this->baseUrl . '/chat/completions', [
                'model' => 'gpt-4',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are a professional legal contract writer. Generate a brief contract preview/summary with key terms and main sections. Keep it concise but comprehensive.'
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ]
                ],
                'max_tokens' => 1000,
                'temperature' => 0.2,
            ]);

            if (!$response->successful()) {
                throw new \Exception('Failed to generate contract preview');
            }

            $data = $response->json();
            return $data['choices'][0]['message']['content'];
        } catch (\Exception $e) {
            Log::error('Contract preview generation failed', [
                'error' => $e->getMessage(),
                'contract_type' => $contractType
            ]);
            throw new \Exception('Failed to generate preview: ' . $e->getMessage());
        }
    }

    /**
     * Build preview prompt
     */
    private function buildPreviewPrompt(string $contractType, array $contractDetails): string
    {
        $detailsText = '';
        foreach ($contractDetails as $key => $value) {
            if (is_array($value)) {
                $value = implode(', ', $value);
            }
            $detailsText .= ucfirst(str_replace('_', ' ', $key)) . ': ' . $value . "\n";
        }

        return "Generate a brief preview/summary for a {$contractType} contract with these details:

{$detailsText}

Please provide:
1. Key contract terms
2. Main obligations of each party
3. Important clauses to include
4. Estimated contract duration/scope

Keep it concise but informative (under 300 words).";
    }

    /**
     * Get enhanced contract types with categories
     */
    public static function getEnhancedContractTypes(): array
    {
        return [
            'employment' => [
                'label' => 'Employment Contracts',
                'description' => 'Hiring, compensation, and employment terms',
                'icon' => 'briefcase',
                'subtypes' => [
                    'employment' => 'Standard Employment Contract',
                    'executive' => 'Executive Employment Agreement',
                    'part_time' => 'Part-Time Employment Contract',
                    'contractor' => 'Independent Contractor Agreement'
                ]
            ],
            'business' => [
                'label' => 'Business Agreements',
                'description' => 'Service agreements and business partnerships',
                'icon' => 'handshake',
                'subtypes' => [
                    'service' => 'Service Agreement',
                    'consulting' => 'Consulting Agreement',
                    'partnership' => 'Partnership Agreement',
                    'joint_venture' => 'Joint Venture Agreement'
                ]
            ],
            'property' => [
                'label' => 'Property & Real Estate',
                'description' => 'Rental, lease, and property agreements',
                'icon' => 'home',
                'subtypes' => [
                    'rental' => 'Rental Agreement',
                    'lease' => 'Commercial Lease',
                    'purchase' => 'Property Purchase Agreement',
                    'management' => 'Property Management Agreement'
                ]
            ],
            'legal' => [
                'label' => 'Legal & Confidentiality',
                'description' => 'NDAs, legal agreements, and compliance',
                'icon' => 'shield',
                'subtypes' => [
                    'nda' => 'Non-Disclosure Agreement',
                    'confidentiality' => 'Confidentiality Agreement',
                    'settlement' => 'Settlement Agreement',
                    'release' => 'Release Agreement'
                ]
            ],
            'freelance' => [
                'label' => 'Freelance & Creative',
                'description' => 'Project-based and creative work agreements',
                'icon' => 'palette',
                'subtypes' => [
                    'freelance' => 'Freelance Contract',
                    'creative' => 'Creative Services Agreement',
                    'licensing' => 'Licensing Agreement',
                    'commission' => 'Commission Agreement'
                ]
            ],
            'sales' => [
                'label' => 'Sales & Commerce',
                'description' => 'Sales agreements and commercial transactions',
                'icon' => 'shopping-cart',
                'subtypes' => [
                    'sale' => 'Sale Agreement',
                    'distribution' => 'Distribution Agreement',
                    'supplier' => 'Supplier Agreement',
                    'reseller' => 'Reseller Agreement'
                ]
            ]
        ];
    }
}
