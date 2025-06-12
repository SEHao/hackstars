import { Component, effect, ElementRef, input, ViewChild } from '@angular/core';

import { ChatMessage } from './models/chat-message.model';

@Component({
  selector: 'app-chat-box',
  imports: [],
  templateUrl: './chat-box.html',
  styleUrl: './chat-box.scss',
})
export class ChatBox {
  @ViewChild('#chatMessage') chatMessage!: ElementRef<HTMLDivElement>;

  messages = input<ChatMessage[]>([]);
  loading = input<boolean>(false);

  constructor() {
    effect(() => {
      this.loading();
      setTimeout(() => {
        this.scrollToBottom();
      });
    });
  }

  scrollToBottom(): void {
    if (this.chatMessage?.nativeElement) {
      this.chatMessage.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
