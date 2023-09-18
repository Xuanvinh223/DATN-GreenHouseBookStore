package com.greenhouse.service;

import com.greenhouse.model.Notification;

import java.util.List;

public interface NotificationService {

    List<Notification> findAll();

    Notification findById(Integer notificationId);

    void add(Notification entity);

    void update(Notification entity);

    void delete(Integer notificationId);
}
