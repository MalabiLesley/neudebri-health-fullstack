import { useState } from "react";
import { Plus, Search, Bed, LogOut, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

const SAMPLE_WARDS = [
  { id: "ward-001", name: "General Ward A", type: "General", capacity: 6, occupied: 5 },
  { id: "ward-002", name: "ICU Ward", type: "ICU", capacity: 4, occupied: 3 },
  { id: "ward-003", name: "Pediatric Ward", type: "Pediatric", capacity: 8, occupied: 6 },
  { id: "ward-004", name: "Maternity Ward", type: "Maternity", capacity: 5, occupied: 4 },
];

const SAMPLE_ADMISSIONS = [
  {
    id: "adm-001",
    patientName: "James Kamau",
    wardName: "General Ward A",
    bedNo: "A-01",
    admissionDate: "2026-01-20",
    doctorName: "Dr. Sarah Johnson",
    diagnosis: "Hypertension",
    status: "admitted",
  },
  {
    id: "adm-002",
    patientName: "Mary Kipchoge",
    wardName: "ICU Ward",
    bedNo: "ICU-02",
    admissionDate: "2026-01-18",
    doctorName: "Dr. Ahmed Hassan",
    diagnosis: "Post-surgery Recovery",
    status: "critical",
  },
  {
    id: "adm-003",
    patientName: "baby Ochieng",
    wardName: "Pediatric Ward",
    bedNo: "P-03",
    admissionDate: "2026-01-22",
    doctorName: "Dr. Emily Carter",
    diagnosis: "Acute Gastroenteritis",
    status: "stable",
  },
];

export default function IPDConsole() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAdmissions = SAMPLE_ADMISSIONS.filter((adm) =>
    adm.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    adm.wardName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const occupancyRate = SAMPLE_WARDS.reduce((sum, w) => sum + (w.occupied / w.capacity), 0) / SAMPLE_WARDS.length * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "stable":
        return "bg-green-100 text-green-800";
      case "admitted":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">IPD Console</h1>
        <p className="text-muted-foreground mt-2">In-Patient Department Management</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-xs text-muted-foreground">Total Beds</p>
              <p className="text-3xl font-bold">{SAMPLE_WARDS.reduce((sum, w) => sum + w.capacity, 0)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-xs text-muted-foreground">Occupied</p>
              <p className="text-3xl font-bold">{SAMPLE_WARDS.reduce((sum, w) => sum + w.occupied, 0)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-xs text-muted-foreground">Available</p>
              <p className="text-3xl font-bold">{SAMPLE_WARDS.reduce((sum, w) => sum + (w.capacity - w.occupied), 0)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-xs text-muted-foreground">Occupancy Rate</p>
              <p className="text-3xl font-bold">{Math.round(occupancyRate)}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wards Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bed size={20} />
            Ward Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SAMPLE_WARDS.map((ward) => (
              <div key={ward.id} className="border rounded-lg p-4 hover:bg-accent transition">
                <h3 className="font-semibold">{ward.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{ward.type}</p>
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Bed Occupancy</span>
                    <span className="font-semibold">{ward.occupied}/{ward.capacity}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(ward.occupied / ward.capacity) * 100}%` }}
                    />
                  </div>
                </div>
                <Button size="sm" className="w-full" variant="outline">
                  Manage
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search & Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
          <Input
            placeholder="Search patient or ward..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="gap-2">
          <Plus size={18} />
          New Admission
        </Button>
      </div>

      {/* Current Admissions */}
      <Card>
        <CardHeader>
          <CardTitle>Current Admissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredAdmissions.map((adm) => (
              <div key={adm.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-semibold">{adm.patientName}</p>
                    <Badge className={getStatusColor(adm.status)}>
                      {adm.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <p className="text-xs">Ward / Bed</p>
                      <p className="font-medium text-foreground">{adm.wardName} - {adm.bedNo}</p>
                    </div>
                    <div>
                      <p className="text-xs">Doctor</p>
                      <p className="font-medium text-foreground">{adm.doctorName}</p>
                    </div>
                    <div>
                      <p className="text-xs">Diagnosis</p>
                      <p className="font-medium text-foreground">{adm.diagnosis}</p>
                    </div>
                    <div>
                      <p className="text-xs">Admitted</p>
                      <p className="font-medium text-foreground">{new Date(adm.admissionDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">View</Button>
                  {adm.status !== "critical" && (
                    <Button size="sm" variant="ghost" className="gap-1">
                      <LogOut size={16} />
                      Discharge
                    </Button>
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
