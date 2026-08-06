package com.yourcaryourway.api.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.yourcaryourway.api.dto.ChatMessageRequest;
import com.yourcaryourway.api.dto.MessageDto;
import com.yourcaryourway.api.model.Conversation;
import com.yourcaryourway.api.model.Message;
import com.yourcaryourway.api.model.User;
import com.yourcaryourway.api.repository.ConversationRepository;
import com.yourcaryourway.api.repository.MessageRepository;
import com.yourcaryourway.api.repository.UserRepository;


@Controller
public class ChatController {

    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;
    private final MessageRepository messageRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(ConversationRepository conversationRepository,
                          UserRepository userRepository,
                          MessageRepository messageRepository,
                          SimpMessagingTemplate messagingTemplate) {
        this.conversationRepository = conversationRepository;
        this.userRepository = userRepository;
        this.messageRepository = messageRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat.send")
    public void send(ChatMessageRequest request) {
        Conversation conversation = conversationRepository.findById(request.conversationId())
                .orElseThrow(() -> new RuntimeException("Conversation introuvable"));

        User senderUser = request.senderId() != null 
                ? userRepository.findById(request.senderId())
                    .orElseThrow(() -> new RuntimeException("Utilisateur introuvable")) 
                : null;
        
        Message message = new Message(conversation, request.sender(), senderUser, request.content());
        messageRepository.save(message);

        messagingTemplate.convertAndSend("/topic/conversation/" + conversation.getId(), MessageDto.from(message));
    }
}
