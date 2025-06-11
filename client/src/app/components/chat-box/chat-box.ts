import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  input,
  ViewChild,
} from '@angular/core';

import { ChatMessage } from './models/chat-message.model';

@Component({
  selector: 'app-chat-box',
  imports: [],
  templateUrl: './chat-box.html',
  styleUrl: './chat-box.scss',
})
export class ChatBox implements AfterViewInit {
  @ViewChild('chatBox') chatBox!: ElementRef<HTMLDivElement>;

  messages = input<ChatMessage[]>([]);
  loading = input<boolean>(false);

  ngAfterViewInit(): void {
    effect(() => {
      this.loading();
      console.log('Messages updated:', this.messages());
      setTimeout(() => {
        this.scrollToBottom();
      });
    });
  }

  scrollToBottom(): void {
    if (this.chatBox?.nativeElement) {
      const el = this.chatBox.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }
}
