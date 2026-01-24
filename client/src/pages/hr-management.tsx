import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Calendar,
  DollarSign,
  Award,
  Briefcase,
  Search,
  Plus,
  ArrowRight,
  Clock,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth-context";
import type { EmployeeRecord, HRStats } from "@shared/schema";

function HRSkeleton() {
  return (
    <div className="grid gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function HRManagementPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const { data: employees, isLoading: employeesLoading } = useQuery<EmployeeRecord[]>({
    queryKey: ["/api/hr/employees"],
    enabled: user?.role === "admin",
  });

  const { data: hrStats, isLoading: statsLoading } = useQuery<HRStats>({
    queryKey: ["/api/hr/stats"],
    enabled: user?.role === "admin",
  });

  const filteredEmployees = employees?.filter((emp) => {
    const searchText = `${emp.designation} ${emp.department}`.toLowerCase();
    return searchText.includes(searchQuery.toLowerCase());
  }) || [];

  if (user?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Access Denied</h2>
        <p className="text-muted-foreground">Only administrators can access HR Management</p>
      </div>
    );
  }

  const isLoading = employeesLoading || statsLoading;

  return (
    <div className="flex flex-col gap-6" data-testid="hr-management-page">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">HR Management</h1>
          <p className="text-muted-foreground">
            Manage employees, attendance, payroll, and performance
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Employee
        </Button>
      </div>

      {isLoading ? (
        <HRSkeleton />
      ) : (
        <>
          {/* Dashboard Stats */}
          {hrStats && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/30">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Employees</p>
                    <p className="text-2xl font-bold">{hrStats.totalEmployees}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-green-100 dark:bg-green-900/30">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold">{hrStats.activeEmployees}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-orange-100 dark:bg-orange-900/30">
                    <Calendar className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">On Leave</p>
                    <p className="text-2xl font-bold">{hrStats.onLeaveCount}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-red-100 dark:bg-red-900/30">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Expiring Certs</p>
                    <p className="text-2xl font-bold">{hrStats.certificationsExpiring}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Employees</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="leaves">Leave Requests</TabsTrigger>
              <TabsTrigger value="payroll">Payroll</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            {/* Employees Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by designation or department..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {filteredEmployees.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredEmployees.map((emp) => (
                    <Card key={emp.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{emp.designation}</CardTitle>
                            <p className="text-sm text-muted-foreground">{emp.department}</p>
                          </div>
                          <Badge
                            variant={emp.status === "active" ? "default" : "secondary"}
                          >
                            {emp.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Employee ID</p>
                          <p className="font-mono text-sm font-semibold">{emp.employeeId}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Salary</p>
                          <p className="text-lg font-bold">
                            {emp.currency || "KES"} {emp.salary.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          Joined: {new Date(emp.joinDate).toLocaleDateString()}
                        </div>
                        <Button variant="outline" className="w-full" size="sm">
                          View Details
                          <ArrowRight className="ml-2 h-3 w-3" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center gap-3 p-12 text-center">
                    <Users className="h-12 w-12 text-muted-foreground" />
                    <div>
                      <p className="font-medium">No employees found</p>
                      <p className="text-sm text-muted-foreground">
                        {searchQuery ? "Try adjusting your search" : "No employee records yet"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Attendance Tab */}
            <TabsContent value="attendance">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Attendance Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    View and manage employee attendance records, check-in/out times, and generate attendance reports.
                  </p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Record Attendance
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Leave Requests Tab */}
            <TabsContent value="leaves">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Leave Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Review and approve leave requests, track leave balances, and manage employee time off.
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      New Leave Request
                    </Button>
                    <Button variant="outline" className="w-full">
                      View Pending Requests ({hrStats?.upcomingLeaveRequests || 0})
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payroll Tab */}
            <TabsContent value="payroll">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Payroll Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Process payroll, manage salaries, deductions, and generate payslips. Pending: {hrStats?.pendingPayroll || 0}
                  </p>
                  <div className="space-y-2">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Process Payroll
                    </Button>
                    <Button variant="outline" className="w-full">
                      View Payroll History
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Performance Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Conduct performance reviews, track ratings, and provide feedback to employees.
                  </p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Review
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
