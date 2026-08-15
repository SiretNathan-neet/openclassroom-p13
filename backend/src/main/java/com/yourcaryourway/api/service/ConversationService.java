package com.yourcaryourway.api.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.yourcaryourway.api.dto.ConversationDto;
import com.yourcaryourway.api.model.Conversation;
import com.yourcaryourway.api.model.ConversationStatus;
import com.yourcaryourway.api.model.User;
import com.yourcaryourway.api.repository.ConversationRepository;
import com.yourcaryourway.api.repository.UserRepository;

@Service
public class ConversationService {
    
    private final UserRepository userRepository;
    private final ConversationRepository conversationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public ConversationService(UserRepository userRepository, ConversationRepository conversationRepository, SimpMessagingTemplate messagingTemplate) {
        this.userRepository = userRepository;
        this.conversationRepository = conversationRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public Conversation findOrCreateConversation(Long clientId) {
        return conversationRepository.findFirstByUser_IdAndStatusNotOrderByStartedAtDesc(clientId, ConversationStatus.CLOSED)
                .orElseGet(() -> {
                    User client = userRepository.findById(clientId).orElseThrow(() -> new NoSuchElementException("Utilisateur introuvable : " + clientId));
                    return conversationRepository.save(new Conversation(client));
                });
    }

    public List<Conversation> findPending() {
        return conversationRepository.findByAgentIsNullAndStatusNot(ConversationStatus.CLOSED);
    }

    public Conversation assignAgent(Long conversationId, Long agentId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new NoSuchElementException("Conversation introuvable : " + conversationId));
        User agent = userRepository.findById(agentId)
                .orElseThrow(() -> new NoSuchElementException("Agent introuvable : " + agentId));

        conversation.setAgent(agent);
        conversation.setStatus(ConversationStatus.HUMAN);
        return conversationRepository.save(conversation);
    }

    public Conversation closeConversation(Long conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new NoSuchElementException("Conversation introuvable : " + conversationId));

        conversation.setStatus(ConversationStatus.CLOSED);
        Conversation saved = conversationRepository.save(conversation);
        messagingTemplate.convertAndSend(
            "/topic/conversations/" + conversationId + "/status", ConversationDto.from(saved));
        return saved;
    }
}
