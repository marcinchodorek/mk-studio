import { Schedule } from "~/api/firebase/scheduler/types.server";
import generateTimeSlots from "~/helpers/generate-time-slots";

const generateAvailableTimeSlots = (
  appointments: Schedule[],
  date: Date | undefined,
): string[] => {
  const timeSlots = generateTimeSlots(date);

  return timeSlots.filter((time) => {
    const appointment = appointments.find(
      (appointment) => appointment.time === time,
    );
    return !appointment;
  });
};

export default generateAvailableTimeSlots;
