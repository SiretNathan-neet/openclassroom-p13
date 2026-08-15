import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Conversation } from '../models/conversation.model';
import { Message } from '../models/message.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ConversationService {
  private readonly baseUrl = `${environment.apiUrl}/conversations`;

  constructor(private http: HttpClient) {}

  openForClient(clientId: number): Observable<Conversation> {
    return this.http.post<Conversation>(`${this.baseUrl}/client/${clientId}`, {});
  }

  getPending(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.baseUrl}/pending`);
  }

  assignAgent(conversationId: number, agentId: number): Observable<Conversation> {
    return this.http.post<Conversation>(`${this.baseUrl}/${conversationId}/assign/${agentId}`, {});
  }

  getMessages(conversationId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.baseUrl}/${conversationId}/messages`);
  }

  close(conversationId: number): Observable<Conversation> {
    return this.http.post<Conversation>(`${this.baseUrl}/${conversationId}/close`, {});
  }
}