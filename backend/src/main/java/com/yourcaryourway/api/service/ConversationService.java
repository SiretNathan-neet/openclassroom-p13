package com.yourcaryourway.api.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.yourcaryourway.api.model.Conversation;
import com.yourcaryourway.api.model.ConversationStatus;
import com.yourcaryourway.api.model.User;
import com.yourcaryourway.api.repository.ConversationRepository;
import com.yourcaryourway.api.repository.UserRepository;

@Service
public class ConversationService {
    
    private final UserRepository userRepository;
    private final ConversationRepository conversationRepository;

    public ConversationService(UserRepository userRepository, ConversationRepository conversationRepository) {
        this.userRepository = userRepository;
        this.conversationRepository = conversationRepository;
    }

    public Conversation findOrCreateConversation(Long userId) {
        return conversationRepository.findFirstByUser_IdAndStatusNotOrderByStartedAtDesc(userId, ConversationStatus.CLOSED)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
                    Conversation newConversation = new Conversation(user);
                    return conversationRepository.save(newConversation);
                });
    }

    public List<Conversation> findOpenConversationsWithoutAgent() {
        return conversationRepository.findByAgentIsNullAndStatusNot(ConversationStatus.CLOSED);
    }

    public Conversation assignAgentToConversation(Long conversationId, Long agentId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation introuvable"));
        User agent = userRepository.findById(agentId)
                .orElseThrow(() -> new RuntimeException("Agent introuvable"));

        conversation.setAgent(agent);
        conversation.setStatus(ConversationStatus.HUMAN);
        return conversationRepository.save(conversation);
    }
}
