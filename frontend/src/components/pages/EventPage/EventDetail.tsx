import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Event } from "../../../types/models/Event.model.js";
import EventService from "../../../Services/EventService.js";
import EventForm from "../../molecules/EventForm/EventForm.js";
import { useEffect, useState } from "react";
import { Box, Button, Typography, Paper, Divider } from "@mui/material";

const EventDetail = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const location = useLocation();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (eventId) {
      setLoading(true);
      setError(null);
      EventService.getEvent(eventId)
        .then((res) => {
          setEvent(res);
        })
        .catch((err) => {
          console.error("Failed to fetch event", err);
          setError("Failed to load event.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
      setIsEditing(true);
    }
  }, [eventId]);

  useEffect(() => {
    if (location.pathname.endsWith("/edit")) {
      setIsEditing(true);
    } else if (eventId) {
      setIsEditing(false);
    }
  }, [location.pathname, eventId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!event && eventId) {
    return <div>Event not found</div>;
  }

  const defaultEvent: Event = {
    id: "",
    title: "",
    description: "",
    event_type: "",
    startdate_time: new Date(),
    enddate_time: new Date(),
    location: "",
    max_attendees: 0,
    issuers: [],
    allowed_users: [],
    invited_users: [],
  };

  const submitActionHandler = (values: Event) => {
    if (eventId !== undefined) {
      EventService.updateEvent(values)
        .then(() => {
          setIsEditing(false);
          // Refresh event data to show updated details
          EventService.getEvent(eventId).then((res) => setEvent(res));
          navigate(`/events/${eventId}`);
        })
        .catch((err) => {
          console.error("Failed to update event", err);
          alert("Failed to update event");
        });
    } else {
      EventService.addEvent(values)
        .then((res) => {
          navigate("/events/" + res.id);
        })
        .catch((err) => {
          console.error("Failed to add event", err);
          alert("Failed to add event");
        });
    }
  };

  if (isEditing) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {eventId ? "Edit Event" : "Create Event"}
        </Typography>
        <EventForm
          event={event || defaultEvent}
          submitActionHandler={submitActionHandler}
        />
        {eventId && (
          <Button
            variant="outlined"
            onClick={() => setIsEditing(false)}
            sx={{ mt: 2 }}
          >
            Cancel
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {event?.title}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1" gutterBottom>
          <strong>Description:</strong> {event?.description}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Type:</strong> {event?.event_type}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Location:</strong> {event?.location}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Start:</strong>{" "}
          {event?.startdate_time
            ? new Date(event.startdate_time).toLocaleString()
            : "N/A"}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>End:</strong>{" "}
          {event?.enddate_time
            ? new Date(event.enddate_time).toLocaleString()
            : "N/A"}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Max Attendees:</strong> {event?.max_attendees}
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1">
            <strong>Owners:</strong>{" "}
            {event?.issuers?.map((u) => u.firstName).join(", ") || "None"}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Editors:</strong>{" "}
            {event?.allowed_users?.map((u) => u.firstName).join(", ") || "None"}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Invited:</strong>{" "}
            {event?.invited_users?.map((u) => u.firstName).join(", ") || "None"}
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsEditing(true)}
          sx={{ mt: 3 }}
        >
          Edit
        </Button>
      </Paper>
    </Box>
  );
};

export default EventDetail;
