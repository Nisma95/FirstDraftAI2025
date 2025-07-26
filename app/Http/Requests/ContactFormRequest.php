<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContactFormRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255|min:2',
            'company' => 'nullable|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string|max:5000|min:10',
        ];
    }

    /**
     * Get custom error messages for validation rules.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Your name is required.',
            'name.min' => 'Your name must be at least 2 characters.',
            'name.max' => 'Your name cannot exceed 255 characters.',
            'email.required' => 'Your email address is required.',
            'email.email' => 'Please provide a valid email address.',
            'email.max' => 'Email address cannot exceed 255 characters.',
            'message.required' => 'Please include a message.',
            'message.min' => 'Your message must be at least 10 characters.',
            'message.max' => 'Your message cannot exceed 5000 characters.',
            'company.max' => 'Company name cannot exceed 255 characters.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'name' => 'name',
            'email' => 'email address',
            'message' => 'message',
            'company' => 'company name',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => trim($this->name),
            'company' => $this->company ? trim($this->company) : null,
            'email' => strtolower(trim($this->email)),
            'message' => trim($this->message),
        ]);
    }
}
