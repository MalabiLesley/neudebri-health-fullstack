import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus, Filter, Clock, User, Phone, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "../lib/api";
// add import for shared types
import type { AppointmentWithDetails } from "../../../shared/types";

export default function OPDConsole() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const { data: appointments, isLoading } = useQuery<AppointmentWithDetails[]>({
    queryKey: ["/api/appointments"],
    queryFn: async () => {
      return (await apiFetch("/api/appointments")) as AppointmentWithDetails[];
    },
  });

  const filteredAppointments = appointments?.filter((apt) => {
    const matchesSearch =
      ((`${apt.patient?.firstName ?? ""} ${apt.patient?.lastName ?? ""}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (`${apt.doctor?.firstName ?? ""} ${apt.doctor?.lastName ?? ""}`.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesStatus = filterStatus === "all" || apt.status === filterStatus;
    return matchesSearch && matchesStatus;
  }) ?? [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">OPD Console</h1>
        <p className="text-muted-foreground mt-2">Manage out-patient department consultations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{appointments?.filter(a => a.status === "scheduled").length || 0}</p>
              <p className="text-sm text-muted-foreground">Scheduled</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{appointments?.filter(a => a.status === "confirmed").length || 0}</p>
              <p className="text-sm text-muted-foreground">Confirmed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{appointments?.filter(a => a.status === "in_progress").length || 0}</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{appointments?.filter(a => a.status === "completed").length || 0}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
            <Input
              placeholder="Search patient or doctor..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Button variant="outline" className="gap-2">
          <Filter size={18} />
          Filter
        </Button>
        <Button className="gap-2">
          <Plus size={18} />
          New Consultation
        </Button>
      </div>

      {/* Consultations List */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Consultations</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : filteredAppointments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No consultations found</p>
          ) : (
            <div className="space-y-3">
              {filteredAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User size={20} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{`${apt.patient?.firstName ?? ""} ${apt.patient?.lastName ?? ""}`}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock size={16} />
                        {apt.dateTime ? new Date(apt.dateTime).toLocaleTimeString() : "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium">{`${apt.doctor?.firstName ?? ""} ${apt.doctor?.lastName ?? ""}`}</p>
                      <p className="text-xs text-muted-foreground">{apt.department}</p>
                    </div>
                    <Badge className={getStatusColor(apt.status)}>
                      {apt.status.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
