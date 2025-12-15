import { Settings, User, Bell, Shield, Palette, Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/lib/theme-provider";
import { useAuth } from "@/lib/auth-context";

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div className="flex flex-col gap-6" data-testid="settings-page">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application preferences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Settings
            </CardTitle>
            <CardDescription>
              Manage your personal information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Full Name</Label>
              <p className="text-sm font-medium">
                {user?.firstName} {user?.lastName}
              </p>
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <p className="text-sm font-medium">{user?.email}</p>
            </div>
            <div className="grid gap-2">
              <Label>Role</Label>
              <p className="text-sm font-medium capitalize">{user?.role}</p>
            </div>
            <Separator />
            <Button variant="outline">Edit Profile</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize the look of the application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Toggle between light and dark themes
                </p>
              </div>
              <Switch
                checked={resolvedTheme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                data-testid="switch-dark-mode"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive appointment reminders via email
                </p>
              </div>
              <Switch defaultChecked data-testid="switch-email-notifications" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive text message reminders
                </p>
              </div>
              <Switch defaultChecked data-testid="switch-sms-notifications" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Message Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified of new messages
                </p>
              </div>
              <Switch defaultChecked data-testid="switch-message-alerts" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>
              Manage your account security
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security
                </p>
              </div>
              <Switch data-testid="switch-2fa" />
            </div>
            <Separator />
            <Button variant="outline">Change Password</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm font-medium">HIPAA Compliant</p>
              <p className="text-xs text-muted-foreground">
                Your data is encrypted and protected
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Last login: Today at {new Date().toLocaleTimeString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
