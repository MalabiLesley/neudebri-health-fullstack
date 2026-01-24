import { useLocation, Link } from "wouter";
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Pill, 
  Users, 
  Settings, 
  Video,
  TestTube,
  Activity,
  Building2,
  LogOut,
  UserCircle,
  Shield,
  AlertTriangle,
  Bed,
  Stethoscope,
  Briefcase
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";

const patientNavItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Appointments", url: "/appointments", icon: Calendar },
  { title: "Virtual Care", url: "/virtual-care", icon: Video },
  { title: "Wound Care", url: "/wound-care", icon: Activity },
  { title: "Health Records", url: "/health-records", icon: FileText },
  { title: "Prescriptions", url: "/prescriptions", icon: Pill },
  { title: "Lab Results", url: "/lab-results", icon: TestTube },
  { title: "Messages", url: "/messages", icon: MessageSquare },
];

const doctorNavItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "OPD Console", url: "/opd", icon: Stethoscope },
  { title: "Appointments", url: "/appointments", icon: Calendar },
  { title: "My Patients", url: "/patients", icon: Users },
  { title: "Virtual Care", url: "/virtual-care", icon: Video },
  { title: "Nurses", url: "/nurses", icon: Users },
  { title: "Prescriptions", url: "/prescriptions", icon: Pill },
  { title: "Lab Results", url: "/lab-results", icon: TestTube },
  { title: "Messages", url: "/messages", icon: MessageSquare },
];

const nurseNavItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "IPD Console", url: "/ipd", icon: Bed },
  { title: "Emergency", url: "/emergency", icon: AlertTriangle },
  { title: "My Patients", url: "/patients", icon: Users },
  { title: "Vital Signs", url: "/health-records", icon: Activity },
  { title: "Wound Care", url: "/wound-care", icon: Activity },
  { title: "Messages", url: "/messages", icon: MessageSquare },
];

const adminNavItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "OPD", url: "/opd", icon: Stethoscope },
  { title: "IPD", url: "/ipd", icon: Bed },
  { title: "Emergency", url: "/emergency", icon: AlertTriangle },
  { title: "Appointments", url: "/appointments", icon: Calendar },
  { title: "Patients", url: "/patients", icon: Users },
  { title: "Doctors", url: "/doctors", icon: Activity },
  { title: "Nurses", url: "/nurses", icon: Users },
  { title: "Departments", url: "/departments", icon: Building2 },
  { title: "HR Management", url: "/hr-management", icon: Briefcase },
  { title: "Finance", url: "/finance", icon: Shield },
  { title: "Messages", url: "/messages", icon: MessageSquare },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { user, logout, switchUser } = useAuth();

  const getNavItems = () => {
    switch (user?.role) {
      case "nurse":
        return nurseNavItems;
      case "doctor":
        return doctorNavItems;
      case "admin":
        return adminNavItems;
      default:
        return patientNavItems;
    }
  };

  const navItems = getNavItems();
  const initials = user ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}` : "U";

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin": return "destructive";
      case "doctor": return "default";
      case "nurse": return "secondary";
      default: return "outline";
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold">Neudebri</span>
            <span className="text-xs text-muted-foreground">Health System</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarSeparator />
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Demo Accounts</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="flex flex-col gap-2 px-2">
              <Button 
                variant={user?.role === "patient" ? "default" : "outline"} 
                size="sm" 
                className="justify-start gap-2"
                onClick={() => switchUser("patient")}
                data-testid="button-switch-patient"
              >
                <UserCircle className="h-4 w-4" />
                Patient View
              </Button>
              <Button 
                variant={user?.role === "doctor" ? "default" : "outline"} 
                size="sm" 
                className="justify-start gap-2"
                onClick={() => switchUser("doctor")}
                data-testid="button-switch-doctor"
              >
                <Activity className="h-4 w-4" />
                Doctor View
              </Button>
              <Button 
                variant={user?.role === "admin" ? "default" : "outline"} 
                size="sm" 
                className="justify-start gap-2"
                onClick={() => switchUser("admin")}
                data-testid="button-switch-admin"
              >
                <Shield className="h-4 w-4" />
                Admin View
              </Button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarSeparator className="mb-4" />
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col overflow-hidden">
            <span className="truncate text-sm font-medium">
              {user?.firstName} {user?.lastName}
            </span>
            <div className="flex items-center gap-2">
              <Badge variant={getRoleBadgeVariant(user?.role || "")} className="text-xs capitalize">
                {user?.role}
              </Badge>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={logout}
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
