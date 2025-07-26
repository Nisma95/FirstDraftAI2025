<?php

namespace App\Mail;

use App\Models\Contact;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Queue\SerializesModels;

class ContactFormSubmitted extends Mailable
{
    use Queueable, SerializesModels;

    public Contact $contact;

    public function __construct(Contact $contact)
    {
        $this->contact = $contact;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Thank you for contacting us - First Draft',
            from: new Address('contact@firstdraft.sa', 'First Draft'),
            replyTo: [
                new Address('admin@firstdraft.sa', 'First Draft Support')
            ],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.contact.submitted',
            with: [
                'contact' => $this->contact,
                'appName' => 'First Draft',
            ],
        );
    }
}
