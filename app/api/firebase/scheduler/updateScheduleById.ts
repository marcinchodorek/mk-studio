import { admin, db } from "~/api/firebase/serverConfig.server";
import { ScheduleRequestBody } from "~/api/firebase/scheduler/types.server";

const updateScheduleById = async (
  id: string | undefined,
  scheduleBody: ScheduleRequestBody,
) => {
  try {
    const scheduleRef = await db
      .collection("schedules")
      .where("id", "==", id)
      .get();

    scheduleRef.docs.map(
      async (doc) =>
        await doc.ref.update({
          ...scheduleBody,
          updatedAt: admin.firestore.Timestamp.now(),
        }),
    );
  } catch (error) {
    console.log(error);
    return error;
  }
};

export default updateScheduleById;
