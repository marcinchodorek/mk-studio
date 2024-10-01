import { E164Number } from "libphonenumber-js";

export type ContactRequestBody = {
  name: string;
  lastName: string;
  fullName: string;
  phoneNumber: string;
};

export type Contact = {
  id: string;
  name: string;
  lastName: string;
  fullName: string;
  phoneNumber: E164Number;
  createdAt: string;
  updatedAt?: string;
};
