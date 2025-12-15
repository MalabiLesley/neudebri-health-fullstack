import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Video, Calendar, Clock, Shield, Mic, Camera, MonitorUp, Phone } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import type { AppointmentWithDetails } from "@shared/schema";

export default function VirtualCarePage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: virtualAppointments } = useQuery<AppointmentWithDetails[]>({
    queryKey: ["/api/appointments/virtual"],
  });

  const upcomingVirtual = virtualAppointments?.filter(
    (a) => new Date(a.dateTime) >= new Date() && a.status !== "cancelled"
  ) || [];

  const handleJoinSession = () => {
    toast({
      title: "Connecting to Virtual Session",
      description: "Please wait while we connect you to your healthcare provider...",
    });
  };

  return (
    <div className="flex flex-col gap-6" data-testid="virtual-care-page">
      <div>
        <h1 className="text-3xl font-bold">Virtual Care</h1>
        <p className="text-muted-foreground">
          Connect with your healthcare provider from anywhere
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Get Care Now
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 p-6">
                <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                    <Video className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">24/7 Virtual Care Access</h3>
                    <p className="mt-1 text-muted-foreground">
                      Connect with a healthcare provider instantly via secure video consultation
                    </p>
                  </div>
                  <Button size="lg" onClick={handleJoinSession} data-testid="button-start-visit">
                    Start Virtual Visit
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex items-center gap-3 rounded-lg border p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-100 dark:bg-green-900/30">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">HIPAA Compliant</p>
                    <p className="text-xs text-muted-foreground">Secure & encrypted</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/30">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Average Wait</p>
                    <p className="text-xs text-muted-foreground">Under 10 minutes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-purple-100 dark:bg-purple-900/30">
                    <Calendar className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Available</p>
                    <p className="text-xs text-muted-foreground">365 days/year</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Virtual Visits</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingVirtual.length > 0 ? (
              <div className="flex flex-col gap-4">
                {upcomingVirtual.slice(0, 3).map((apt) => (
                  <div key={apt.id} className="flex flex-col gap-2 rounded-lg border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">
                        Dr. {apt.doctor?.firstName} {apt.doctor?.lastName}
                      </span>
                      <Badge variant="outline">Virtual</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {format(new Date(apt.dateTime), "MMM d 'at' h:mm a")}
                    </div>
                    <Button size="sm" className="mt-2" data-testid={`button-join-${apt.id}`}>
                      <Video className="mr-2 h-4 w-4" />
                      Join Session
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Video className="h-10 w-10 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">No upcoming virtual visits</p>
                <Link href="/appointments">
                  <Button variant="outline" size="sm" className="mt-4">
                    Schedule Virtual Visit
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Before Your Visit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Camera className="h-6 w-6" />
              </div>
              <h4 className="font-medium">Test Your Camera</h4>
              <p className="text-xs text-muted-foreground">
                Ensure your camera works properly before the visit
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Mic className="h-6 w-6" />
              </div>
              <h4 className="font-medium">Check Your Microphone</h4>
              <p className="text-xs text-muted-foreground">
                Make sure you can be heard clearly
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <MonitorUp className="h-6 w-6" />
              </div>
              <h4 className="font-medium">Good Lighting</h4>
              <p className="text-xs text-muted-foreground">
                Find a well-lit area for your visit
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Phone className="h-6 w-6" />
              </div>
              <h4 className="font-medium">Quiet Environment</h4>
              <p className="text-xs text-muted-foreground">
                Choose a private, quiet location
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
