import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  Calendar, 
  FileText, 
  Pill, 
  MessageSquare, 
  Users, 
  Activity,
  Video,
  TestTube,
  Clock,
  ArrowRight
} from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsCard } from "@/components/stats-card";
import { AppointmentCard } from "@/components/appointment-card";
import { useAuth } from "@/lib/auth-context";
import type { DashboardStats, AppointmentWithDetails } from "@shared/schema";

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: upcomingAppointments, isLoading: appointmentsLoading } = useQuery<AppointmentWithDetails[]>({
    queryKey: ["/api/appointments/upcoming"],
  });

  if (statsLoading || appointmentsLoading) {
    return <DashboardSkeleton />;
  }

  const isPatient = user?.role === "patient";
  const isDoctor = user?.role === "doctor" || user?.role === "nurse";
  const isAdmin = user?.role === "admin";

  return (
    <div className="flex flex-col gap-6" data-testid="dashboard-page">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.firstName}
        </h1>
        <p className="text-muted-foreground">
          {format(new Date(), "EEEE, MMMM d, yyyy")} - Here's your health overview
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isPatient && (
          <>
            <StatsCard
              title="Upcoming Appointments"
              value={stats?.appointmentsThisWeek || 0}
              description="This week"
              icon={Calendar}
              testId="stat-appointments"
            />
            <StatsCard
              title="Active Prescriptions"
              value={stats?.activePrescriptions || 0}
              description="Currently taking"
              icon={Pill}
              testId="stat-prescriptions"
            />
            <StatsCard
              title="Pending Lab Results"
              value={stats?.pendingLabResults || 0}
              description="Awaiting results"
              icon={TestTube}
              testId="stat-lab-results"
            />
            <StatsCard
              title="Unread Messages"
              value={stats?.unreadMessages || 0}
              description="From your care team"
              icon={MessageSquare}
              testId="stat-messages"
            />
          </>
        )}

        {isDoctor && (
          <>
            <StatsCard
              title="Today's Appointments"
              value={stats?.appointmentsToday || 0}
              description="Scheduled for today"
              icon={Calendar}
              testId="stat-appointments-today"
            />
            <StatsCard
              title="My Patients"
              value={stats?.totalPatients || 0}
              description="Active patients"
              icon={Users}
              testId="stat-patients"
            />
            <StatsCard
              title="Virtual Sessions"
              value={stats?.virtualCareSessions || 0}
              description="This week"
              icon={Video}
              testId="stat-virtual"
            />
            <StatsCard
              title="Pending Reviews"
              value={stats?.pendingLabResults || 0}
              description="Lab results to review"
              icon={FileText}
              testId="stat-pending"
            />
          </>
        )}

        {isAdmin && (
          <>
            <StatsCard
              title="Total Patients"
              value={stats?.totalPatients || 0}
              description="Registered patients"
              icon={Users}
              trend={{ value: 12, isPositive: true }}
              testId="stat-total-patients"
            />
            <StatsCard
              title="Total Doctors"
              value={stats?.totalDoctors || 0}
              description="Active staff"
              icon={Activity}
              testId="stat-total-doctors"
            />
            <StatsCard
              title="Today's Appointments"
              value={stats?.appointmentsToday || 0}
              description="Across all departments"
              icon={Calendar}
              trend={{ value: 5, isPositive: true }}
              testId="stat-admin-appointments"
            />
            <StatsCard
              title="Virtual Care Sessions"
              value={stats?.virtualCareSessions || 0}
              description="This week"
              icon={Video}
              testId="stat-admin-virtual"
            />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Appointments
            </CardTitle>
            <Link href="/appointments">
              <Button variant="ghost" size="sm" data-testid="link-view-all-appointments">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {upcomingAppointments && upcomingAppointments.length > 0 ? (
              <div className="flex flex-col gap-4">
                {upcomingAppointments.slice(0, 3).map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    showPatient={!isPatient}
                    showDoctor={isPatient}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No upcoming appointments</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {isPatient 
                    ? "Schedule an appointment to meet with your healthcare provider"
                    : "No appointments scheduled for the upcoming days"
                  }
                </p>
                {isPatient && (
                  <Link href="/appointments">
                    <Button className="mt-4" data-testid="button-schedule-appointment">
                      Schedule Appointment
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {isPatient && (
                <>
                  <Link href="/appointments">
                    <Button variant="outline" className="h-auto w-full flex-col gap-2 p-4" data-testid="action-book-appointment">
                      <Calendar className="h-6 w-6" />
                      <span>Book Appointment</span>
                    </Button>
                  </Link>
                  <Link href="/virtual-care">
                    <Button variant="outline" className="h-auto w-full flex-col gap-2 p-4" data-testid="action-virtual-care">
                      <Video className="h-6 w-6" />
                      <span>Virtual Care</span>
                    </Button>
                  </Link>
                  <Link href="/messages">
                    <Button variant="outline" className="h-auto w-full flex-col gap-2 p-4" data-testid="action-message-doctor">
                      <MessageSquare className="h-6 w-6" />
                      <span>Message Doctor</span>
                    </Button>
                  </Link>
                  <Link href="/prescriptions">
                    <Button variant="outline" className="h-auto w-full flex-col gap-2 p-4" data-testid="action-refill">
                      <Pill className="h-6 w-6" />
                      <span>Request Refill</span>
                    </Button>
                  </Link>
                </>
              )}

              {isDoctor && (
                <>
                  <Link href="/appointments">
                    <Button variant="outline" className="h-auto w-full flex-col gap-2 p-4" data-testid="action-view-schedule">
                      <Calendar className="h-6 w-6" />
                      <span>View Schedule</span>
                    </Button>
                  </Link>
                  <Link href="/patients">
                    <Button variant="outline" className="h-auto w-full flex-col gap-2 p-4" data-testid="action-patient-list">
                      <Users className="h-6 w-6" />
                      <span>Patient List</span>
                    </Button>
                  </Link>
                  <Link href="/prescriptions">
                    <Button variant="outline" className="h-auto w-full flex-col gap-2 p-4" data-testid="action-write-rx">
                      <Pill className="h-6 w-6" />
                      <span>Write Prescription</span>
                    </Button>
                  </Link>
                  <Link href="/lab-results">
                    <Button variant="outline" className="h-auto w-full flex-col gap-2 p-4" data-testid="action-review-labs">
                      <TestTube className="h-6 w-6" />
                      <span>Review Labs</span>
                    </Button>
                  </Link>
                </>
              )}

              {isAdmin && (
                <>
                  <Link href="/patients">
                    <Button variant="outline" className="h-auto w-full flex-col gap-2 p-4" data-testid="action-manage-patients">
                      <Users className="h-6 w-6" />
                      <span>Manage Patients</span>
                    </Button>
                  </Link>
                  <Link href="/doctors">
                    <Button variant="outline" className="h-auto w-full flex-col gap-2 p-4" data-testid="action-manage-doctors">
                      <Activity className="h-6 w-6" />
                      <span>Manage Doctors</span>
                    </Button>
                  </Link>
                  <Link href="/departments">
                    <Button variant="outline" className="h-auto w-full flex-col gap-2 p-4" data-testid="action-departments">
                      <FileText className="h-6 w-6" />
                      <span>Departments</span>
                    </Button>
                  </Link>
                  <Link href="/appointments">
                    <Button variant="outline" className="h-auto w-full flex-col gap-2 p-4" data-testid="action-all-appointments">
                      <Calendar className="h-6 w-6" />
                      <span>All Appointments</span>
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
