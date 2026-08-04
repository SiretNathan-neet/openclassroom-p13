package com.yourcaryourway.api.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "message")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "conversation_id", nullable = false)
    private Conversation conversation;

    @Enumerated(EnumType.STRING)
    private SenderType sender;

    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User senderUser;

    private String content;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    protected Message() {}

    public Message(Conversation conversation, SenderType sender, User senderUser, String content) {
        this.conversation = conversation;
        this.sender = sender;
        this.senderUser = senderUser;
        this.content = content;
        this.sentAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public Conversation getConversation() { return conversation; }
    public SenderType getSender() { return sender; }
    public User getSenderUser() { return senderUser; }
    public String getContent() { return content; }
    public LocalDateTime getSentAt() { return sentAt; }
}
