import { db } from "~/api/firebase/serverConfig.server";
import { FirebaseError } from "firebase/app";
import { Schedule } from "~/api/firebase/scheduler/types.server";

const getScheduleById = async (id: string): Promise<Schedule> => {
  try {
    const scheduleRef = await db
      .collection("schedules")
      .where("id", "==", id)
      .get();

    return scheduleRef.docs.map((doc) => doc.data())[0] as Schedule;
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw new Error(error.message);
    } else {
      throw new Error("Error while fetching schedules");
    }
  }
};

export default getScheduleById;
