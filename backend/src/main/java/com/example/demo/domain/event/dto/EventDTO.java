package com.example.demo.domain.event.dto;

import com.example.demo.domain.event.EventRole;
import com.example.demo.domain.event.EventType;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@NoArgsConstructor
@Setter
@Getter
public class EventDTO {

    private UUID id;

    @NotNull
    @Size(min = 1, max = 50)
    private String eventName;

    @Size(max = 50)
    private String eventLocation;

    @NotNull
    @Future
    private LocalDateTime endDateTime;

    @NotNull
    @Future
    private LocalDateTime startDateTime;

    private String eventDescription;

    @NotNull
    private EventType eventType;

    private Map<UUID, EventRole> participants = new HashMap<>();

    public EventDTO(UUID id, String eventName, String eventLocation,
                    LocalDateTime endDateTime, LocalDateTime startDateTime,
                    String eventDescription, EventType eventType) {
        this.id = id;
        this.eventName = eventName;
        this.eventLocation = eventLocation;
        this.endDateTime = endDateTime;
        this.startDateTime = startDateTime;
        this.eventDescription = eventDescription;
        this.eventType = eventType;
    }
}