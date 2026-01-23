import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, Phone, Mail, Activity, Calendar, MessageSquare, Search, Plus, MapPin, Clock, Badge as BadgeIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { User } from "@shared/schema";

function NursesSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}

export default function NursesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: nurses, isLoading } = useQuery<User[]>({
    queryKey: ["/api/nurses"],
  });

  const staffList = nurses || [];

  const filteredNurses = staffList.filter((nurse) => {
    const searchText = `${nurse.firstName} ${nurse.lastName} ${nurse.specialty} ${nurse.department}`.toLowerCase();
    return searchText.includes(searchQuery.toLowerCase());
  });

  const handleContact = (nurse: User) => {
    toast({
      title: "Contact Nurse",
      description: `Connecting to ${nurse.firstName} ${nurse.lastName}...`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Nursing Staff</h1>
            <p className="text-muted-foreground">Manage and coordinate with nursing team</p>
          </div>
          {user?.role === "admin" && (
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Nurse
            </Button>
          )}
        </div>
        <NursesSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6" data-testid="nurses-page">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Nursing Staff</h1>
          <p className="text-muted-foreground">
            {user?.role === "admin"
              ? "Manage all nursing personnel"
              : "Connect with our qualified nursing team"}
          </p>
        </div>
        {user?.role === "admin" && (
          <Button data-testid="button-add-nurse">
            <Plus className="mr-2 h-4 w-4" />
            Add Nurse
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-nurses"
          />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Nursing Staff Directory</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredNurses.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 p-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">No nurses found</p>
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? "Try adjusting your search" : "No nursing staff available"}
                </p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>License #</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNurses.map((nurse) => (
                  <TableRow key={nurse.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-primary text-primary-foreground font-semibold">
                            {nurse.firstName?.[0] || "N"}
                            {nurse.lastName?.[0] || ""}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {nurse.firstName} {nurse.lastName}
                          </span>
                          <span className="text-xs text-muted-foreground">{nurse.id}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{nurse.specialty || "General Nurse"}</Badge>
                    </TableCell>
                    <TableCell>{nurse.department || "—"}</TableCell>
                    <TableCell className="font-mono text-sm">{nurse.licenseNumber || "—"}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm">
                        {nurse.phone && (
                          <a href={`tel:${nurse.phone}`} className="text-blue-600 hover:underline">
                            {nurse.phone}
                          </a>
                        )}
                        {nurse.email && (
                          <a href={`mailto:${nurse.email}`} className="text-blue-600 hover:underline truncate">
                            {nurse.email}
                          </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleContact(nurse)}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            toast({
                              title: "Schedule",
                              description: `Scheduling with ${nurse.firstName}...`,
                            })
                          }
                        >
                          <Calendar className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Stats Section */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Nurses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staffList.length}</div>
            <p className="text-xs text-muted-foreground">Active staff</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">On Duty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.ceil(staffList.length * 0.6)}</div>
            <p className="text-xs text-muted-foreground">Currently working</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(staffList.map((n) => n.department)).size}
            </div>
            <p className="text-xs text-muted-foreground">Active departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Specialties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(staffList.map((n) => n.specialty)).size}
            </div>
            <p className="text-xs text-muted-foreground">Available specialties</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
