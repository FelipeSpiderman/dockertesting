import api from "../config/Api";
import { Event } from "../types/models/Event.model";

const EventService = {
  getEvent: async (eventID: string): Promise<Event> => {
    const { data } = await api.get<Event>(`/events/${eventID}`);
    return data;
  },

  updateEvent: (event: Event) => {
    return api.put(`/events/${event.id}`, event);
  },

  addEvent: (event: Event) => {
    return api.post("/events", event).then((res) => {
      return res.data;
    });
  },

  getAllEvents: () => {
    return api.get(`/events`);
  },

  deleteEvent: (id: string) => {
    return api.delete(`/events/${id}`);
  },
};

export default EventService;
