import { format, parseISO } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { VitalSigns } from "@shared/schema";

interface VitalSignsChartProps {
  data: VitalSigns[];
  title?: string;
}

export function VitalSignsChart({ data, title = "Vital Signs History" }: VitalSignsChartProps) {
  const chartData = data.map((vital) => ({
    date: format(parseISO(vital.recordedAt), "MMM d"),
    systolic: vital.bloodPressureSystolic,
    diastolic: vital.bloodPressureDiastolic,
    heartRate: vital.heartRate,
    oxygenSaturation: vital.oxygenSaturation,
  })).reverse();

  return (
    <Card data-testid="vital-signs-chart">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                className="text-xs" 
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis 
                className="text-xs" 
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--popover))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="systolic" 
                name="Systolic BP"
                stroke="hsl(var(--chart-1))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-1))" }}
              />
              <Line 
                type="monotone" 
                dataKey="diastolic" 
                name="Diastolic BP"
                stroke="hsl(var(--chart-2))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-2))" }}
              />
              <Line 
                type="monotone" 
                dataKey="heartRate" 
                name="Heart Rate"
                stroke="hsl(var(--chart-3))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-3))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
