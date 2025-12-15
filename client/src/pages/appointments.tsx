import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format, addDays, startOfWeek, addWeeks, subWeeks } from "date-fns";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Video,
  MapPin
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AppointmentCard } from "@/components/appointment-card";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { AppointmentWithDetails, User } from "@shared/schema";

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
];

function AppointmentsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function AppointmentsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("in_person");
  const [appointmentReason, setAppointmentReason] = useState("");

  const isPatient = user?.role === "patient";

  const { data: appointments, isLoading } = useQuery<AppointmentWithDetails[]>({
    queryKey: ["/api/appointments"],
  });

  const { data: doctors } = useQuery<User[]>({
    queryKey: ["/api/users/doctors"],
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/appointments", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      setIsBookingOpen(false);
      setSelectedDoctor("");
      setSelectedTime("");
      setAppointmentReason("");
      toast({
        title: "Appointment Booked",
        description: "Your appointment has been scheduled successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const cancelAppointmentMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("PATCH", `/api/appointments/${id}/cancel`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been cancelled.",
      });
    },
  });

  const handleBookAppointment = () => {
    if (!selectedDoctor || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select a doctor and time slot.",
        variant: "destructive",
      });
      return;
    }

    const dateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(":");
    dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const endTime = new Date(dateTime);
    endTime.setMinutes(endTime.getMinutes() + 30);

    createAppointmentMutation.mutate({
      patientId: user?.id,
      doctorId: selectedDoctor,
      dateTime: dateTime.toISOString(),
      endTime: endTime.toISOString(),
      type: selectedType,
      status: "scheduled",
      reason: appointmentReason,
    });
  };

  const upcomingAppointments = appointments?.filter(
    (a) => new Date(a.dateTime) >= new Date() && a.status !== "cancelled"
  ) || [];

  const pastAppointments = appointments?.filter(
    (a) => new Date(a.dateTime) < new Date() || a.status === "completed"
  ) || [];

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="flex flex-col gap-6" data-testid="appointments-page">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-muted-foreground">
            {isPatient ? "Schedule and manage your appointments" : "View and manage patient appointments"}
          </p>
        </div>
        {isPatient && (
          <Button onClick={() => setIsBookingOpen(true)} data-testid="button-book-appointment">
            <Plus className="mr-2 h-4 w-4" />
            Book Appointment
          </Button>
        )}
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList>
          <TabsTrigger value="upcoming" data-testid="tab-upcoming">
            Upcoming ({upcomingAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="past" data-testid="tab-past">
            Past ({pastAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="calendar" data-testid="tab-calendar">
            Calendar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {isLoading ? (
            <AppointmentsSkeleton />
          ) : upcomingAppointments.length > 0 ? (
            <div className="flex flex-col gap-4">
              {upcomingAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  showPatient={!isPatient}
                  showDoctor={isPatient}
                  onCancel={(id) => cancelAppointmentMutation.mutate(id)}
                  onJoinVirtual={(id) => {
                    toast({
                      title: "Joining Virtual Session",
                      description: "Connecting to your virtual care session...",
                    });
                  }}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CalendarIcon className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No upcoming appointments</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {isPatient 
                    ? "Book an appointment to get started"
                    : "No scheduled appointments"
                  }
                </p>
                {isPatient && (
                  <Button className="mt-4" onClick={() => setIsBookingOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Book Appointment
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          {isLoading ? (
            <AppointmentsSkeleton />
          ) : pastAppointments.length > 0 ? (
            <div className="flex flex-col gap-4">
              {pastAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  showPatient={!isPatient}
                  showDoctor={isPatient}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CalendarIcon className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No past appointments</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your appointment history will appear here
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle>Weekly Schedule</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setWeekStart(subWeeks(weekStart, 1))}
                  data-testid="button-prev-week"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">
                  {format(weekStart, "MMM d")} - {format(addDays(weekStart, 6), "MMM d, yyyy")}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setWeekStart(addWeeks(weekStart, 1))}
                  data-testid="button-next-week"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day) => {
                  const dayAppointments = appointments?.filter(
                    (a) => format(new Date(a.dateTime), "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
                  ) || [];
                  const isToday = format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

                  return (
                    <div
                      key={day.toISOString()}
                      className={`min-h-32 rounded-md border p-2 ${
                        isToday ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    >
                      <div className={`mb-2 text-center text-sm font-medium ${isToday ? "text-primary" : ""}`}>
                        <div>{format(day, "EEE")}</div>
                        <div className={`text-lg ${isToday ? "" : "text-muted-foreground"}`}>
                          {format(day, "d")}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        {dayAppointments.slice(0, 3).map((apt) => (
                          <div
                            key={apt.id}
                            className={`truncate rounded px-1 py-0.5 text-xs ${
                              apt.type === "virtual" 
                                ? "bg-primary/20 text-primary" 
                                : "bg-green-500/20 text-green-700 dark:text-green-400"
                            }`}
                          >
                            {format(new Date(apt.dateTime), "h:mm a")}
                          </div>
                        ))}
                        {dayAppointments.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{dayAppointments.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Book an Appointment</DialogTitle>
            <DialogDescription>
              Select a doctor, date, and time for your appointment.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="doctor">Select Doctor</Label>
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger id="doctor" data-testid="select-doctor">
                  <SelectValue placeholder="Choose a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors?.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Appointment Type</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={selectedType === "in_person" ? "default" : "outline"}
                  className="flex-1 gap-2"
                  onClick={() => setSelectedType("in_person")}
                  data-testid="button-type-inperson"
                >
                  <MapPin className="h-4 w-4" />
                  In Person
                </Button>
                <Button
                  type="button"
                  variant={selectedType === "virtual" ? "default" : "outline"}
                  className="flex-1 gap-2"
                  onClick={() => setSelectedType("virtual")}
                  data-testid="button-type-virtual"
                >
                  <Video className="h-4 w-4" />
                  Virtual
                </Button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Select Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                className="rounded-md border"
              />
            </div>

            <div className="grid gap-2">
              <Label>Select Time</Label>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    type="button"
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTime(time)}
                    data-testid={`button-time-${time.replace(":", "")}`}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reason">Reason for Visit</Label>
              <Textarea
                id="reason"
                placeholder="Describe your symptoms or reason for the appointment..."
                value={appointmentReason}
                onChange={(e) => setAppointmentReason(e.target.value)}
                className="resize-none"
                data-testid="input-reason"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBookingOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleBookAppointment}
              disabled={createAppointmentMutation.isPending}
              data-testid="button-confirm-booking"
            >
              {createAppointmentMutation.isPending ? "Booking..." : "Book Appointment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
