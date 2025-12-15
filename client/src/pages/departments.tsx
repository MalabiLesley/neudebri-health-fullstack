import { useQuery } from "@tanstack/react-query";
import { Building2, Users, Phone, MapPin, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Department, User } from "@shared/schema";

function DepartmentsSkeleton() {
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

export default function DepartmentsPage() {
  const { data: departments, isLoading } = useQuery<Department[]>({
    queryKey: ["/api/departments"],
  });

  const { data: doctors } = useQuery<User[]>({
    queryKey: ["/api/users/doctors"],
  });

  const getDepartmentDoctorCount = (deptName: string) => {
    return doctors?.filter((d) => d.department === deptName).length || 0;
  };

  return (
    <div className="flex flex-col gap-6" data-testid="departments-page">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Departments</h1>
          <p className="text-muted-foreground">
            Manage hospital departments and services
          </p>
        </div>
        <Button data-testid="button-add-department">
          <Plus className="mr-2 h-4 w-4" />
          Add Department
        </Button>
      </div>

      {isLoading ? (
        <DepartmentsSkeleton />
      ) : departments && departments.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept) => (
            <Card key={dept.id} data-testid={`department-card-${dept.id}`}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{dept.name}</CardTitle>
                  </div>
                  <Badge variant={dept.isActive ? "default" : "secondary"}>
                    {dept.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  {dept.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {dept.description}
                    </p>
                  )}
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{getDepartmentDoctorCount(dept.name)} doctors</span>
                    </div>
                    {dept.location && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{dept.location}</span>
                      </div>
                    )}
                    {dept.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{dept.phone}</span>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No departments</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Add departments to organize your healthcare facility
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
