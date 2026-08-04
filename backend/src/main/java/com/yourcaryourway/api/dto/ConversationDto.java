package com.yourcaryourway.api.dto;

import java.time.LocalDateTime;

import com.yourcaryourway.api.model.Conversation;
import com.yourcaryourway.api.model.ConversationStatus;

public record ConversationDto(Long id, UserDto client, UserDto agent, ConversationStatus status, LocalDateTime startedAt) {
    public static ConversationDto from(Conversation conversation) {
        return new ConversationDto(
                conversation.getId(),
                UserDto.from(conversation.getUser()),
                conversation.getAgent() != null ? UserDto.from(conversation.getAgent()) : null,
                conversation.getStatus(),
                conversation.getStartedAt()
        );
    }
}
