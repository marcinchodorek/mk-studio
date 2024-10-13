import { FirebaseError } from 'firebase/app';
import { db } from '~/api/firebase/serverConfig.server';
import { Schedule } from './types.server';

const getSchedulesByDate = async (date: string): Promise<Schedule[]> => {
  try {
    const schedulesRef = await db
      .collection('schedules')
      .where('date', '==', date)
      .get();

    return schedulesRef.docs.map((doc) => doc.data()) as Schedule[];
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw new Error(error.message);
    } else {
      throw new Error('Error while fetching schedules');
    }
  }
};

export default getSchedulesByDate;
