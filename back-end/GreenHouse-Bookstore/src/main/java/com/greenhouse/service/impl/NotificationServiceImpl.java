package com.greenhouse.service.impl;

import com.greenhouse.model.Notification;
import com.greenhouse.repository.NotificationRepository;
import com.greenhouse.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public List<Notification> findAll() {
        return notificationRepository.findAll();
    }

    @Override
    public Notification findById(Integer notificationId) {
        Optional<Notification> result = notificationRepository.findById(notificationId);
        return result.orElse(null);
    }

    @Override
    public void add(Notification notification) {
        notificationRepository.save(notification);
    }

    @Override
    public void update(Notification notification) {
        notificationRepository.save(notification);
    }

    @Override
    public void delete(Integer notificationId) {
        notificationRepository.deleteById(notificationId);
    }
}
