import { Schedule } from "~/api/firebase/scheduler/types.server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Card, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { useCustomFetcher } from "~/hooks";
import { useNavigate } from "@remix-run/react";

type SchedulesListProps = {
  schedules: Schedule[];
  isLoading: boolean;
};

export default function SchedulesList({
  schedules,
  isLoading,
}: SchedulesListProps) {
  const navigate = useNavigate();
  const { submit, state } = useCustomFetcher();
  const isDeleteScheduleLoading = state === "loading" || state === "submitting";

  if (isLoading) {
    return (
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead className="text-right">Availability</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
        <CardContent className="flex flex-col items-center gap-4 justify-center py-4">
          <Skeleton className="w-full h-7" />
          <Skeleton className="w-full h-7" />
          <Skeleton className="w-full h-7" />
          <Skeleton className="w-full h-7" />
        </CardContent>
      </Card>
    );
  }

  if (!schedules.length) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-4">
          <p>No schedules found</p>
        </CardContent>
      </Card>
    );
  }

  const sortedSchedules = schedules.sort((a, b) =>
    a.time.localeCompare(b.time),
  );

  const handleDeleteSchedule = (id: string) => {
    submit(
      {},
      {
        method: "delete",
        action: `/scheduler/${id}/delete`,
      },
    );
  };

  const handleUpdateSchedule = (id: string) => {
    navigate(`/scheduler/${id}/update`);
  };

  return (
    <Card className="flex flex-col gap-y-4 w-full h-fit overflow-y-auto">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSchedules.map(({ time, contactName, id }) => {
              return (
                <TableRow key={id}>
                  <TableCell>{time}</TableCell>
                  <TableCell>{contactName}</TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            data-testid="scheduler-action-button"
                            variant="ghost"
                            disabled={isDeleteScheduleLoading}
                          >
                            <EllipsisVertical />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {/*<DropdownMenuItem*/}
                          {/*  onClick={() => handleUpdateSchedule(id)}*/}
                          {/*>*/}
                          {/*  Edit*/}
                          {/*</DropdownMenuItem>*/}
                          <DropdownMenuItem
                            className="text-destructive"
                            asChild
                          >
                            <AlertDialogTrigger
                              data-testid="actions-delete"
                              className="w-full"
                            >
                              Delete
                            </AlertDialogTrigger>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Schedule Delete</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this schedule?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            data-testid="actions-delete-confirm"
                            onClick={() => handleDeleteSchedule(id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
