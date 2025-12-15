import { format, parseISO } from "date-fns";
import { Pill, RefreshCw, Building2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { PrescriptionWithDoctor, PrescriptionStatus } from "@shared/schema";

interface PrescriptionCardProps {
  prescription: PrescriptionWithDoctor;
  onRequestRefill?: (id: string) => void;
}

const statusColors: Record<PrescriptionStatus, string> = {
  active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  completed: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  on_hold: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
};

export function PrescriptionCard({ prescription, onRequestRefill }: PrescriptionCardProps) {
  const refillProgress = prescription.refillsTotal 
    ? ((prescription.refillsTotal - (prescription.refillsRemaining || 0)) / prescription.refillsTotal) * 100 
    : 0;
  
  const canRequestRefill = prescription.status === "active" && 
    (prescription.refillsRemaining || 0) > 0;

  return (
    <Card data-testid={`prescription-${prescription.id}`}>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary/10">
              <Pill className="h-6 w-6 text-primary" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">{prescription.medicationName}</span>
                <Badge variant="outline" className={statusColors[prescription.status as PrescriptionStatus]}>
                  {prescription.status.replace("_", " ")}
                </Badge>
              </div>
              <span className="text-sm font-medium">{prescription.dosage}</span>
              <span className="text-sm text-muted-foreground">{prescription.frequency}</span>
              
              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Started: {format(parseISO(prescription.startDate), "MMM d, yyyy")}
                </span>
                {prescription.pharmacy && (
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {prescription.pharmacy}
                  </span>
                )}
              </div>

              {prescription.instructions && (
                <p className="mt-2 text-sm text-muted-foreground">{prescription.instructions}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 sm:shrink-0">
            {prescription.refillsTotal && prescription.refillsTotal > 0 && (
              <div className="flex w-32 flex-col gap-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Refills</span>
                  <span className="font-medium">
                    {prescription.refillsRemaining}/{prescription.refillsTotal}
                  </span>
                </div>
                <Progress value={refillProgress} className="h-2" />
              </div>
            )}
            
            {canRequestRefill && onRequestRefill && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onRequestRefill(prescription.id)}
                data-testid={`button-refill-${prescription.id}`}
              >
                <RefreshCw className="mr-2 h-3 w-3" />
                Request Refill
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
