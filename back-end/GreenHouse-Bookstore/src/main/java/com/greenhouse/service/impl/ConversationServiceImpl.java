package com.greenhouse.service.impl;

import com.greenhouse.model.Conversation;
import com.greenhouse.repository.ConversationRepository;
import com.greenhouse.service.ConversationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ConversationServiceImpl implements ConversationService {

    @Autowired
    private ConversationRepository conversationRepository;

    @Override
    public List<Conversation> findAll() {
        return conversationRepository.findAll();
    }

    @Override
    public Conversation findById(Integer conversationId) {
        Optional<Conversation> result = conversationRepository.findById(conversationId);
        return result.orElse(null);
    }

    @Override
    public void add(Conversation conversation) {
        conversationRepository.save(conversation);
    }

    @Override
    public void update(Conversation conversation) {
        conversationRepository.save(conversation);
    }

    @Override
    public void delete(Integer conversationId) {
        conversationRepository.deleteById(conversationId);
    }
}
