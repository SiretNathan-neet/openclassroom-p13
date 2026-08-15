package com.yourcaryourway.api.dto;

import java.time.LocalDateTime;

import com.yourcaryourway.api.model.Message;
import com.yourcaryourway.api.model.SenderType;

public record MessageDto(Long id, Long conversationId, SenderType sender, UserDto senderUser, String content, LocalDateTime sentAt) {
    public static MessageDto from(Message message) {
        return new MessageDto(
                message.getId(),
                message.getConversation().getId(),
                message.getSender(),
                message.getSenderUser() != null ? UserDto.from(message.getSenderUser()) : null,
                message.getContent(),
                message.getSentAt()
        );
    }
}
