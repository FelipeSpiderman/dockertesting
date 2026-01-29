package com.example.demo.domain.event;

import com.example.demo.domain.event.dto.EventDTO;
import com.example.demo.domain.event.dto.PublicEventDTO;
import com.example.demo.domain.user.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Validated
@RestController
@RequestMapping("/events")
public class EventController {

    private final EventService eventService;

    @Autowired
    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('EVENT_CREATE')")
    public ResponseEntity<EventDTO> createEvent(
            @Valid @RequestBody EventDTO eventDTO,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        EventDTO created = eventService.createEvent(eventDTO, userDetails.user().getId());
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('EVENT_READ')")
    public ResponseEntity<EventDTO> getEvent(@PathVariable UUID id) {
        EventDTO event = eventService.findEventById(id);
        return ResponseEntity.ok(event);
    }

    @GetMapping("/my-events")
    @PreAuthorize("hasAuthority('EVENT_READ')")
    public ResponseEntity<List<EventDTO>> getMyEvents(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        List<EventDTO> events = eventService.findMyEvents(userDetails.user().getId());
        return ResponseEntity.ok(events);
    }
    @GetMapping("/public")
    public ResponseEntity<List<PublicEventDTO>> getPublicEvents() {
        List<PublicEventDTO> events = eventService.getPublicEvents();
        return ResponseEntity.ok(events);
    }
    @GetMapping("/getAllEvents")
//    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EventDTO>> getAllEvents(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        List<EventDTO> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('EVENT_MODIFY')")
    public ResponseEntity<EventDTO> updateEvent(
            @PathVariable UUID id,
            @Valid @RequestBody EventDTO eventDTO,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        EventDTO updated = eventService.updateEvent(id, eventDTO, userDetails.user().getId());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('EVENT_DELETE')")
    public ResponseEntity<Void> deleteEvent(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        eventService.deleteEvent(id, userDetails.user().getId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{eventId}/participants/{userId}")
    @PreAuthorize("hasAuthority('EVENT_MODIFY')")
    public ResponseEntity<Void> addParticipant(
            @PathVariable UUID eventId,
            @PathVariable UUID userId,
            @RequestParam EventRole role,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        eventService.addParticipant(eventId, userId, role, userDetails.user().getId());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{eventId}/participants/{userId}")
    @PreAuthorize("hasAuthority('EVENT_MODIFY')")
    public ResponseEntity<Void> removeParticipant(
            @PathVariable UUID eventId,
            @PathVariable UUID userId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        eventService.removeParticipant(eventId, userId, userDetails.user().getId());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{eventId}/participants/{userId}/role")
    @PreAuthorize("hasAuthority('EVENT_MODIFY')")
    public ResponseEntity<Void> updateParticipantRole(
            @PathVariable UUID eventId,
            @PathVariable UUID userId,
            @RequestParam EventRole newRole,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        eventService.updateParticipantRole(eventId, userId, newRole, userDetails.user().getId());
        return ResponseEntity.ok().build();
    }
}