package com.example.demo.domain.event.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class PublicEventDTO {

    private UUID id;
    private String eventName;
    private String eventLocation;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
}