import { useState } from "react";
import { AlertTriangle, Clock, Plus, Search, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const EMERGENCY_CASES = [
  {
    id: "emg-001",
    patientName: "Peter Kipchoge",
    triageLevel: "critical",
    arrivalTime: "2026-01-23T14:30:00",
    complaint: "Severe chest pain",
    assignedDoctor: "Dr. Michael Chen",
    status: "in_treatment",
    bedno: "ER-01",
  },
  {
    id: "emg-002",
    patientName: "Grace Mwangi",
    triageLevel: "urgent",
    arrivalTime: "2026-01-23T14:45:00",
    complaint: "Head injury after accident",
    assignedDoctor: "Dr. Sarah Johnson",
    status: "waiting_doctor",
    bedno: "ER-02",
  },
  {
    id: "emg-003",
    patientName: "John Mbatha",
    triageLevel: "non_urgent",
    arrivalTime: "2026-01-23T15:00:00",
    complaint: "Laceration on left arm",
    assignedDoctor: null,
    status: "triage_pending",
    bedno: "ER-03",
  },
];

export default function EmergencyConsole() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCases = EMERGENCY_CASES.filter((c) =>
    c.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.complaint.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTriageColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-300";
      case "urgent":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "semi_urgent":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "non_urgent":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      in_treatment: "In Treatment",
      waiting_doctor: "Waiting for Doctor",
      triage_pending: "Triage Pending",
      discharged: "Discharged",
    };
    return labels[status] || status;
  };

  const waitingTime = (arrivalTime: string) => {
    const arrival = new Date(arrivalTime);
    const now = new Date();
    const minutes = Math.floor((now.getTime() - arrival.getTime()) / 60000);
    return `${minutes} min`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <AlertTriangle className="text-red-600" />
          Emergency/Casualty Console
        </h1>
        <p className="text-muted-foreground mt-2">Critical patient management and triage</p>
      </div>

      {/* Alert Banner */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
        <AlertCircle className="text-red-600" size={20} />
        <div>
          <p className="font-semibold text-red-900">Active Emergency Cases</p>
          <p className="text-sm text-red-700">{EMERGENCY_CASES.length} patient(s) currently in emergency department</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">{EMERGENCY_CASES.filter(c => c.triageLevel === "critical").length}</p>
              <p className="text-sm text-muted-foreground">Critical</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-orange-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">{EMERGENCY_CASES.filter(c => c.triageLevel === "urgent").length}</p>
              <p className="text-sm text-muted-foreground">Urgent</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-yellow-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">{EMERGENCY_CASES.filter(c => c.triageLevel === "semi_urgent").length}</p>
              <p className="text-sm text-muted-foreground">Semi-Urgent</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{EMERGENCY_CASES.filter(c => c.triageLevel === "non_urgent").length}</p>
              <p className="text-sm text-muted-foreground">Non-Urgent</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
          <Input
            placeholder="Search patient or complaint..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="gap-2 bg-red-600 hover:bg-red-700">
          <Plus size={18} />
          Register Patient
        </Button>
      </div>

      {/* Emergency Cases Queue */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle>Emergency Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredCases.map((c) => (
              <div key={c.id} className={`border-2 rounded-lg p-4 ${getTriageColor(c.triageLevel)}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-bold text-lg">{c.patientName}</p>
                      <Badge variant="outline">{c.bedno}</Badge>
                    </div>
                    <p className="font-semibold text-sm mb-2">{c.complaint}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={getTriageColor(c.triageLevel)}>
                      {c.triageLevel.toUpperCase()}
                    </Badge>
                    <p className="text-xs mt-1 flex items-center justify-end gap-1">
                      <Clock size={14} />
                      {waitingTime(c.arrivalTime)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm mb-3 pb-3 border-t border-current border-opacity-20">
                  <div>
                    <p className="text-xs opacity-75">Assigned Doctor</p>
                    <p className="font-semibold">{c.assignedDoctor || "Unassigned"}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-75">Status</p>
                    <p className="font-semibold">{getStatusLabel(c.status)}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-75">Bed</p>
                    <p className="font-semibold">{c.bedno}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">View Details</Button>
                  {!c.assignedDoctor && (
                    <Button size="sm" variant="outline">Assign Doctor</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
