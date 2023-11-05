package com.greenhouse.restcontroller.client;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.greenhouse.model.Notification;
import com.greenhouse.repository.NotificationRepository;

@CrossOrigin("*")
@RestController
@RequestMapping("/customer")
public class NotifyRestController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private NotificationRepository notificationRepository;

    @MessageMapping("/notify/getNotifications/{username}")
    public void getNotifications(@DestinationVariable String username) {
        List<Notification> notifications = notificationRepository.findByUsernameUsername(username);

        // Gửi thông báo đến người dùng
        simpMessagingTemplate.convertAndSend("/topic/notifications", notifications);
    }

    @MessageMapping("/notify")
    public void sendNotification(Notification model) {
        // Lưu thông báo vào cơ sở dữ liệu
        notificationRepository.save(model);

        // Gửi thông báo đến người dùng tới "/topic/notifications/{username}"
        simpMessagingTemplate.convertAndSend("/topic/notifications/" + model.getUsername().getUsername(), model);
    }

}
