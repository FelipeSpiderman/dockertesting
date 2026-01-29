import { User } from "./User.model";

export type Event = {
  id: string;
  title: string;
  description: string;
  event_type: string;
  startdate_time: Date;
  enddate_time: Date;
  location: string;
  max_attendees: number;
  issuers: User[];
  allowed_users: User[];
  invited_users: User[];
};
