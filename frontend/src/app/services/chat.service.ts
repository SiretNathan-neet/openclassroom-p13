import { Injectable, signal } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { connect, Observable, Subject } from 'rxjs';
import { Message } from '../models/message.model';
import { SenderType } from '../models/sender-type.model';
import { environment } from '../../environments/environment';
import { Conversation } from '../models/conversation.model';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private client: Client | null = null;
  readonly connected = signal(false);

  connect(conversationId: number): { messages$: Observable<Message>; status$: Observable<Conversation> } {
    const messages$ = new Subject<Message>();
    const status$ = new Subject<Conversation>();

    this.client = new Client({
      webSocketFactory: () => new SockJS(environment.wsUrl),
      onConnect: () => {
        this.connected.set(true);
        this.client!.subscribe(`/topic/conversation/${conversationId}`, (m: IMessage) => {
          messages$.next(JSON.parse(m.body) as Message);
        });
        this.client!.subscribe(`/topic/conversations/${conversationId}/status`, (m: IMessage) => {
          status$.next(JSON.parse(m.body) as Conversation);
        });
      },
      onDisconnect: () => this.connected.set(false),
      onWebSocketClose: () => this.connected.set(false)
    });

    this.client.activate();
    return { messages$: messages$.asObservable(), status$: status$.asObservable() };
  }

  sendMessage(conversationId: number, senderId: number, sender: SenderType, content: string): void {
    if (!this.client || !this.connected()) {
      console.warn('Websocket pas encore connecté - message ignoré');
      return;
    }
    this.client.publish({
      destination: '/app/chat.send',
      body: JSON.stringify({ conversationId, senderId, sender, content })
    });
  }

  disconnect(): void {
    this.client?.deactivate();
    this.client = null;
    this.connected.set(false);
  }
}