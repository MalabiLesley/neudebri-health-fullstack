import { format, parseISO } from "date-fns";
import { FileText, AlertCircle, CheckCircle, Activity, Syringe, Scissors } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { HealthRecord } from "@shared/schema";

interface HealthRecordCardProps {
  record: HealthRecord;
}

const recordTypeConfig: Record<string, { icon: typeof FileText; color: string }> = {
  diagnosis: { icon: Activity, color: "text-red-500" },
  condition: { icon: AlertCircle, color: "text-orange-500" },
  allergy: { icon: AlertCircle, color: "text-yellow-500" },
  surgery: { icon: Scissors, color: "text-purple-500" },
  immunization: { icon: Syringe, color: "text-green-500" },
};

const severityColors: Record<string, string> = {
  mild: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  moderate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  severe: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const statusColors: Record<string, string> = {
  active: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  resolved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  chronic: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
};

export function HealthRecordCard({ record }: HealthRecordCardProps) {
  const config = recordTypeConfig[record.recordType] || { icon: FileText, color: "text-muted-foreground" };
  const Icon = config.icon;

  return (
    <Card data-testid={`health-record-${record.id}`}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted ${config.color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold">{record.title}</span>
              <Badge variant="outline" className="capitalize">
                {record.recordType}
              </Badge>
              {record.severity && (
                <Badge variant="outline" className={severityColors[record.severity]}>
                  {record.severity}
                </Badge>
              )}
              {record.status && (
                <Badge variant="outline" className={statusColors[record.status]}>
                  {record.status}
                </Badge>
              )}
            </div>
            {record.description && (
              <p className="text-sm text-muted-foreground">{record.description}</p>
            )}
            <span className="text-xs text-muted-foreground">
              {format(parseISO(record.date), "MMMM d, yyyy")}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
