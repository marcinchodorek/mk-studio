import { DateTime } from "luxon";

const generateTimeSlots = (date: Date | undefined): string[] => {
  if (!date) {
    return [];
  }

  const now = DateTime.now();
  const dateValue = DateTime.fromJSDate(date);
  const isToday = now.hasSame(dateValue, "day");

  const currentHourWithOffset = now.plus({ hour: 2 }).get("hour");

  return Array(17)
    .fill(5)
    .reduce((slots, hour, index) => {
      const currentSlotHour = hour + index;
      if (currentHourWithOffset > currentSlotHour && isToday) {
        return slots;
      }

      const currentHourWithPad = String(hour + index).padStart(2, "0");
      return [...slots, `${currentHourWithPad}:00`, `${currentHourWithPad}:30`];
    }, [] as string[]);
};
export default generateTimeSlots;
