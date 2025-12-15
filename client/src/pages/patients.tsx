import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { Users, Search, Eye, Calendar, MessageSquare, FileText, Plus } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/lib/auth-context";
import type { User } from "@shared/schema";

function PatientsSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}

export default function PatientsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: patients, isLoading } = useQuery<User[]>({
    queryKey: ["/api/users/patients"],
  });

  const filteredPatients = patients?.filter((p) => {
    const searchText = `${p.firstName} ${p.lastName} ${p.email}`.toLowerCase();
    return searchText.includes(searchQuery.toLowerCase());
  }) || [];

  return (
    <div className="flex flex-col gap-6" data-testid="patients-page">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Patients</h1>
          <p className="text-muted-foreground">
            {user?.role === "admin" ? "Manage all registered patients" : "View and manage your patients"}
          </p>
        </div>
        {user?.role === "admin" && (
          <Button data-testid="button-add-patient">
            <Plus className="mr-2 h-4 w-4" />
            Add Patient
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-patients"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4">
              <PatientsSkeleton />
            </div>
          ) : filteredPatients.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id} data-testid={`patient-row-${patient.id}`}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="text-sm">
                            {patient.firstName?.[0]}{patient.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {patient.firstName} {patient.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ID: {patient.id.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">{patient.email}</span>
                        {patient.phone && (
                          <span className="text-xs text-muted-foreground">{patient.phone}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {patient.dateOfBirth 
                        ? format(parseISO(patient.dateOfBirth), "MMM d, yyyy")
                        : "-"
                      }
                    </TableCell>
                    <TableCell className="capitalize">{patient.gender || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={patient.isActive ? "default" : "secondary"}>
                        {patient.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" data-testid={`button-view-${patient.id}`}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" data-testid={`button-schedule-${patient.id}`}>
                          <Calendar className="h-4 w-4" />
                        </Button>
                        <Link href="/messages">
                          <Button variant="ghost" size="icon" data-testid={`button-message-${patient.id}`}>
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No patients found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchQuery ? "No patients match your search" : "No patients registered yet"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
