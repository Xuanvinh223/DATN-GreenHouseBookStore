package com.greenhouse.model;

import lombok.Data;
import jakarta.persistence.*;
import java.io.Serializable;

@Data
@Entity
@Table(name = "Message")
public class Message implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MessageId")
    private int messageId;

    @ManyToOne
    @JoinColumn(name = "ConversationId")
    private Conversation conversation;

    @Column(name = "Username")
    private String username;

    @Column(name = "MessageContent", columnDefinition = "nvarchar(max)")
    private String messageContent;
}
