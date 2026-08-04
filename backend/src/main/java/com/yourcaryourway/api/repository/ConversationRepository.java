package com.yourcaryourway.api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yourcaryourway.api.model.Conversation;
import com.yourcaryourway.api.model.ConversationStatus;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    Optional<Conversation> findFirstByUser_IdAndStatusNotOrderByStartedAtDesc(Long userId, ConversationStatus excludedStatus);

    List<Conversation> findByAgentIsNullAndStatusNot(ConversationStatus excludedStatus);
}
