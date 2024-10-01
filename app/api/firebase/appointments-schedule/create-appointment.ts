import { v4 as guid } from "uuid";

import { admin, db } from "~/api/firebase/serverConfig.server";
import { AppointmentRequestBody } from "~/api/firebase/appointments-schedule/types.server";

const createAppointment = async (
  newAppointmentBody: AppointmentRequestBody,
) => {
  try {
    await db.collection("appointments").add({
      ...newAppointmentBody,
      createdAt: admin.firestore.Timestamp.now(),
      id: guid(),
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};

export default createAppointment;
