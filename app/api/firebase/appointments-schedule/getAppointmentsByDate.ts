import { db } from "~/api/firebase/serverConfig.server";

const getAppointmentsByDate = async (date: string) => {
  try {
    const appointmentsRef = await db
      .collection("appointments")
      .where("date", "==", date)
      .get();

    return appointmentsRef.docs.map((doc) => doc.data());
  } catch (error) {
    console.log(error);
    return error;
  }
};

export default getAppointmentsByDate;
