import { Component } from '@angular/core';

export interface Faq {
  question: string;
  answer: string;
  open?: boolean;
}

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent {
  faqs: Faq[] = [
    { question: 'How do I reset my password?', answer: 'To reset your password, go to the settings page and click "Forgot Password." Follow the instructions sent to your email.' },
    { question: 'How do I change my email address?', answer: 'You can change your email address from your account settings. Ensure to verify the new email address.' },
    { question: 'Where can I find my order history?', answer: 'Your order history is available under the "Orders" section in your account.' },
    { question: 'What payment methods are accepted?', answer: 'We accept Visa, MasterCard, PayPal, and Apple Pay for your convenience.' },
    { question: 'How can I contact customer support?', answer: 'You can reach our support team via the "Contact Us" page, or email us at support@example.com.' }
  ];

  newQuestion: string = '';

  toggleFaq(faq: Faq): void {
    faq.open = !faq.open;
  }

  addQuestion(): void {
    if (this.newQuestion.trim()) {
      this.faqs.push({ question: this.newQuestion, answer: 'Answer pending...', open: false });
      this.newQuestion = '';
    }
  }
}
