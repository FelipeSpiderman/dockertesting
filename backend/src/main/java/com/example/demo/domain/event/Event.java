package com.example.demo.domain.event;

import com.example.demo.core.generic.AbstractEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "event")
@NoArgsConstructor
@Accessors(chain = true)
public class Event extends AbstractEntity {

    @Column(name = "event_name", nullable = false, length = 50)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String eventName;

    @Column(name = "event_location", length = 50)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String eventLocation;

    @Column(name = "end_date_time", nullable = false)
    @JdbcTypeCode(SqlTypes.TIMESTAMP)
    private LocalDateTime endDateTime;

    @Column(name = "start_date_time", nullable = false)
    private LocalDateTime startDateTime;

    @Column(name = "event_description")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String eventDescription;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false)
    private EventType eventType;

    @Column(name = "user_id", nullable = false)
    @JdbcTypeCode(SqlTypes.UUID)
    private UUID eventUserId;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "event_participants",
            joinColumns = @JoinColumn(name = "event_id"))
    @MapKeyColumn(name = "user_id")
    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private Map<UUID, EventRole> participants = new HashMap<>();
}