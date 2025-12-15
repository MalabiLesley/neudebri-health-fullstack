import { useQuery } from "@tanstack/react-query";
import { 
  FileText, 
  Activity, 
  AlertCircle, 
  Syringe, 
  Scissors,
  Heart,
  Thermometer
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HealthRecordCard } from "@/components/health-record-card";
import { VitalSignsChart } from "@/components/vital-signs-chart";
import { useAuth } from "@/lib/auth-context";
import type { HealthRecord, VitalSigns } from "@shared/schema";

function HealthRecordsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function VitalSignsCard({ vital }: { vital: VitalSigns }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-red-100 dark:bg-red-900/30">
            <Heart className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Blood Pressure</p>
            <p className="text-xl font-bold">
              {vital.bloodPressureSystolic}/{vital.bloodPressureDiastolic}
              <span className="ml-1 text-sm font-normal text-muted-foreground">mmHg</span>
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/30">
            <Activity className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Heart Rate</p>
            <p className="text-xl font-bold">
              {vital.heartRate}
              <span className="ml-1 text-sm font-normal text-muted-foreground">bpm</span>
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-orange-100 dark:bg-orange-900/30">
            <Thermometer className="h-6 w-6 text-orange-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Temperature</p>
            <p className="text-xl font-bold">
              {vital.temperature}
              <span className="ml-1 text-sm font-normal text-muted-foreground">°F</span>
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-green-100 dark:bg-green-900/30">
            <Activity className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Oxygen Saturation</p>
            <p className="text-xl font-bold">
              {vital.oxygenSaturation}
              <span className="ml-1 text-sm font-normal text-muted-foreground">%</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function HealthRecordsPage() {
  const { user } = useAuth();

  const { data: records, isLoading: recordsLoading } = useQuery<HealthRecord[]>({
    queryKey: ["/api/health-records"],
  });

  const { data: vitals, isLoading: vitalsLoading } = useQuery<VitalSigns[]>({
    queryKey: ["/api/vital-signs"],
  });

  const latestVitals = vitals?.[0];
  
  const diagnoses = records?.filter((r) => r.recordType === "diagnosis") || [];
  const conditions = records?.filter((r) => r.recordType === "condition") || [];
  const allergies = records?.filter((r) => r.recordType === "allergy") || [];
  const surgeries = records?.filter((r) => r.recordType === "surgery") || [];
  const immunizations = records?.filter((r) => r.recordType === "immunization") || [];

  const activeConditions = conditions.filter((c) => c.status === "active" || c.status === "chronic");

  return (
    <div className="flex flex-col gap-6" data-testid="health-records-page">
      <div>
        <h1 className="text-3xl font-bold">Health Records</h1>
        <p className="text-muted-foreground">
          View your complete medical history and health information
        </p>
      </div>

      {latestVitals && (
        <div>
          <h2 className="mb-4 text-lg font-semibold">Latest Vitals</h2>
          <VitalSignsCard vital={latestVitals} />
        </div>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto flex-wrap">
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="conditions" data-testid="tab-conditions">
            Conditions ({conditions.length})
          </TabsTrigger>
          <TabsTrigger value="allergies" data-testid="tab-allergies">
            Allergies ({allergies.length})
          </TabsTrigger>
          <TabsTrigger value="surgeries" data-testid="tab-surgeries">
            Surgeries ({surgeries.length})
          </TabsTrigger>
          <TabsTrigger value="immunizations" data-testid="tab-immunizations">
            Immunizations ({immunizations.length})
          </TabsTrigger>
          <TabsTrigger value="vitals" data-testid="tab-vitals">Vital History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  Active Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recordsLoading ? (
                  <HealthRecordsSkeleton />
                ) : activeConditions.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {activeConditions.map((condition) => (
                      <HealthRecordCard key={condition.id} record={condition} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Activity className="h-10 w-10 text-muted-foreground/50" />
                    <p className="mt-2 text-sm text-muted-foreground">No active conditions</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  Allergies
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recordsLoading ? (
                  <HealthRecordsSkeleton />
                ) : allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {allergies.map((allergy) => (
                      <Badge
                        key={allergy.id}
                        variant="outline"
                        className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      >
                        {allergy.title}
                        {allergy.severity && (
                          <span className="ml-1 opacity-70">({allergy.severity})</span>
                        )}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <AlertCircle className="h-10 w-10 text-muted-foreground/50" />
                    <p className="mt-2 text-sm text-muted-foreground">No known allergies</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Syringe className="h-5 w-5 text-green-500" />
                  Recent Immunizations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recordsLoading ? (
                  <HealthRecordsSkeleton />
                ) : immunizations.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {immunizations.slice(0, 5).map((imm) => (
                      <HealthRecordCard key={imm.id} record={imm} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Syringe className="h-10 w-10 text-muted-foreground/50" />
                    <p className="mt-2 text-sm text-muted-foreground">No immunization records</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scissors className="h-5 w-5 text-purple-500" />
                  Surgical History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recordsLoading ? (
                  <HealthRecordsSkeleton />
                ) : surgeries.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {surgeries.map((surgery) => (
                      <HealthRecordCard key={surgery.id} record={surgery} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Scissors className="h-10 w-10 text-muted-foreground/50" />
                    <p className="mt-2 text-sm text-muted-foreground">No surgical history</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conditions" className="mt-6">
          {recordsLoading ? (
            <HealthRecordsSkeleton />
          ) : conditions.length > 0 ? (
            <div className="flex flex-col gap-4">
              {conditions.map((condition) => (
                <HealthRecordCard key={condition.id} record={condition} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Activity className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No conditions recorded</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your medical conditions will appear here
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="allergies" className="mt-6">
          {recordsLoading ? (
            <HealthRecordsSkeleton />
          ) : allergies.length > 0 ? (
            <div className="flex flex-col gap-4">
              {allergies.map((allergy) => (
                <HealthRecordCard key={allergy.id} record={allergy} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No allergies recorded</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your allergy information will appear here
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="surgeries" className="mt-6">
          {recordsLoading ? (
            <HealthRecordsSkeleton />
          ) : surgeries.length > 0 ? (
            <div className="flex flex-col gap-4">
              {surgeries.map((surgery) => (
                <HealthRecordCard key={surgery.id} record={surgery} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Scissors className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No surgeries recorded</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your surgical history will appear here
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="immunizations" className="mt-6">
          {recordsLoading ? (
            <HealthRecordsSkeleton />
          ) : immunizations.length > 0 ? (
            <div className="flex flex-col gap-4">
              {immunizations.map((imm) => (
                <HealthRecordCard key={imm.id} record={imm} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Syringe className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No immunizations recorded</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your immunization history will appear here
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="vitals" className="mt-6">
          {vitalsLoading ? (
            <Skeleton className="h-80 w-full" />
          ) : vitals && vitals.length > 0 ? (
            <VitalSignsChart data={vitals} />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Activity className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No vital signs recorded</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your vital signs history will appear here
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
