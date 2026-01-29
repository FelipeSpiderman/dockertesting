import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../config/Api';
import ActiveUserContext from '../../../Contexts/ActiveUserContext';
import './eventstyle.css';
import roles from "../../../config/Roles";

interface Event {
    id: string;
    eventName: string;
    eventLocation?: string;
    startDateTime: string;
    endDateTime: string;
    eventDescription?: string;
    eventType: string;
    participants?: Record<string, string>;
}

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    roles?: Array<{
        name: string;
        authorities?: Array<{ name: string }>;
    }>;
}

interface ErrorPopupProps {
    message: string;
    onClose: () => void;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({ message, onClose }) => {
    return (
        <div className="error-popup-overlay" onClick={onClose}>
            <div className="error-popup" onClick={(e) => e.stopPropagation()}>
                <div className="error-popup-header">
                    <span className="error-icon"></span>
                    <h3>Fehler</h3>
                </div>
                <div className="error-popup-body">
                    <p>{message}</p>
                </div>
                <div className="error-popup-footer">
                    <button className="btn btn-primary" onClick={onClose}>
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

interface SuccessPopupProps {
    message: string;
    onClose: () => void;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ message, onClose }) => {
    return (
        <div className="success-popup-overlay" onClick={onClose}>
            <div className="success-popup" onClick={(e) => e.stopPropagation()}>
                <div className="success-popup-header">
                    <span className="success-icon">✓</span>
                    <h3>Erfolg</h3>
                </div>
                <div className="success-popup-body">
                    <p>{message}</p>
                </div>
                <div className="success-popup-footer">
                    <button className="btn btn-primary" onClick={onClose}>
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

interface ConfirmPopupProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmPopup: React.FC<ConfirmPopupProps> = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="confirm-popup-overlay" onClick={onCancel}>
            <div className="confirm-popup" onClick={(e) => e.stopPropagation()}>
                <div className="confirm-popup-header">
                    <span className="confirm-icon">❓</span>
                    <h3>Bestätigung</h3>
                </div>
                <div className="confirm-popup-body">
                    <p>{message}</p>
                </div>
                <div className="confirm-popup-footer">
                    <button className="btn btn-secondary" onClick={onCancel}>
                        Abbrechen
                    </button>
                    <button className="btn btn-danger" onClick={onConfirm}>
                        Bestätigen
                    </button>
                </div>
            </div>
        </div>
    );
};

const EventPage: React.FC = () => {
    const activeUser = useContext(ActiveUserContext);
    const navigate = useNavigate();
    const [events, setEvents] = useState<Event[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showParticipantModal, setShowParticipantModal] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [sortBy, setSortBy] = useState<keyof Event>('startDateTime');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [viewMode, setViewMode] = useState<'my-events' | 'all-events'>('my-events');


    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [confirmAction, setConfirmAction] = useState<{
        message: string;
        action: () => void;
    } | null>(null);

    const [formData, setFormData] = useState({
        eventName: '',
        eventLocation: '',
        startDateTime: '',
        endDateTime: '',
        eventDescription: '',
        eventType: 'CONFERENCE'
    });


    const eventTypes = ['CONFERENCE', 'WORKSHOP', 'MEETING', 'OTHER'];
    const participantRoles = [ roles.OWNER, roles.COLLABORATOR, roles.ATTENDEE, roles.ADMIN];


    const isUserAdmin = (user: User) => {
        return user.roles?.some(role => role.name === 'ADMIN') || false;
    };
    const { user} = useContext(ActiveUserContext);

    const isAdmin = activeUser.checkRole(roles.ADMIN);


    useEffect(() => {
        fetchEvents();
        fetchUsers();
    }, []);

    useEffect(() => {
        filterAndSortEvents();
    }, [events, searchTerm, filterType, sortBy, sortOrder]);
    useEffect(() => {
        setEventPage(1);
    }, [searchTerm, filterType, sortBy, sortOrder]);

    const fetchEvents = async () => {
        try {
            const response = await api.get('/events/getAllEvents');
            console.log('Fetched events:', response.data);
            const eventsArray = Array.isArray(response.data) ? response.data : [response.data];
            setEvents(eventsArray);
        } catch (error: any) {
            console.error('Error fetching events:', error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                setErrorMessage('Bitte zuerst einloggen!');
                setEvents([]);
            } else if (error.response?.status === 404 || error.response?.status === 500) {
                // Fallback if getAllEvents is not available or restricted
                try {
                    const response = await api.get('/events/my-events');
                    const eventsArray = Array.isArray(response.data) ? response.data : [response.data];
                    setEvents(eventsArray);
                } catch (innerError: any) {
                    setErrorMessage('Fehler beim Laden der Events.');
                    setEvents([]);
                }
            } else {
                setErrorMessage('Fehler beim Laden der Events: ' + (error.response?.data?.message || error.message));
                setEvents([]);
            }
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get('/user');
            console.log('Fetched users:', response.data);
            const usersArray = Array.isArray(response.data) ? response.data : [response.data];
            setUsers(usersArray);
        } catch (error: any) {
            console.error('Error fetching users:', error);
            setUsers([]);
        }
    };

    const filterAndSortEvents = () => {
        let filtered = [...events];

        if (searchTerm) {
            filtered = filtered.filter(event =>
                event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.eventLocation?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterType !== 'all') {
            filtered = filtered.filter(event => event.eventType === filterType);
        }

        filtered.sort((a, b) => {
            let aVal: any = a[sortBy];
            let bVal: any = b[sortBy];

            if (typeof sortBy === 'string' && sortBy.includes('DateTime')) {
                aVal = new Date(aVal).getTime();
                bVal = new Date(bVal).getTime();
            } else if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (sortOrder === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        setFilteredEvents(filtered);
    };
    const [eventPage, setEventPage] = useState(1);
    const [eventsPerPage, setEventsPerPage] = useState(10);
    const [participantPage, setParticipantPage] = useState(1);
    const [participantsPerPage, setParticipantsPerPage] = useState(20);
    const indexOfLastEvent = eventPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const paginatedEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
    const totalEventPages = Math.ceil(filteredEvents.length / eventsPerPage);

    const handleCreateEvent = async () => {
        try {
            await api.post('/events', formData);
            setSuccessMessage('Event erfolgreich erstellt!');
            fetchEvents();
            closeModal();
        } catch (error: any) {
            console.error('Error creating event:', error);
            setErrorMessage('Fehler beim Erstellen des Events: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleUpdateEvent = async () => {
        if (!selectedEvent) return;
        try {
            await api.put(`/events/${selectedEvent.id}`, formData);
            setSuccessMessage('Event erfolgreich aktualisiert!');
            fetchEvents();
            closeModal();
        } catch (error: any) {
            console.error('Error updating event:', error);
            setErrorMessage('Fehler beim Aktualisieren des Events: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteEvent = (eventId: string) => {
        setConfirmAction({
            message: 'Möchten Sie dieses Event wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.',
            action: async () => {
                try {
                    await api.delete(`/events/${eventId}`);
                    setSuccessMessage('Event erfolgreich gelöscht!');
                    fetchEvents();
                } catch (error: any) {
                    console.error('Error deleting event:', error);
                    setErrorMessage('Fehler beim Löschen des Events: ' + (error.response?.data?.message || error.message));
                }
                setConfirmAction(null);
            }
        });
    };

    const handleAddParticipant = async (userId: string, role: string) => {
        if (!selectedEvent) return;
        try {
            await api.post(`/events/${selectedEvent.id}/participants/${userId}?role=${role}`);
            setSuccessMessage('Teilnehmer erfolgreich hinzugefügt!');
            fetchEvents();
        } catch (error: any) {
            console.error('Error adding participant:', error);
            setErrorMessage('Fehler beim Hinzufügen des Teilnehmers: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleRemoveParticipant = (userId: string) => {
        const user = users.find(u => u.id === userId);
        const userName = user ? `${user.firstName} ${user.lastName}` : 'diesen Teilnehmer';

        setConfirmAction({
            message: `Möchten Sie ${userName} wirklich aus dem Event entfernen?`,
            action: async () => {
                try {
                    await api.delete(`/events/${selectedEvent?.id}/participants/${userId}`);
                    setSuccessMessage('Teilnehmer erfolgreich entfernt!');
                    fetchEvents();
                } catch (error: any) {
                    console.error('Error removing participant:', error);
                    setErrorMessage('Fehler beim Entfernen des Teilnehmers: ' + (error.response?.data?.message || error.message));
                }
                setConfirmAction(null);
            }
        });
    };

    const handleChangeParticipantRole = async (userId: string, newRole: string) => {
        if (!selectedEvent) return;
        try {
            await api.put(`/events/${selectedEvent.id}/participants/${userId}/role?newRole=${newRole}`);
            setSuccessMessage('Rolle erfolgreich geändert!');
            fetchEvents();
        } catch (error: any) {
            console.error('Error changing participant role:', error);
            setErrorMessage('Fehler beim Ändern der Rolle: ' + (error.response?.data?.message || error.message));
        }
    };

    const openCreateModal = () => {
        setModalMode('create');
        setFormData({
            eventName: '',
            eventLocation: '',
            startDateTime: '',
            endDateTime: '',
            eventDescription: '',
            eventType: 'CONFERENCE'
        });
        setShowModal(true);
    };

    const openEditModal = (event: Event) => {
        setModalMode('edit');
        setSelectedEvent(event);
        setFormData({
            eventName: event.eventName,
            eventLocation: event.eventLocation || '',
            startDateTime: event.startDateTime.slice(0, 16),
            endDateTime: event.endDateTime.slice(0, 16),
            eventDescription: event.eventDescription || '',
            eventType: event.eventType
        });
        setShowModal(true);
    };

    const openParticipantModal = (event: Event) => {
        setSelectedEvent(event);
        setShowParticipantModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setShowParticipantModal(false);
        setSelectedEvent(null);
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleSubmit = () => {
        if (!formData.eventName.trim()) {
            setErrorMessage('Bitte geben Sie einen Event-Namen ein.');
            return;
        }
        if (!formData.startDateTime || !formData.endDateTime) {
            setErrorMessage('Bitte geben Sie Start- und Endzeit ein.');
            return;
        }
        if (new Date(formData.startDateTime) >= new Date(formData.endDateTime)) {
            setErrorMessage('Die Startzeit muss vor der Endzeit liegen.');
            return;
        }

        modalMode === 'create' ? handleCreateEvent() : handleUpdateEvent();
    };

    const getAvailableUsers = () => {
        if (isAdmin) {
            return users.filter(user => !selectedEvent?.participants?.[user.id]);
        } else {
            return users.filter(user =>
                !selectedEvent?.participants?.[user.id] && !isUserAdmin(user)
            );
        }
    };
    const participantsArray = selectedEvent
        ? Object.entries(selectedEvent.participants || {})
            .filter(([_, role]) => role !== "admin")
        : [];


    const indexOfLastParticipant = participantPage * participantsPerPage;
    const indexOfFirstParticipant = indexOfLastParticipant - participantsPerPage;

    const paginatedParticipants = participantsArray.slice(
        indexOfFirstParticipant,
        indexOfLastParticipant
    );

    const totalParticipantPages = Math.ceil(
        participantsArray.length / participantsPerPage
    );

    return (
        <div className="app-container">
            <div className="top-navigation">
                <button className="btn btn-primary" onClick={() => navigate('/')}>
                    Zur Startseite
                </button>
                <button className="btn btn-danger" onClick={activeUser.logout}>
                    Logout
                </button>
            </div>
            <header className="app-header">
                <div className="header-content">
                    <h1>Event Management</h1>
                    {isAdmin && (
                        <div className="view-toggle">
                            <button
                                className={`view-btn ${viewMode === 'my-events' ? 'active' : ''}`}
                                onClick={() => setViewMode('my-events')}
                            >
                                Meine Events
                            </button>
                            <button
                                className={`view-btn ${viewMode === 'all-events' ? 'active' : ''}`}
                                onClick={() => setViewMode('all-events')}
                            >
                                Alle Events (Admin)
                            </button>
                        </div>
                    )}
                </div>
                <button className="btn btn-primary" onClick={openCreateModal}>
                    Neues Event erstellen
                </button>
            </header>

            <div className="controls">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Events durchsuchen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className="filter-controls">
                    <select
                        className="select-input"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="all">Alle Typen</option>
                        {eventTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>

                    <select
                        className="select-input"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as keyof Event)}
                    >
                        <option value="startDateTime">Startzeit</option>
                        <option value="endDateTime">Endzeit</option>
                        <option value="eventName">Name</option>
                        <option value="eventType">Typ</option>
                    </select>

                    <button
                        className="btn btn-secondary"
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    >
                        {sortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                </div>
            </div>

            <div className="events-grid">
                {filteredEvents.length === 0 ? (
                    <div className="no-events">
                        <p>Keine Events gefunden. Erstelle dein erstes Event!</p>
                        <p className="debug-info">Total Events geladen: {events.length}</p>
                    </div>
                ) : (
                    <>
                        {(() => {
                            const myEvents = paginatedEvents.filter(event =>
                                user && event.participants && Object.keys(event.participants).includes(user.id)
                            );
                            const otherEvents = paginatedEvents.filter(event =>
                                !(user && event.participants && Object.keys(event.participants).includes(user.id))
                            );

                            const isAdminView = isAdmin && viewMode === 'all-events';

                            return (
                                <>
                                    {myEvents.length > 0 && (
                                        <div className="event-section">
                                            <h2 className="section-title">Meine Events</h2>
                                            <div className="events-grid-inner">
                                                {myEvents.map(event => (
                                                    <div key={event.id} className="event-card">
                                                        <div className="event-header">
                                                            <h3>{event.eventName}</h3>
                                                            <span className={`event-type-badge ${event.eventType.toLowerCase()}`}>
                                                                {event.eventType}
                                                            </span>
                                                        </div>

                                                        <div className="event-details">
                                                            {event.eventLocation && (
                                                                <p className="event-location"> {event.eventLocation}</p>
                                                            )}
                                                            <p className="event-time">
                                                                 {formatDateTime(event.startDateTime)} - {formatDateTime(event.endDateTime)}
                                                            </p>
                                                            {event.eventDescription && (
                                                                <p className="event-description">{event.eventDescription}</p>
                                                            )}
                                                            <p className="event-participants">
                                                                 {Object.keys(event.participants || {}).length} Teilnehmer
                                                            </p>
                                                        </div>

                                                        <div className="event-actions">
                                                            <button
                                                                className="btn btn-small btn-info"
                                                                onClick={() => openParticipantModal(event)}
                                                            >
                                                                Teilnehmer
                                                            </button>
                                                            <button
                                                                className="btn btn-small btn-secondary"
                                                                onClick={() => openEditModal(event)}
                                                            >
                                                                Bearbeiten
                                                            </button>
                                                            <button
                                                                className="btn btn-small btn-danger"
                                                                onClick={() => handleDeleteEvent(event.id)}
                                                            >
                                                                Löschen
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {otherEvents.length > 0 && (
                                        <div className="event-section">
                                            <h2 className="section-title">Alle Events</h2>
                                            <div className="events-grid-inner">
                                                {otherEvents.map(event => {
                                                    if (isAdminView) {
                                                        return (
                                                            <div key={event.id} className="event-card">
                                                                <div className="event-header">
                                                                    <h3>{event.eventName}</h3>
                                                                    <span className={`event-type-badge ${event.eventType.toLowerCase()}`}>
                                                                        {event.eventType}
                                                                    </span>
                                                                </div>

                                                                <div className="event-details">
                                                                    {event.eventLocation && (
                                                                        <p className="event-location"> {event.eventLocation}</p>
                                                                    )}
                                                                    <p className="event-time">
                                                                         {formatDateTime(event.startDateTime)} - {formatDateTime(event.endDateTime)}
                                                                    </p>
                                                                    {event.eventDescription && (
                                                                        <p className="event-description">{event.eventDescription}</p>
                                                                    )}
                                                                    <p className="event-participants">
                                                                         {Object.keys(event.participants || {}).length} Teilnehmer
                                                                    </p>
                                                                </div>

                                                                <div className="event-actions">
                                                                    <button
                                                                        className="btn btn-small btn-info"
                                                                        onClick={() => openParticipantModal(event)}
                                                                    >
                                                                        Teilnehmer
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-small btn-secondary"
                                                                        onClick={() => openEditModal(event)}
                                                                    >
                                                                        Bearbeiten
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-small btn-danger"
                                                                        onClick={() => handleDeleteEvent(event.id)}
                                                                    >
                                                                        Löschen
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    }

                                                    return (
                                                        <div key={event.id} className="event-card other-event">
                                                            <div className="event-header">
                                                                <h3>{event.eventName}</h3>
                                                                <span className={`event-type-badge ${event.eventType.toLowerCase()}`}>
                                                                    {event.eventType}
                                                                </span>
                                                            </div>
                                                            <div className="event-details">
                                                                <p className="event-time">
                                                                    {formatDateTime(event.startDateTime)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </>
                            );
                        })()}
                    </>
                )}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>{modalMode === 'create' ? 'Neues Event erstellen' : 'Event bearbeiten'}</h2>



                        <div className="form-container">
                            <div className="form-group">
                                <label>Event Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.eventName}
                                    onChange={(e) => setFormData({...formData, eventName: e.target.value})}
                                />
                            </div>

                            <div className="form-group">
                                <label>Ort</label>
                                <input
                                    type="text"
                                    value={formData.eventLocation}
                                    onChange={(e) => setFormData({...formData, eventLocation: e.target.value})}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Startzeit *</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={formData.startDateTime}
                                        onChange={(e) => setFormData({...formData, startDateTime: e.target.value})}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Endzeit *</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={formData.endDateTime}
                                        onChange={(e) => setFormData({...formData, endDateTime: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Event Typ *</label>
                                <select
                                    value={formData.eventType}
                                    onChange={(e) => setFormData({...formData, eventType: e.target.value})}
                                >
                                    {eventTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Beschreibung</label>
                                <textarea
                                    rows={4}
                                    value={formData.eventDescription}
                                    onChange={(e) => setFormData({...formData, eventDescription: e.target.value})}
                                />
                            </div>

                            <div className="modal-actions">
                                <button className="btn btn-secondary" onClick={closeModal}>
                                    Abbrechen
                                </button>
                                <button className="btn btn-primary" onClick={handleSubmit}>
                                    {modalMode === 'create' ? 'Erstellen' : 'Aktualisieren'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showParticipantModal && selectedEvent && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
                        <h2>Teilnehmer verwalten - {selectedEvent.eventName}</h2>

                        <div className="participants-section">
                            <h3>Aktuelle Teilnehmer</h3>
                            <div className="participants-list">
                                {Object.entries(selectedEvent.participants || {}).length === 0 ? (
                                    <p className="no-participants">Keine Teilnehmer vorhanden</p>
                                ) : (
                                    paginatedParticipants.map(([userId, role]) => {
                                        const user = users.find(u => u.id === userId);
                                        if (!user) return null;



                                        return (
                                            <div key={userId} className="participant-item">
                                                <span className="participant-name">
                                                    {user.firstName} {user.lastName}
                                                </span>
                                                <select
                                                    className="select-input-small"
                                                    value={role}
                                                    onChange={(e) => handleChangeParticipantRole(userId, e.target.value)}
                                                >
                                                    {participantRoles.map(r => (
                                                        <option key={r} value={r}>{r}</option>
                                                    ))}
                                                </select>
                                                <button
                                                    className="btn btn-small btn-danger"
                                                    onClick={() => handleRemoveParticipant(userId)}
                                                >
                                                    Entfernen
                                                </button>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                            <div className="pagination">
                                <button
                                    disabled={participantPage === 1}
                                    onClick={() => setParticipantPage(p => p - 1)}
                                >
                                    ← Zurück
                                </button>

                                <span>
        Seite {participantPage} von {totalParticipantPages}
    </span>

                                <button
                                    disabled={participantPage === totalParticipantPages}
                                    onClick={() => setParticipantPage(p => p + 1)}
                                >
                                    Weiter →
                                </button>

                                <select
                                    value={participantsPerPage}
                                    onChange={(e) => {
                                        setParticipantsPerPage(Number(e.target.value));
                                        setParticipantPage(1);
                                    }}
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>

                            <h3>Teilnehmer hinzufügen</h3>
                            <div className="add-participant-section">
                                {getAvailableUsers().length === 0 ? (
                                    <p className="no-participants">Alle verfügbaren Benutzer sind bereits Teilnehmer</p>
                                ) : (
                                    getAvailableUsers().map(user => (
                                        <div key={user.id} className="participant-item">
                                            <span className="participant-name">
                                                {user.firstName} {user.lastName} ({user.email})
                                            </span>
                                            <select
                                                className="select-input-small"
                                                id={`role-${user.id}`}
                                                defaultValue="ATTENDEE"
                                            >
                                                {participantRoles.map(r => (
                                                    <option key={r} value={r}>{r}</option>
                                                ))}
                                            </select>
                                            <button
                                                className="btn btn-small btn-primary"
                                                onClick={() => {
                                                    const selectElement = document.getElementById(`role-${user.id}`) as HTMLSelectElement;
                                                    const role = selectElement?.value || 'ATTENDEE';
                                                    handleAddParticipant(user.id, role);
                                                }}
                                            >
                                                Hinzufügen
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={closeModal}>
                                Schließen
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {errorMessage && (
                <ErrorPopup
                    message={errorMessage}
                    onClose={() => setErrorMessage(null)}
                />
            )}

            {successMessage && (
                <SuccessPopup
                    message={successMessage}
                    onClose={() => setSuccessMessage(null)}
                />
            )}

            {confirmAction && (
                <ConfirmPopup
                    message={confirmAction.message}
                    onConfirm={confirmAction.action}
                    onCancel={() => setConfirmAction(null)}
                />
            )}

            <div className="pagination">
                <button
                    disabled={eventPage === 1}
                    onClick={() => setEventPage(p => p - 1)}
                >
                    ← Zurück
                </button>

                <span>Seite {eventPage} von {totalEventPages}</span>

                <button
                    disabled={eventPage === totalEventPages}
                    onClick={() => setEventPage(p => p + 1)}
                >
                    Weiter →
                </button>

                <select
                    value={eventsPerPage}
                    onChange={(e) => {
                        setEventsPerPage(Number(e.target.value));
                        setEventPage(1);
                    }}
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                </select>
            </div>

        </div>

    );
};

export default EventPage;