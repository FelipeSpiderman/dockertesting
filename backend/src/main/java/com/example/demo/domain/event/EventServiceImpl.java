package com.example.demo.domain.event;

import com.example.demo.domain.event.dto.EventDTO;
import com.example.demo.domain.event.dto.PublicEventDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;

    @Autowired
    public EventServiceImpl(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @Override
    @Transactional
    public EventDTO createEvent(EventDTO eventDTO, UUID ownerId) {
        Event event = new Event();
        event.setEventName(eventDTO.getEventName());
        event.setEventLocation(eventDTO.getEventLocation());
        event.setStartDateTime(eventDTO.getStartDateTime());
        event.setEndDateTime(eventDTO.getEndDateTime());
        event.setEventDescription(eventDTO.getEventDescription());
        event.setEventType(eventDTO.getEventType());
        event.setEventUserId(ownerId);

        // Owner als ersten Participant hinzufügen
        Map<UUID, EventRole> participants = new HashMap<>();
        participants.put(ownerId, EventRole.OWNER);
        event.setParticipants(participants);

        Event saved = eventRepository.save(event);
        return toDTO(saved);
    }

    @Override
    public List<PublicEventDTO> getPublicEvents() {
        return eventRepository.findAll().stream()
                .map(this::toPublicDTO)
                .collect(Collectors.toList());
    }

    private PublicEventDTO toPublicDTO(Event event) {
        return new PublicEventDTO(
                event.getId(),
                event.getEventName(),
                event.getEventLocation(),
                event.getStartDateTime(),
                event.getEndDateTime()
        );
    }
    @Override
    public EventDTO findEventById(UUID eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Event not found"));
        return toDTO(event);
    }

    @Override
    public List<EventDTO> findMyEvents(UUID userId) {
        return eventRepository.findAll().stream()
                .filter(event -> event.getParticipants().containsKey(userId))
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<EventDTO> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public EventDTO updateEvent(UUID eventId, EventDTO eventDTO, UUID userId) {
        if (!hasRole(eventId, userId, EventRole.OWNER, EventRole.COLLABORATOR)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only OWNER and COLLABORATOR can update events");
        }

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Event not found"));

        event.setEventName(eventDTO.getEventName());
        event.setEventLocation(eventDTO.getEventLocation());
        event.setStartDateTime(eventDTO.getStartDateTime());
        event.setEndDateTime(eventDTO.getEndDateTime());
        event.setEventDescription(eventDTO.getEventDescription());
        event.setEventType(eventDTO.getEventType());

        Event updated = eventRepository.save(event);
        return toDTO(updated);
    }

    @Override
    @Transactional
    public void deleteEvent(UUID eventId, UUID userId) {
        if (!hasRole(eventId, userId, EventRole.OWNER)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only OWNER can delete events");
        }

        eventRepository.deleteById(eventId);
    }

    @Override
    @Transactional
    public void addParticipant(UUID eventId, UUID participantId, EventRole role, UUID requestingUserId) {
        if (!hasRole(eventId, requestingUserId, EventRole.OWNER, EventRole.COLLABORATOR)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only OWNER and COLLABORATOR can add participants");
        }

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Event not found"));

        if (event.getParticipants().containsKey(participantId)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "User is already a participant");
        }

        event.getParticipants().put(participantId, role);
        eventRepository.save(event);
    }

    @Override
    @Transactional
    public void removeParticipant(UUID eventId, UUID participantId, UUID requestingUserId) {
        if (!hasRole(eventId, requestingUserId, EventRole.OWNER, EventRole.COLLABORATOR)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only OWNER and COLLABORATOR can remove participants");
        }

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Event not found"));

        EventRole participantRole = event.getParticipants().get(participantId);
        if (participantRole == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Participant not found");
        }

        if (participantRole == EventRole.OWNER) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Cannot remove the event owner");
        }

        event.getParticipants().remove(participantId);
        eventRepository.save(event);
    }

    @Override
    @Transactional
    public void updateParticipantRole(UUID eventId, UUID participantId, EventRole newRole, UUID requestingUserId) {
        if (!hasRole(eventId, requestingUserId, EventRole.OWNER)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only OWNER can update participant roles");
        }

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Event not found"));

        EventRole currentRole = event.getParticipants().get(participantId);
        if (currentRole == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Participant not found");
        }

        if (currentRole == EventRole.OWNER && newRole != EventRole.OWNER) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Cannot change the role of the event owner");
        }

        event.getParticipants().put(participantId, newRole);
        eventRepository.save(event);
    }

    @Override
    public boolean hasRole(UUID eventId, UUID userId, EventRole... roles) {
        Event event = eventRepository.findById(eventId).orElse(null);
        if (event == null) {
            return false;
        }

        EventRole userRole = event.getParticipants().get(userId);
        if (userRole == null) {
            return false;
        }

        return Arrays.asList(roles).contains(userRole);
    }

    private EventDTO toDTO(Event event) {
        EventDTO dto = new EventDTO();
        dto.setId(event.getId());
        dto.setEventName(event.getEventName());
        dto.setEventLocation(event.getEventLocation());
        dto.setStartDateTime(event.getStartDateTime());
        dto.setEndDateTime(event.getEndDateTime());
        dto.setEventDescription(event.getEventDescription());
        dto.setEventType(event.getEventType());
        dto.setParticipants(event.getParticipants());
        return dto;
    }
}