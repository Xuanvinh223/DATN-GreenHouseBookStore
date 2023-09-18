package com.greenhouse.model;

import java.io.Serializable;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "Message")
public class Message implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MessageId")
    private int messageId;

    @ManyToOne
    @JoinColumn(name = "ConversationId")
    private Conversation conversation;

    @ManyToOne
    @JoinColumn(name = "Username")
    private Accounts username;

    @Column(name = "MessageContent", columnDefinition = "nvarchar(max)")
    private String messageContent;

    // Các phương thức getters và setters đã được tự động tạo bởi Lombok.
}
