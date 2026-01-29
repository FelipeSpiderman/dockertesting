import { useFormik } from "formik";
import { Event } from "../../../types/models/Event.model";
import { Box, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { object, string, date } from "yup";

interface EventProps {
  event: Event;
  submitActionHandler: (values: Event) => void;
}

const EventForm = ({ event, submitActionHandler }: EventProps) => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      id: event.id,
      title: event ? event.title : "",
      description: event ? event.description : "",
      event_type: event ? event.event_type : "",
      startdate_time: event ? event.startdate_time : new Date(),
      enddate_time: event ? event.enddate_time : new Date(),
      location: event ? event.location : "",
      max_attendees: event ? event.max_attendees : 0,
      issuers: event.issuers,
      allowed_users: event.allowed_users,
      invited_users: event.invited_users,
    },
    validationSchema: object({
      title: string().required().max(50),
      description: string().required().min(2).max(50),
      event_type: string()
        .oneOf(["MEETING", "CONFERENCE", "WORKSHOP", "OTHER"])
        .required(),
      startdate_time: date().required(),
      enddate_time: date().required(),
      location: string().min(2).max(50).required(),
    }),
    onSubmit: (values: Event) => {
      submitActionHandler(values);
    },
    enableReinitialize: true,
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ paddingTop: "15px" }}>
          <TextField
            fullWidth
            id="title"
            name="title"
            label="Title"
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            id="description"
            name="description"
            label="Description"
            multiline
            rows={4}
            value={formik.values.description}
            onChange={formik.handleChange}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            id="event_type"
            name="event_type"
            label="Event Type"
            value={formik.values.event_type}
            onChange={formik.handleChange}
            error={formik.touched.event_type && Boolean(formik.errors.event_type)}
            helperText={formik.touched.event_type && formik.errors.event_type}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            id="location"
            name="location"
            label="Location"
            value={formik.values.location}
            onChange={formik.handleChange}
            error={formik.touched.location && Boolean(formik.errors.location)}
            helperText={formik.touched.location && formik.errors.location}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            id="max_attendees"
            name="max_attendees"
            label="Max Attendees"
            type="number"
            value={formik.values.max_attendees}
            onChange={formik.handleChange}
            error={formik.touched.max_attendees && Boolean(formik.errors.max_attendees)}
            helperText={formik.touched.max_attendees && formik.errors.max_attendees}
            sx={{ mb: 2 }}
          />
          <p>
            Owner of {event.title}:{" "}
            {event.issuers?.map((u) => u.firstName).join(", ") || "None"}
          </p>
          <p>
            editors for this event:{" "}
            {event.allowed_users?.map((u) => u.firstName).join(", ") || "None"}
          </p>
          <p>
            invited people:{" "}
            {event.invited_users?.map((u) => u.firstName).join(", ") || "None"}
          </p>
        </Box>
        <div>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            sx={{ marginTop: "15px" }}
          >
            {event.id ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default EventForm;
