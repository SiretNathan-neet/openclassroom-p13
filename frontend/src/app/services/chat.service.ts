import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Observable, Subject } from 'rxjs';
import { Message } from '../models/message.model';
import { SenderType } from '../models/sender-type.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private client: Client | null = null;

  connect(conversationId: number): Observable<Message> {
    const messages$ = new Subject<Message>();

    this.client = new Client({
      webSocketFactory: () => new SockJS(environment.wsUrl),
      onConnect: () => {
        this.client!.subscribe(`/topic/conversation/${conversationId}`, (stompMessage: IMessage) => {
          messages$.next(JSON.parse(stompMessage.body) as Message);
        });
      }
    });

    this.client.activate();
    return messages$.asObservable();
  }

  sendMessage(conversationId: number, senderId: number, sender: SenderType, content: string): void {
    this.client?.publish({
      destination: '/app/chat.send',
      body: JSON.stringify({ conversationId, senderId, sender, content })
    });
  }

  disconnect(): void {
    this.client?.deactivate();
    this.client = null;
  }
}