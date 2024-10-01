import { Appointment } from "~/api/firebase/appointments-schedule/types.server";
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

type AppointmentListProps = {
  appointments: Appointment[];
  isLoading: boolean;
};

export default function AppointmentsList({
  appointments,
  isLoading,
}: AppointmentListProps) {
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

  if (!appointments.length) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-4">
          <p className="font-bold">No appointments found</p>
        </CardContent>
      </Card>
    );
  }

  const sortedAppointments = appointments.sort((a, b) =>
    a.time.localeCompare(b.time),
  );

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
            {sortedAppointments.map(({ time, contactName }) => {
              return (
                <TableRow key={time}>
                  <TableCell>{time}</TableCell>
                  <TableCell>{contactName}</TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost">
                            <EllipsisVertical />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            asChild
                          >
                            <AlertDialogTrigger className="w-full">
                              Delete
                            </AlertDialogTrigger>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Appointment Delete
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this appointment?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction>Delete</AlertDialogAction>
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
