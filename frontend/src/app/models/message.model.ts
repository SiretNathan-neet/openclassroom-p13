import { User } from './user.model';
import { SenderType } from './sender-type.model';

export interface Message {
  id: number;
  conversationId: number;
  sender: SenderType;
  senderUser: User | null;
  content: string;
  sentAt: string;
}