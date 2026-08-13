import { Component, OnInit, input, signal } from "@angular/core";
import { ChatWindowComponent } from "../chat-window/chat-window.component";
import { CommonModule } from "@angular/common";
import { User } from "../models/user.model";
import { ConversationService } from "../services/conversation.service";
import { Conversation } from "../models/conversation.model";

@Component({
  selector: "app-agent-flow",
  standalone: true,
  imports: [CommonModule, ChatWindowComponent],
  templateUrl: "./agent-flow.component.html",
  styleUrls: ["./agent-flow.component.scss"],
})

export class AgentFlowComponent implements OnInit {
    currentUser = input.required<User>();

    readonly pending = signal<Conversation[]>([]);
    readonly activeConversation = signal<Conversation | null>(null);
    private pollHandle: ReturnType<typeof setInterval> | null = null;

    constructor(private conversationService: ConversationService) {}

    ngOnInit(): void {
        this.refreshPending();
        this.pollHandle = setInterval(() => {
            if (!this.activeConversation()) {
                this.refreshPending();
            }
        }, 3000);
    }

    ngOnDestroy(): void {
        if (this.pollHandle) { clearInterval(this.pollHandle); }
    }

    private refreshPending(): void {
        this.conversationService.getPending().subscribe(list => this.pending.set(list));
    }

    pickUp(conversation: Conversation): void {
        this.conversationService.assignAgent(conversation.id, this.currentUser().id).subscribe(conv => {
            this.activeConversation.set(conv);
        });
    }
}