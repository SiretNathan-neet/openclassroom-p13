package com.yourcaryourway.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yourcaryourway.api.model.Conversation;
import com.yourcaryourway.api.model.Message;

public interface MessageRepository extends JpaRepository<Message, Long> {
    
    List<Message> findByConversationOrderBySentAtAsc(Conversation conversation);
}
