package com.greenhouse.model;

import java.io.Serializable;
import java.util.Date;
import jakarta.persistence.*;
import lombok.Data;
@Data
@Entity
@Table(name = "Conversation")
public class Conversation implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ConversationId")
    private int conversationId;

    @Column(name = "ConversationDate")
    private Date conversationDate;

    @Column(name = "Username")
    private String username;
}
