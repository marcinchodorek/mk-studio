import { Schedule } from "~/api/firebase/scheduler/types.server";
import generateTimeSlots from "~/helpers/generate-time-slots";

const generateAvailableTimeSlots = (appointments: Schedule[]): string[] => {
  const timeSlots = generateTimeSlots();

  return timeSlots.filter((time) => {
    const appointment = appointments.find(
      (appointment) => appointment.time === time,
    );
    return !appointment;
  });
};

export default generateAvailableTimeSlots;
