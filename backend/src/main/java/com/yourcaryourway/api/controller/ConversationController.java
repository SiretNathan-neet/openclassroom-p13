package com.yourcaryourway.api.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yourcaryourway.api.dto.ConversationDto;
import com.yourcaryourway.api.dto.MessageDto;
import com.yourcaryourway.api.repository.ConversationRepository;
import com.yourcaryourway.api.repository.MessageRepository;
import com.yourcaryourway.api.service.ConversationService;

@RestController
@RequestMapping("/api/conversations")
public class ConversationController {
    
    private final ConversationService conversationService;
    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;

    public ConversationController(ConversationService conversationService, MessageRepository messageRepository, ConversationRepository conversationRepository) {
        this.conversationService = conversationService;
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
    }

    @PostMapping("/client/{clientId}")
    public ConversationDto openForClient(@PathVariable Long clientId) {
        return ConversationDto.from(conversationService.findOrCreateConversation(clientId));
    }

    @GetMapping("/pending")
    public List<ConversationDto> getPendingConversations() {
        return conversationService.findOpenConversationsWithoutAgent().stream()
                .map(ConversationDto::from)
                .toList();
    }

    @PostMapping("/{id}/assign/{agentId}")
    public ConversationDto assignAgent(@PathVariable Long id, @PathVariable Long agentId) {
        return ConversationDto.from(conversationService.assignAgentToConversation(id, agentId));
    }

    @GetMapping("/{id}/messages")
    public List<MessageDto> getMessages(@PathVariable Long id) {
        return messageRepository.findByConversationOrderBySentAtAsc(conversationRepository.getReferenceById(id))
                .stream()
                .map(MessageDto::from)
                .toList();
    }
}
