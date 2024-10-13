export type ScheduleRequestBody = {
  contactId: string;
  contactName: string;
  date: string;
  time: string;
};

export type Schedule = {
  id: string;
  contactId: string;
  contactName: string;
  date: string;
  time: string;
  createdAt: string;
  updatedAt?: string;
};
