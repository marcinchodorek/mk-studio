export type AppointmentRequestBody = {
  contactId: string;
  contactName: string;
  date: string;
  time: string;
};

export type Appointment = {
  id: string;
  contactId: string;
  contactName: string;
  date: string;
  time: string;
  createdAt: string;
  updatedAt?: string;
};
