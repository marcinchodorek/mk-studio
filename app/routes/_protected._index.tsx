import { DateTime } from "luxon";
import getSchedulesByDate from "~/api/firebase/scheduler/getSchedulesByDate";
import { useLoaderData } from "@remix-run/react";
import { ReturnLoaderResponse } from "~/constants/types";
import SchedulesList from "~/components/schedules-list";

export async function loader() {
  const defaultDate = DateTime.fromJSDate(new Date()).toFormat("yyyy-MM-dd");
  const schedules = await getSchedulesByDate(defaultDate);

  return {
    schedules,
  };
}

type GetCurrentSchedulesLoader = typeof loader;
type GetCurrentSchedulesResponse =
  ReturnLoaderResponse<GetCurrentSchedulesLoader>;

export default function Index() {
  const { schedules } = useLoaderData<GetCurrentSchedulesResponse>();

  return <SchedulesList schedules={schedules} />;
}
