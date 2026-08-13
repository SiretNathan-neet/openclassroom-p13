import { Component, input, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Message } from '../models/message.model';
import { User } from '../models/user.model';
import { SenderType } from '../models/sender-type.model';
import { ConversationService } from '../services/conversation.service';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.scss'
})
export class ChatWindowComponent implements OnInit, OnDestroy {
  conversationId = input.required<number>();
  currentUser = input.required<User>();

  readonly messages = signal<Message[]>([]);
  draft = '';

  constructor(private conversationService: ConversationService, protected chatService: ChatService) {}

  ngOnInit(): void {
    this.conversationService.getMessages(this.conversationId()).subscribe(history => {
      this.messages.set(history);
    });

    this.chatService.connect(this.conversationId()).subscribe(message => {
      this.messages.update(msgs => [...msgs, message]);
    });
  }

  ngOnDestroy(): void {
    this.chatService.disconnect();
  }

  send(): void {
    const content = this.draft.trim();
    if (!content) return;

    const sender: SenderType = this.currentUser().role === 'AGENT' ? 'AGENT' : 'USER';
    this.chatService.sendMessage(this.conversationId(), this.currentUser().id, sender, content);
    this.draft = '';
  }

  isMine(message: Message): boolean {
    return message.senderUser?.id === this.currentUser().id;
  }
}