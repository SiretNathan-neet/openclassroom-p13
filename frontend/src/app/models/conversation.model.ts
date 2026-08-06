import { ConversationStatus } from "./conversation-status.model";
import { User } from "./user.model";

export interface Conversation {
    id: number;
    client: User;
    agent: User | null;
    status: ConversationStatus;
    startedAt: Date;
}