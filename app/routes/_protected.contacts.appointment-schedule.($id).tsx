import { useMemo, useState } from "react";
import {
  Form,
  json,
  useFetcher,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { DateTime } from "luxon";

import getContactById from "~/api/firebase/contacts/getContactById.server";
import { Calendar } from "~/components/ui/calendar";
import { Contact } from "~/api/firebase/contacts/types.server";
import getAppointmentsByDate from "~/api/firebase/appointments-schedule/getAppointmentsByDate";
import { Appointment } from "~/api/firebase/appointments-schedule/types.server";
import AppointmentsList from "~/components/appointments-list";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Label } from "~/components/ui/label";
import generateAvailableTimeSlots from "~/helpers/generate-available-time-slots";
import createAppointment from "~/api/firebase/appointments-schedule/create-appointment";

type LoaderData = {
  contactData: Contact;
  appointments: Appointment[];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { id } = params;
  const url = new URL(request.url);
  const selectedDate = url.searchParams.get("date");
  const defaultDate =
    selectedDate ?? DateTime.fromJSDate(new Date()).toFormat("yyyy-MM-dd");
  const appointments = await getAppointmentsByDate(defaultDate);

  if (id) {
    const contact = (await getContactById(id)) as Contact[];
    return json({ contactData: contact[0], appointments });
  } else {
    return json({ appointments });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const time = formData.get("time") as string;
  const date = formData.get("date") as string;
  const contactName = formData.get("contactName") as string;
  const contactId = formData.get("contactId") as string;

  await createAppointment({
    contactId,
    contactName,
    date,
    time,
  });

  return null;
}

export default function AppointmentSchedule() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedFromTime, setSelectedFromTime] = useState<
    string | undefined
  >();
  const { contactData, appointments } = useLoaderData<LoaderData>();
  const navigate = useNavigate();
  const { submit: submitAppointment, state } = useFetcher();
  const isAppointmentDataSelected = selectedFromTime && date;
  const isSubmitAppointmentLoading = useMemo(
    () => state === "loading" || state === "submitting",
    [state],
  );

  const { state: navigationState } = useNavigation();
  const isLoading = useMemo(
    () => navigationState === "loading" || navigationState === "submitting",
    [navigationState],
  );

  const handleOnCalendarSelect = (date: Date | undefined) => {
    setSelectedFromTime(undefined);
    setDate(date);
    if (date) {
      const formattedDateValue =
        DateTime.fromJSDate(date).toFormat("yyyy-MM-dd");
      navigate(`?date=${formattedDateValue}`, { replace: true });
    }
  };

  const handleOnSaveAppointment = () => {
    if (isAppointmentDataSelected) {
      const formattedDateValue =
        DateTime.fromJSDate(date).toFormat("yyyy-MM-dd");
      submitAppointment(
        {
          time: selectedFromTime,
          date: formattedDateValue,
          contactName: contactData.fullName,
          contactId: contactData.id,
        },
        { method: "post" },
      );
      setSelectedFromTime(undefined);
    }
  };

  return (
    <Form
      method="post"
      className="flex gap-y-4"
      onSubmit={handleOnSaveAppointment}
    >
      <div className="flex flex-col flex-1 gap-2">
        <div>Appointment Schedule</div>
        <div>Contact Name: {contactData.fullName}</div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleOnCalendarSelect}
          className="rounded-md border shadow w-fit"
          disabled={{ before: new Date() }}
        />
        <Label htmlFor="time-from-select">From</Label>
        <Select
          value={selectedFromTime ?? ""}
          onValueChange={setSelectedFromTime}
          disabled={isLoading}
        >
          <SelectTrigger className="w-[180px]" id="time-from-select">
            <SelectValue placeholder="Pick the time" />
          </SelectTrigger>
          <SelectContent>
            {generateAvailableTimeSlots(appointments).map((time) => {
              return (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <Button
          className="w-fit"
          disabled={!isAppointmentDataSelected || isSubmitAppointmentLoading}
        >
          Save Appointment
        </Button>
      </div>
      <div className="flex-1">
        {date && (
          <AppointmentsList appointments={appointments} isLoading={isLoading} />
        )}
      </div>
    </Form>
  );
}
