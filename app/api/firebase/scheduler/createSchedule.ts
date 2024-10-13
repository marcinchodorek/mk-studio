import { v4 as guid } from 'uuid';

import { admin, db } from '~/api/firebase/serverConfig.server';
import { ScheduleRequestBody } from '~/api/firebase/scheduler/types.server';

const createSchedule = async (newScheduleBody: ScheduleRequestBody) => {
  try {
    await db.collection('schedules').add({
      ...newScheduleBody,
      createdAt: admin.firestore.Timestamp.now(),
      id: guid(),
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};

export default createSchedule;
