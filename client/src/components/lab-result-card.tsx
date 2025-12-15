import { format, parseISO } from "date-fns";
import { TestTube, AlertTriangle, CheckCircle, Clock, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { LabResultWithDoctor, LabResultStatus } from "@shared/schema";

interface LabResultCardProps {
  result: LabResultWithDoctor;
  onViewDetails?: (id: string) => void;
}

const statusConfig: Record<LabResultStatus, { color: string; icon: typeof Clock }> = {
  pending: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Clock },
  in_progress: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", icon: TestTube },
  completed: { color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle },
  reviewed: { color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400", icon: FileText },
};

export function LabResultCard({ result, onViewDetails }: LabResultCardProps) {
  const config = statusConfig[result.status as LabResultStatus];
  const StatusIcon = config?.icon || Clock;

  return (
    <Card data-testid={`lab-result-${result.id}`}>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md ${result.isAbnormal ? "bg-red-100 dark:bg-red-900/30" : "bg-muted"}`}>
              {result.isAbnormal ? (
                <AlertTriangle className="h-6 w-6 text-red-500" />
              ) : (
                <TestTube className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">{result.testName}</span>
                <Badge variant="outline" className={config?.color}>
                  <StatusIcon className="mr-1 h-3 w-3" />
                  {result.status.replace("_", " ")}
                </Badge>
                {result.isAbnormal && (
                  <Badge variant="destructive" className="text-xs">
                    Abnormal
                  </Badge>
                )}
              </div>
              
              {result.testCode && (
                <span className="text-xs text-muted-foreground">Code: {result.testCode}</span>
              )}

              {result.result && (
                <div className="mt-2 flex items-center gap-2">
                  <span className={`text-lg font-bold ${result.isAbnormal ? "text-red-500" : ""}`}>
                    {result.result} {result.unit}
                  </span>
                  {result.normalRange && (
                    <span className="text-sm text-muted-foreground">
                      (Normal: {result.normalRange})
                    </span>
                  )}
                </div>
              )}

              <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span>Ordered: {format(parseISO(result.orderedDate), "MMM d, yyyy")}</span>
                {result.resultDate && (
                  <span>Result: {format(parseISO(result.resultDate), "MMM d, yyyy")}</span>
                )}
              </div>

              {result.notes && (
                <p className="mt-2 text-sm text-muted-foreground">{result.notes}</p>
              )}
            </div>
          </div>

          {onViewDetails && result.status === "completed" && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onViewDetails(result.id)}
              data-testid={`button-view-lab-${result.id}`}
            >
              <FileText className="mr-2 h-3 w-3" />
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
