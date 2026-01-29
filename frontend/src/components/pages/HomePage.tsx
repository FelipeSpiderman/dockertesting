import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../organisms/Header";
import React, { useContext, useEffect, useState } from "react";
import ActiveUserContext from "../../Contexts/ActiveUserContext";
import api from "../../config/Api";

interface Event {
  id: string;
  eventName: string;
  eventLocation?: string;
  startDateTime: string;
  endDateTime: string;
  eventDescription?: string;
  eventType?: string;
}

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useContext(ActiveUserContext);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let response;
        // Visitor: fetch public events
        // Try to fetch all events, but ignore 403/404 if public access is not allowed
        try {
          response = await api.get("/events/public");
        } catch (error: any) {
          if (
            error.response?.status === 403 ||
            error.response?.status === 404
          ) {
            console.log("Public events not accessible or endpoint not found");
            setEvents([]);
            return;
          }
          throw error;
        }

        const eventsArray = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setEvents(eventsArray);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      }
    };

    fetchEvents();
  }, [user]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f0fcf, #00d4ff)",
      }}
    >
      <Header />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{
          padding: "2rem",
          color: "#fff",
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontFamily: "Arial, sans-serif",
            fontWeight: "bold",
            mb: 2,
            textAlign: "center",
          }}
        >
          Welcome to the Homepage
        </Typography>

        {user && (
          <Box display="flex" justifyContent="center" mb={4}>
            <Button
              variant="contained"
              onClick={() => navigate("/events")}
              sx={{
                backgroundColor: "#fff",
                color: "#0f0fcf",
                fontWeight: "bold",
                padding: "10px 20px",
                "&:hover": {
                  backgroundColor: "#e0e0e0",
                },
              }}
            >
              Go to Events Management
            </Button>
          </Box>
        )}

        <Divider
          sx={{ width: "100%", mb: 4, borderColor: "rgba(255,255,255,0.3)" }}
        />

        <Typography
          variant="h4"
          sx={{ mb: 4, fontWeight: "bold", textAlign: "center" }}
        >
          Latest Events
        </Typography>

        <Grid
          container
          spacing={3}
          justifyContent="center"
          sx={{ maxWidth: "1200px" }}
        >
          {events.map((event) => (
            <Grid item key={event.id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  background: "#fff",
                  borderRadius: "15px",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h6"
                    component="div"
                    gutterBottom
                    color="primary"
                    sx={{ fontWeight: "bold" }}
                  >
                    {event.eventName}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    <strong>Time:</strong> {formatDate(event.startDateTime)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Location:</strong> {event.eventLocation || "N/A"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
