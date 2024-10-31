import { DateTime } from "luxon";

const generateTimeSlots = (): string[] => {
  const currentHour = DateTime.now().plus({ hour: 2 }).get("hour");
  return Array(17)
    .fill(5)
    .reduce((slots, hour, index) => {
      const currentSlotHour = hour + index;
      if (currentHour > currentSlotHour) {
        return slots;
      }

      const currentHourWithPad = String(hour + index).padStart(2, "0");
      return [...slots, `${currentHourWithPad}:00`, `${currentHourWithPad}:30`];
    }, [] as string[]);
};
export default generateTimeSlots;
