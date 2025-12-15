import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Activity, Search, Plus, Mail, Phone, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import type { User } from "@shared/schema";

function DoctorsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function DoctorsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: doctors, isLoading } = useQuery<User[]>({
    queryKey: ["/api/users/doctors"],
  });

  const filteredDoctors = doctors?.filter((d) => {
    const searchText = `${d.firstName} ${d.lastName} ${d.specialty} ${d.department}`.toLowerCase();
    return searchText.includes(searchQuery.toLowerCase());
  }) || [];

  return (
    <div className="flex flex-col gap-6" data-testid="doctors-page">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Doctors</h1>
          <p className="text-muted-foreground">
            Manage healthcare providers and staff
          </p>
        </div>
        <Button data-testid="button-add-doctor">
          <Plus className="mr-2 h-4 w-4" />
          Add Doctor
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search doctors by name or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-doctors"
          />
        </div>
      </div>

      {isLoading ? (
        <DoctorsSkeleton />
      ) : filteredDoctors.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} data-testid={`doctor-card-${doctor.id}`}>
              <CardContent className="p-4">
                <div className="flex flex-col items-center gap-4 text-center">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg">
                      {doctor.firstName?.[0]}{doctor.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">
                      Dr. {doctor.firstName} {doctor.lastName}
                    </h3>
                    {doctor.specialty && (
                      <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Badge variant={doctor.isActive ? "default" : "secondary"}>
                      {doctor.isActive ? "Active" : "Inactive"}
                    </Badge>
                    {doctor.department && (
                      <Badge variant="outline">
                        <Building2 className="mr-1 h-3 w-3" />
                        {doctor.department}
                      </Badge>
                    )}
                  </div>
                  <div className="flex w-full flex-col gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <Mail className="h-3.5 w-3.5" />
                      <span className="truncate">{doctor.email}</span>
                    </div>
                    {doctor.phone && (
                      <div className="flex items-center justify-center gap-2">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{doctor.phone}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex w-full gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Profile
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Schedule
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Activity className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No doctors found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchQuery ? "No doctors match your search" : "No doctors registered yet"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
