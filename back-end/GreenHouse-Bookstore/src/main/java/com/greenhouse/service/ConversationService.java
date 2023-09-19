package com.greenhouse.service;

import com.greenhouse.model.Conversation;

import java.util.List;

public interface ConversationService {

    List<Conversation> findAll();

    Conversation findById(Integer conversationId);

    void add(Conversation entity);

    void update(Conversation entity);

    void delete(Integer conversationId);
}
