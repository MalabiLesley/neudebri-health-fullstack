import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Skeleton } from "@/components/ui/skeleton";

import Dashboard from "@/pages/dashboard";
import Appointments from "@/pages/appointments";
import HealthRecords from "@/pages/health-records";
import Prescriptions from "@/pages/prescriptions";
import LabResults from "@/pages/lab-results";
import Messages from "@/pages/messages";
import VirtualCare from "@/pages/virtual-care";
import Patients from "@/pages/patients";
import Doctors from "@/pages/doctors";
import Departments from "@/pages/departments";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import WoundCare from "@/pages/wound-care";
import Nurses from "@/pages/nurses";
import Finance from "@/pages/finance";
import OPDConsole from "@/pages/opd-console";
import IPDConsole from "@/pages/ipd-console";
import EmergencyConsole from "@/pages/emergency-console";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/appointments" component={Appointments} />
      <Route path="/health-records" component={HealthRecords} />
      <Route path="/prescriptions" component={Prescriptions} />
      <Route path="/lab-results" component={LabResults} />
      <Route path="/messages" component={Messages} />
      <Route path="/virtual-care" component={VirtualCare} />
      <Route path="/wound-care" component={WoundCare} />
      <Route path="/patients" component={Patients} />
      <Route path="/doctors" component={Doctors} />
      <Route path="/nurses" component={Nurses} />
      <Route path="/finance" component={Finance} />
      <Route path="/departments" component={Departments} />
      <Route path="/opd" component={OPDConsole} />
      <Route path="/ipd" component={IPDConsole} />
      <Route path="/emergency" component={EmergencyConsole} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    );
  }

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b px-4">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto p-6">
            <Router />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="neudebri-theme">
        <AuthProvider>
          <TooltipProvider>
            <AppLayout />
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
