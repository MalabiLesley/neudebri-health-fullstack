import { useQuery } from "@tanstack/react-query";
import { Users, Phone, Mail, Activity, Calendar, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@shared/schema";

function NursesSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function NursesPage() {
  const { toast } = useToast();

  const { data: nurses, isLoading } = useQuery<User[]>({
    queryKey: ["/api/nurses"],
  });

  const staffList = nurses || [];

  const handleContact = (nurse: User) => {
    toast({
      title: "Contact Nurse",
      description: `Connecting to ${nurse.firstName} ${nurse.lastName}...`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Nursing Staff</h1>
          <p className="text-muted-foreground">Connect with our qualified nursing team</p>
        </div>
        <NursesSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Nursing Staff</h1>
        <p className="text-muted-foreground">Our dedicated nursing team is here to help you</p>
      </div>

      {staffList.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-3 p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">No Nursing Staff Available</p>
              <p className="text-sm text-muted-foreground">Nursing team information not available</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {staffList.map((nurse) => {
            const initials = `${nurse.firstName?.[0] || "N"}${nurse.lastName?.[0] || ""}`;
            return (
              <Card key={nurse.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center gap-4 text-center">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-primary text-lg font-semibold text-primary-foreground">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">
                        {nurse.firstName} {nurse.lastName}
                      </h3>
                      <Badge className="mt-2" variant="secondary">
                        {nurse.specialty || "Nurse"}
                      </Badge>
                    </div>

                    {nurse.licenseNumber && (
                      <div className="w-full text-left">
                        <p className="text-xs text-muted-foreground">License</p>
                        <p className="text-sm font-mono">{nurse.licenseNumber}</p>
                      </div>
                    )}

                    {nurse.department && (
                      <div className="w-full text-left">
                        <p className="text-xs text-muted-foreground">Department</p>
                        <p className="text-sm">{nurse.department}</p>
                      </div>
                    )}

                    <div className="w-full border-t pt-4">
                      {nurse.phone && (
                        <a
                          href={`tel:${nurse.phone}`}
                          className="flex items-center gap-2 rounded-md p-2 text-sm text-muted-foreground hover:bg-muted mb-2"
                        >
                          <Phone className="h-4 w-4" />
                          {nurse.phone}
                        </a>
                      )}
                      {nurse.email && (
                        <a
                          href={`mailto:${nurse.email}`}
                          className="flex items-center gap-2 rounded-md p-2 text-sm text-muted-foreground hover:bg-muted mb-2"
                        >
                          <Mail className="h-4 w-4" />
                          {nurse.email}
                        </a>
                      )}
                    </div>

                    <div className="flex w-full gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleContact(nurse)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          toast({
                            title: "Schedule Appointment",
                            description: `Scheduling with ${nurse.firstName}...`,
                          })
                        }
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
