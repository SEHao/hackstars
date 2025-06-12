import { Component, effect, ElementRef, input, ViewChild } from '@angular/core';

import { MarkdownPipe } from '../../pipes/markdown-pipe';
import { ChatMessage } from './models/chat-message.model';

@Component({
  selector: 'app-chat-box',
  imports: [MarkdownPipe],
  templateUrl: './chat-box.html',
  styleUrl: './chat-box.scss',
})
export class ChatBox {
  @ViewChild('chatBox') chatBox!: ElementRef<HTMLDivElement>;
  @ViewChild('loadingMessage') loadingMessage!: ElementRef<HTMLDivElement>;

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
    const chatBoxElement = this.chatBox?.nativeElement;
    const loadingMessageElement = this.loadingMessage?.nativeElement;

    if (chatBoxElement && loadingMessageElement) {
      const offsetTop = loadingMessageElement.offsetTop;
      chatBoxElement.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  }
}
