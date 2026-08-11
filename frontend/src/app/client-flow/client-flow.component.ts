import { Component, input, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Conversation } from '../models/conversation.model';
import { User } from '../models/user.model';
import { ConversationService } from '../services/conversation.service';
import { ChatWindowComponent } from '../chat-window/chat-window.component';

@Component({
  selector: 'app-client-flow',
  standalone: true,
  imports: [CommonModule, ChatWindowComponent],
  templateUrl: './client-flow.component.html',
  styleUrl: './client-flow.component.scss'
})
export class ClientFlowComponent implements OnInit, OnDestroy {
  currentUser = input.required<User>();

  readonly conversation = signal<Conversation | null>(null);
  private pollHandle: ReturnType<typeof setInterval> | null = null;

  constructor(private conversationService: ConversationService) {}

  ngOnInit(): void {
    this.openConversation();
    this.pollHandle = setInterval(() => {
      if (!this.conversation()?.agent) {
        this.openConversation();
      }
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.pollHandle) clearInterval(this.pollHandle);
  }

  private openConversation(): void {
    this.conversationService.openForClient(this.currentUser().id).subscribe(conv => {
      this.conversation.set(conv);
    });
  }
}