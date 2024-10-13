import { db } from "~/api/firebase/serverConfig.server";

const deleteScheduleById = async (id: string) => {
  try {
    const scheduleRef = await db
      .collection("schedules")
      .where("id", "==", id)
      .get();

    scheduleRef.docs.map((doc) => doc.ref.delete());
  } catch (error) {
    console.log(error);
    return error;
  }
};

export default deleteScheduleById;
