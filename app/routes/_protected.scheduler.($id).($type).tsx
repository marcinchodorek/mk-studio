import z from "zod";
import { useCallback, useMemo, useState } from "react";
import {
  Form,
  useFetcher,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { DateTime } from "luxon";

import { Calendar } from "~/components/ui/calendar";
import getSchedulesByDate from "~/api/firebase/scheduler/getSchedulesByDate";
import SchedulesList from "~/components/schedules-list";
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
import createSchedule from "~/api/firebase/scheduler/createSchedule";
import getContactsQuery from "~/api/firebase/contacts/getContactsQuery.server";
import { ReturnLoaderResponse } from "~/constants/types";
import { Combobox } from "~/components/combo-box";
import getContactListOptions from "~/helpers/get-contact-list-options";
import deleteScheduleById from "~/api/firebase/scheduler/deleteScheduleById";
import useTypedParams from "~/hooks/useTypedParams";
import updateScheduleById from "~/api/firebase/scheduler/updateScheduleById";
import getScheduleById from "~/api/firebase/scheduler/getScheduleById";
import { Schedule } from "~/api/firebase/scheduler/types.server";
import twilio from "twilio";
import { useTranslation } from "react-i18next";

export enum SchedulerType {
  Create = "create",
  Update = "update",
  Delete = "delete",
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { id, type } = params;
  const url = new URL(request.url);
  const selectedDate = url.searchParams.get("date");
  const defaultDate =
    selectedDate ?? DateTime.fromJSDate(new Date()).toFormat("yyyy-MM-dd");
  const schedules = await getSchedulesByDate(defaultDate);
  const { contacts, contactsById } = await getContactsQuery();

  if (id && type === "update") {
    const schedule = await getScheduleById(id);
    return {
      schedule,
      schedules,
      contacts,
      contactsById,
      selectedDate: DateTime.fromFormat(
        selectedDate ?? defaultDate,
        "yyyy-MM-dd",
      ).toJSDate(),
    };
  }

  return {
    schedule: {} as Schedule,
    schedules,
    contacts,
    contactsById,
    selectedDate: DateTime.fromFormat(
      selectedDate ?? defaultDate,
      "yyyy-MM-dd",
    ).toJSDate(),
  };
}

type SchedulerLoader = typeof loader;
type SchedulerResponse = ReturnLoaderResponse<SchedulerLoader>;

export async function action({ request, params }: ActionFunctionArgs) {
  const { id, type } = params;
  const formData = await request.formData();

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  const client = twilio(accountSid, authToken);

  switch (type) {
    case SchedulerType.Create: {
      const time = formData.get("time") as string;
      const date = formData.get("date") as string;
      const contactName = formData.get("contactName") as string;
      const contactId = formData.get("contactId") as string;
      const phoneNumber = formData.get("phoneNumber") as string;

      const parsedDate = DateTime.fromFormat(
        `${date} ${time}`,
        "yyyy-MM-dd HH:mm",
      )
        .minus({ hours: 1 })
        .toJSDate();

      const createdMessage = await client.messages.create({
        body: `Przypominamy o nadchodzącej wizycie. Wizyta zaplanowana jest na ${time} dnia ${date}.`,
        from: "Studio MK",
        to: phoneNumber,
        scheduleType: "fixed",
        sendAt: parsedDate,
        messagingServiceSid: "MGcb7300c4278900055af6cb7060e5ee48",
      });

      await createSchedule({
        contactId,
        contactName,
        date,
        time,
        messageId: createdMessage.sid,
      });
      return null;
    }
    case SchedulerType.Update: {
      // const time = formData.get("time") as string;
      // const date = formData.get("date") as string;
      // const contactName = formData.get("contactName") as string;
      // const contactId = formData.get("contactId") as string;
      //
      // await updateScheduleById(id, {
      //   contactId,
      //   contactName,
      //   date,
      //   time,
      // });
      return null;
    }
    case SchedulerType.Delete: {
      const messageId = formData.get("messageId") as string;
      await client.messages(messageId).update({ status: "canceled" });
      await deleteScheduleById(id ?? "");
      return null;
    }
    default: {
      return null;
    }
  }
}

const SchedulerParamsSchema = z.object({
  id: z.string().optional(),
  type: z.nativeEnum(SchedulerType).optional(),
});

export default function Scheduler() {
  const { t } = useTranslation();
  const { id, type } = useTypedParams(SchedulerParamsSchema);
  const { contacts, schedules, contactsById, selectedDate, schedule } =
    useLoaderData<SchedulerResponse>();
  const [date, setDate] = useState<Date | undefined>(
    new Date(selectedDate) ?? new Date(),
  );
  const [selectedFromTime, setSelectedFromTime] = useState<string | undefined>(
    schedule?.time,
  );
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(id);
  const navigate = useNavigate();
  const { submit: submitSchedule, state } = useFetcher();

  const isUpdateSchedulePage = useMemo(
    () => type === SchedulerType.Update,
    [type],
  );

  const contactData = useMemo(
    () =>
      selectedUserId &&
      contactsById[selectedUserId as keyof typeof contactsById],
    [contactsById, selectedUserId],
  );

  const isScheduleDataSelected = selectedFromTime && date && selectedUserId;

  const isSubmitScheduleLoading = useMemo(
    () => state === "loading" || state === "submitting",
    [state],
  );

  const { state: navigationState } = useNavigation();
  const isLoading = useMemo(
    () => navigationState === "loading" || navigationState === "submitting",
    [navigationState],
  );

  const handleOnCalendarSelect = useCallback(
    (date: Date | undefined) => {
      setSelectedFromTime(undefined);
      setDate(date);
      if (date) {
        const formattedDateValue =
          DateTime.fromJSDate(date).toFormat("yyyy-MM-dd");
        navigate(`?date=${formattedDateValue}`, { replace: true });
      }
    },
    [navigate],
  );

  const handleOnSaveSchedule = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isUpdateSchedulePage) {
        console.log("update");
        return;
      }

      if (isScheduleDataSelected && contactData) {
        const formattedDateValue =
          DateTime.fromJSDate(date).toFormat("yyyy-MM-dd");
        submitSchedule(
          {
            time: selectedFromTime,
            date: formattedDateValue,
            contactName: contactData.fullName,
            contactId: contactData.id,
            phoneNumber: contactData.phoneNumber,
          },
          { method: "post", action: `/scheduler/${id}/create` },
        );
        setSelectedFromTime(undefined);
      }
    },
    [
      contactData,
      date,
      id,
      isScheduleDataSelected,
      isUpdateSchedulePage,
      selectedFromTime,
      submitSchedule,
    ],
  );

  return (
    <Form
      method="post"
      className="flex gap-y-4 flex-col md:flex-row"
      onSubmit={handleOnSaveSchedule}
    >
      <div className="flex flex-col flex-1 gap-6">
        <div>
          {t(
            isUpdateSchedulePage
              ? "scheduler_edit_schedule_title"
              : "scheduler_create_schedule_title",
          )}
        </div>
        <Combobox
          id="scheduler-user-combobox"
          testSelector="scheduler-user-combobox"
          label={t("scheduler_user_select_label")}
          value={selectedUserId}
          onChange={setSelectedUserId}
          options={getContactListOptions(contacts)}
          valuesById={contactsById}
          placeholder={t("scheduler_user_search_placeholder")}
        />
        <div>
          <Label htmlFor="scheduler-calendar">
            {t("scheduler_date_input_label")}
          </Label>
          <Calendar
            id="scheduler-calendar"
            mode="single"
            selected={date}
            onSelect={handleOnCalendarSelect}
            className="rounded-md border shadow w-fit"
            disabled={{ before: new Date() }}
          />
        </div>
        <div>
          <Label htmlFor="scheduler-time-select">
            {t("scheduler_time_input_label")}
          </Label>
          <Select
            value={selectedFromTime ?? ""}
            onValueChange={setSelectedFromTime}
            disabled={isLoading}
          >
            <SelectTrigger id="scheduler-time-select" className="w-[180px]">
              <SelectValue
                placeholder={t("scheduler_time_picker_placeholder")}
              />
            </SelectTrigger>
            <SelectContent>
              {generateAvailableTimeSlots(schedules, date).map((time) => {
                return (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <Button
          data-testid="scheduler-save-button"
          className="w-fit"
          disabled={
            !isScheduleDataSelected || isSubmitScheduleLoading || !contactData
          }
        >
          {t(
            isUpdateSchedulePage ? "btn_update_schedule" : "btn_save_schedule",
          )}
        </Button>
      </div>
      <div className="flex-1">
        {date && <SchedulesList schedules={schedules} isLoading={isLoading} />}
      </div>
    </Form>
  );
}
