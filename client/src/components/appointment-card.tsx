import { format, parseISO } from "date-fns";
import { Calendar, Clock, Video, MapPin, User, MoreVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AppointmentWithDetails, AppointmentStatus, AppointmentType } from "@shared/schema";

interface AppointmentCardProps {
  appointment: AppointmentWithDetails;
  showPatient?: boolean;
  showDoctor?: boolean;
  onCancel?: (id: string) => void;
  onReschedule?: (id: string) => void;
  onJoinVirtual?: (id: string) => void;
}

const statusColors: Record<AppointmentStatus, string> = {
  scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  confirmed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  in_progress: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  completed: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  no_show: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
};

const typeIcons: Record<AppointmentType, typeof Video> = {
  virtual: Video,
  in_person: MapPin,
  follow_up: Calendar,
  emergency: Clock,
};

export function AppointmentCard({
  appointment,
  showPatient = false,
  showDoctor = true,
  onCancel,
  onReschedule,
  onJoinVirtual,
}: AppointmentCardProps) {
  const dateTime = parseISO(appointment.dateTime);
  const endTime = parseISO(appointment.endTime);
  const TypeIcon = typeIcons[appointment.type as AppointmentType] || Calendar;
  const person = showPatient ? appointment.patient : appointment.doctor;
  const personLabel = showPatient ? "Patient" : "Doctor";
  const initials = person ? `${person.firstName?.[0] || ""}${person.lastName?.[0] || ""}` : "?";

  const isUpcoming = new Date(appointment.dateTime) > new Date();
  const canJoinVirtual = appointment.type === "virtual" && 
    appointment.status !== "cancelled" && 
    appointment.status !== "completed";

  return (
    <Card className="overflow-hidden" data-testid={`appointment-card-${appointment.id}`}>
      <div className={`h-1 ${appointment.type === "virtual" ? "bg-primary" : "bg-green-500"}`} />
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-muted text-sm font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">
                  {person ? `${person.firstName} ${person.lastName}` : "Unknown"}
                </span>
                <Badge variant="outline" className={statusColors[appointment.status as AppointmentStatus]}>
                  {appointment.status.replace("_", " ")}
                </Badge>
              </div>
              {person?.specialty && (
                <span className="text-sm text-muted-foreground">{person.specialty}</span>
              )}
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {format(dateTime, "MMM d, yyyy")}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {format(dateTime, "h:mm a")} - {format(endTime, "h:mm a")}
                </span>
                <span className="flex items-center gap-1">
                  <TypeIcon className="h-3.5 w-3.5" />
                  <span className="capitalize">{appointment.type.replace("_", " ")}</span>
                </span>
              </div>
              {appointment.reason && (
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {appointment.reason}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:shrink-0">
            {canJoinVirtual && onJoinVirtual && (
              <Button 
                size="sm" 
                onClick={() => onJoinVirtual(appointment.id)}
                data-testid={`button-join-virtual-${appointment.id}`}
              >
                <Video className="mr-2 h-4 w-4" />
                Join
              </Button>
            )}
            {isUpcoming && appointment.status !== "cancelled" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" data-testid={`button-appointment-menu-${appointment.id}`}>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onReschedule && (
                    <DropdownMenuItem onClick={() => onReschedule(appointment.id)}>
                      Reschedule
                    </DropdownMenuItem>
                  )}
                  {onCancel && (
                    <DropdownMenuItem 
                      onClick={() => onCancel(appointment.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      Cancel Appointment
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
