import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TestTube, Search, Filter, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { LabResultCard } from "@/components/lab-result-card";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import type { LabResultWithDoctor } from "@shared/schema";

function LabResultsSkeleton() {
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

export default function LabResultsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: labResults, isLoading } = useQuery<LabResultWithDoctor[]>({
    queryKey: ["/api/lab-results"],
  });

  const handleViewDetails = (id: string) => {
    toast({
      title: "Lab Result Details",
      description: "Opening detailed lab report...",
    });
  };

  const pendingResults = labResults?.filter(
    (r) => r.status === "pending" || r.status === "in_progress"
  ) || [];
  const completedResults = labResults?.filter((r) => r.status === "completed") || [];
  const reviewedResults = labResults?.filter((r) => r.status === "reviewed") || [];
  const abnormalResults = labResults?.filter((r) => r.isAbnormal) || [];

  const filterResults = (results: LabResultWithDoctor[]) =>
    results.filter((r) =>
      r.testName.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="flex flex-col gap-6" data-testid="lab-results-page">
      <div>
        <h1 className="text-3xl font-bold">Lab Results</h1>
        <p className="text-muted-foreground">
          View your laboratory test results and history
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-yellow-100 dark:bg-yellow-900/30">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingResults.length}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedResults.length}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{abnormalResults.length}</p>
              <p className="text-sm text-muted-foreground">Abnormal</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/30">
              <TestTube className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{labResults?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Total Tests</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search lab tests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-labs"
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all">
            All Results ({labResults?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="pending" data-testid="tab-pending">
            Pending ({pendingResults.length})
          </TabsTrigger>
          <TabsTrigger value="abnormal" data-testid="tab-abnormal">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Abnormal ({abnormalResults.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {isLoading ? (
            <LabResultsSkeleton />
          ) : labResults && filterResults(labResults).length > 0 ? (
            <div className="flex flex-col gap-4">
              {filterResults(labResults).map((result) => (
                <LabResultCard
                  key={result.id}
                  result={result}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <TestTube className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No lab results</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {searchQuery 
                    ? "No results match your search"
                    : "Your lab test results will appear here"
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          {isLoading ? (
            <LabResultsSkeleton />
          ) : filterResults(pendingResults).length > 0 ? (
            <div className="flex flex-col gap-4">
              {filterResults(pendingResults).map((result) => (
                <LabResultCard key={result.id} result={result} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No pending results</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  All your lab tests have been completed
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="abnormal" className="mt-6">
          {isLoading ? (
            <LabResultsSkeleton />
          ) : filterResults(abnormalResults).length > 0 ? (
            <div className="flex flex-col gap-4">
              <Card className="border-destructive/50 bg-destructive/5">
                <CardContent className="flex items-center gap-3 p-4">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <p className="text-sm">
                    These results are outside the normal range. Please consult with your healthcare provider.
                  </p>
                </CardContent>
              </Card>
              {filterResults(abnormalResults).map((result) => (
                <LabResultCard
                  key={result.id}
                  result={result}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-green-500/50" />
                <h3 className="mt-4 text-lg font-semibold">All results normal</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  None of your lab results are flagged as abnormal
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
