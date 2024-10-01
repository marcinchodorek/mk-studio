const generateTimeSlots = (): string[] => {
  return Array(17)
    .fill(5)
    .reduce((slots, hour, index) => {
      const currentHour = String(hour + index).padStart(2, "0");
      return [...slots, `${currentHour}:00`, `${currentHour}:30`];
    }, [] as string[]);
};
export default generateTimeSlots;
