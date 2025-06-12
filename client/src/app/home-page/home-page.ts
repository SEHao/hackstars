import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

import { ChatBox } from '../components/chat-box/chat-box';
import { ChatMessage } from '../components/chat-box/models/chat-message.model';
import { HayhooksService } from '../services/hayhooks.service';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, FormsModule, ChatBox],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  messages: ChatMessage[] = [
    {
      role: 'bot',
      content: 'Welcome to Hayhooks! How can I assist you today?',
    },
  ];

  message: string;
  loading = false;

  constructor(private hayhooksService: HayhooksService) {}

  sendMessage(): void {
    this.loading = true;
    const inputMessage = this.message;
    this.messages.push({ role: 'user', content: inputMessage });
    this.hayhooksService
      .sendQueryToPipeline(inputMessage)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.message = '';
        })
      )
      .subscribe({
        next: (response) => {
          this.messages.push({ role: 'bot', content: response });
        },
        error: (err) => {
          console.error('Error sending message:', err);
          this.messages.push({
            role: 'bot',
            content: 'Sorry, something went wrong. Please try again later.',
          });
        },
      });
  }
}
