import { Injectable, signal } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { connect, Observable, Subject } from 'rxjs';
import { Message } from '../models/message.model';
import { SenderType } from '../models/sender-type.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private client: Client | null = null;
  readonly connected = signal(false);

  connect(conversationId: number): Observable<Message> {
    const messages$ = new Subject<Message>();

    this.client = new Client({
      webSocketFactory: () => new SockJS(environment.wsUrl),
      onConnect: () => {
        this.connected.set(true);
        this.client!.subscribe(`/topic/conversation/${conversationId}`, (stompMessage: IMessage) => {
          messages$.next(JSON.parse(stompMessage.body) as Message);
        });
      },
      onDisconnect: () => this.connected.set(false),
      onWebSocketClose: () => this.connected.set(false)
    });

    this.client.activate();
    return messages$.asObservable();
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