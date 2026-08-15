package com.yourcaryourway.api.dto;

import com.yourcaryourway.api.model.SenderType;

public record ChatMessageRequest(Long conversationId, Long senderId, SenderType sender, String content) {
}
