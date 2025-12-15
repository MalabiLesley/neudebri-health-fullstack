import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Pill, Plus, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { PrescriptionCard } from "@/components/prescription-card";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { PrescriptionWithDoctor, User } from "@shared/schema";

function PrescriptionsSkeleton() {
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

export default function PrescriptionsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isWriteRxOpen, setIsWriteRxOpen] = useState(false);

  const [selectedPatient, setSelectedPatient] = useState("");
  const [medicationName, setMedicationName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [instructions, setInstructions] = useState("");
  const [refills, setRefills] = useState("0");

  const isPatient = user?.role === "patient";
  const isDoctor = user?.role === "doctor" || user?.role === "nurse";

  const { data: prescriptions, isLoading } = useQuery<PrescriptionWithDoctor[]>({
    queryKey: ["/api/prescriptions"],
  });

  const { data: patients } = useQuery<User[]>({
    queryKey: ["/api/users/patients"],
    enabled: isDoctor,
  });

  const createPrescriptionMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/prescriptions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prescriptions"] });
      setIsWriteRxOpen(false);
      resetForm();
      toast({
        title: "Prescription Created",
        description: "The prescription has been sent to the pharmacy.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create prescription. Please try again.",
        variant: "destructive",
      });
    },
  });

  const requestRefillMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("POST", `/api/prescriptions/${id}/refill`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prescriptions"] });
      toast({
        title: "Refill Requested",
        description: "Your refill request has been sent to your doctor.",
      });
    },
  });

  const resetForm = () => {
    setSelectedPatient("");
    setMedicationName("");
    setDosage("");
    setFrequency("");
    setInstructions("");
    setRefills("0");
  };

  const handleWritePrescription = () => {
    if (!selectedPatient || !medicationName || !dosage || !frequency) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createPrescriptionMutation.mutate({
      patientId: selectedPatient,
      doctorId: user?.id,
      medicationName,
      dosage,
      frequency,
      startDate: new Date().toISOString(),
      status: "active",
      refillsRemaining: parseInt(refills),
      refillsTotal: parseInt(refills),
      instructions,
      pharmacy: "Neudebri Pharmacy",
    });
  };

  const activePrescriptions = prescriptions?.filter((p) => p.status === "active") || [];
  const completedPrescriptions = prescriptions?.filter((p) => p.status === "completed") || [];
  const otherPrescriptions = prescriptions?.filter(
    (p) => p.status !== "active" && p.status !== "completed"
  ) || [];

  const filteredActive = activePrescriptions.filter((p) =>
    p.medicationName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6" data-testid="prescriptions-page">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Prescriptions</h1>
          <p className="text-muted-foreground">
            {isPatient ? "View and manage your medications" : "Manage patient prescriptions"}
          </p>
        </div>
        {isDoctor && (
          <Button onClick={() => setIsWriteRxOpen(true)} data-testid="button-write-prescription">
            <Plus className="mr-2 h-4 w-4" />
            Write Prescription
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search medications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-prescriptions"
          />
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active" data-testid="tab-active">
            Active ({activePrescriptions.length})
          </TabsTrigger>
          <TabsTrigger value="completed" data-testid="tab-completed">
            Completed ({completedPrescriptions.length})
          </TabsTrigger>
          {otherPrescriptions.length > 0 && (
            <TabsTrigger value="other" data-testid="tab-other">
              Other ({otherPrescriptions.length})
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {isLoading ? (
            <PrescriptionsSkeleton />
          ) : filteredActive.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filteredActive.map((prescription) => (
                <PrescriptionCard
                  key={prescription.id}
                  prescription={prescription}
                  onRequestRefill={isPatient ? (id) => requestRefillMutation.mutate(id) : undefined}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Pill className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No active prescriptions</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {searchQuery 
                    ? "No medications match your search"
                    : "Your active prescriptions will appear here"
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {isLoading ? (
            <PrescriptionsSkeleton />
          ) : completedPrescriptions.length > 0 ? (
            <div className="flex flex-col gap-4">
              {completedPrescriptions.map((prescription) => (
                <PrescriptionCard key={prescription.id} prescription={prescription} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Pill className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No completed prescriptions</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your prescription history will appear here
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {otherPrescriptions.length > 0 && (
          <TabsContent value="other" className="mt-6">
            <div className="flex flex-col gap-4">
              {otherPrescriptions.map((prescription) => (
                <PrescriptionCard key={prescription.id} prescription={prescription} />
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>

      <Dialog open={isWriteRxOpen} onOpenChange={setIsWriteRxOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Write Prescription</DialogTitle>
            <DialogDescription>
              Create a new prescription for a patient.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="patient">Patient</Label>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger id="patient" data-testid="select-patient">
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients?.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="medication">Medication Name</Label>
              <Input
                id="medication"
                placeholder="e.g., Lisinopril"
                value={medicationName}
                onChange={(e) => setMedicationName(e.target.value)}
                data-testid="input-medication"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  placeholder="e.g., 10mg"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  data-testid="input-dosage"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger id="frequency" data-testid="select-frequency">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Once daily">Once daily</SelectItem>
                    <SelectItem value="Twice daily">Twice daily</SelectItem>
                    <SelectItem value="Three times daily">Three times daily</SelectItem>
                    <SelectItem value="Four times daily">Four times daily</SelectItem>
                    <SelectItem value="As needed">As needed</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="refills">Number of Refills</Label>
              <Select value={refills} onValueChange={setRefills}>
                <SelectTrigger id="refills" data-testid="select-refills">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} refill{num !== 1 ? "s" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="instructions">Special Instructions</Label>
              <Textarea
                id="instructions"
                placeholder="e.g., Take with food..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="resize-none"
                data-testid="input-instructions"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWriteRxOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleWritePrescription}
              disabled={createPrescriptionMutation.isPending}
              data-testid="button-submit-prescription"
            >
              {createPrescriptionMutation.isPending ? "Creating..." : "Create Prescription"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
