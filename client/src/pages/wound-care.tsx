import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Activity, AlertCircle, Plus, Image, Clock, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import type { WoundRecord } from "@shared/schema";

function WoundRecordSkeleton() {
  return (
    <div className="flex flex-col gap-4">
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

function getStageColor(stage?: string | null): string {
  if (!stage) return "secondary";
  if (stage.includes("I") || stage === "1") return "outline";
  if (stage.includes("II") || stage === "2") return "secondary";
  if (stage.includes("III") || stage === "3") return "destructive";
  if (stage.includes("IV") || stage === "4") return "destructive";
  return "secondary";
}

export default function WoundCarePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const patientId = user?.role === "patient" ? (user?.id || "patient-001") : "patient-001";

  const { data: woundRecords, isLoading } = useQuery<WoundRecord[]>({
    queryKey: [`/api/wound-care?patientId=${patientId}`],
  });

  const records = woundRecords || [];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Wound Care</h1>
          <p className="text-muted-foreground">Monitor and manage wound treatment</p>
        </div>
        <WoundRecordSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Wound Care</h1>
          <p className="text-muted-foreground">Monitor and manage wound treatment and recovery</p>
        </div>
        {(user?.role === "doctor" || user?.role === "nurse") && (
          <Button onClick={() => toast({ title: "Feature Coming Soon" })}>
            <Plus className="h-4 w-4 mr-2" />
            Add Wound Record
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Wound Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            {records.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <AlertCircle className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">No Wound Records</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.role === "patient"
                      ? "Your healthcare provider will add wound records here."
                      : "Create the first wound record for this patient."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {records.map((record) => (
                  <Card key={record.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{record.woundType || "Wound Assessment"}</h3>
                              <Badge variant={getStageColor(record.stage)}>
                                {record.stage || "Stage Unknown"}
                              </Badge>
                            </div>
                            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {format(new Date(record.date), "MMM d, yyyy h:mm a")}
                              </div>
                              {record.nurseId && (
                                <div className="flex items-center gap-1">
                                  <User className="h-4 w-4" />
                                  Nurse ID: {record.nurseId}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {record.size && (
                          <div>
                            <p className="text-sm font-medium">Size</p>
                            <p className="text-sm text-muted-foreground">{record.size}</p>
                          </div>
                        )}

                        {record.description && (
                          <div>
                            <p className="text-sm font-medium">Description</p>
                            <p className="text-sm text-muted-foreground">{record.description}</p>
                          </div>
                        )}

                        {record.treatmentPlan && (
                          <div>
                            <p className="text-sm font-medium">Treatment Plan</p>
                            <p className="text-sm text-muted-foreground">{record.treatmentPlan}</p>
                          </div>
                        )}

                        {record.notes && (
                          <div>
                            <p className="text-sm font-medium">Notes</p>
                            <p className="text-sm text-muted-foreground">{record.notes}</p>
                          </div>
                        )}

                        {record.photos && record.photos.length > 0 && (
                          <div>
                            <p className="text-sm font-medium flex items-center gap-1">
                              <Image className="h-4 w-4" />
                              Photos
                            </p>
                            <div className="mt-2 grid gap-2 sm:grid-cols-2">
                              {record.photos.map((photo, idx) => (
                                <a
                                  key={idx}
                                  href={photo}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 underline hover:text-blue-700"
                                >
                                  Photo {idx + 1}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Care Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              <div>
                <p className="font-medium text-muted-foreground">Daily Care</p>
                <p className="text-xs text-muted-foreground mt-1">Clean and monitor wound daily as instructed</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Signs to Watch</p>
                <p className="text-xs text-muted-foreground mt-1">Increased redness, warmth, discharge, or odor</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">When to Contact</p>
                <p className="text-xs text-muted-foreground mt-1">Report any concerning changes immediately</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="flex h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm">Under Supervision</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
