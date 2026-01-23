import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CreditCard, DollarSign, FileText, Shield, AlertCircle, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import type { BillingRecord, InsuranceProvider, Payment } from "@shared/schema";

function FinanceSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function getStatusColor(status: string): "default" | "destructive" | "outline" | "secondary" {
  switch (status.toLowerCase()) {
    case "paid":
      return "default";
    case "completed":
      return "default";
    case "pending":
      return "secondary";
    case "partial":
      return "secondary";
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
}

export default function FinancePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const patientId = user?.role === "patient" ? (user?.id || "patient-001") : "patient-001";

  const { data: billingRecords, isLoading: billingLoading } = useQuery<BillingRecord[]>({
    queryKey: [`/api/finance/billing?patientId=${patientId}`],
  });

  const { data: insuranceProviders, isLoading: insuranceLoading } = useQuery<InsuranceProvider[]>({
    queryKey: ["/api/finance/insurances"],
  });

  const bills = billingRecords || [];
  const insurances = insuranceProviders || [];
  const isLoading = billingLoading || insuranceLoading;

  // Calculate totals
  const totalAmount = bills.reduce((sum, bill) => sum + (bill.amount || 0), 0);
  const paidAmount = bills
    .filter((b) => b.status === "paid")
    .reduce((sum, bill) => sum + (bill.amount || 0), 0);
  const pendingAmount = bills
    .filter((b) => b.status === "pending" || b.status === "partial")
    .reduce((sum, bill) => sum + (bill.amount || 0), 0);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Finance & Billing</h1>
          <p className="text-muted-foreground">Manage billing and insurance information</p>
        </div>
        <FinanceSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Finance & Billing</h1>
        <p className="text-muted-foreground">View invoices, payments, and insurance information</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/30">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold">KES {totalAmount.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-green-100 dark:bg-green-900/30">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Paid</p>
              <p className="text-2xl font-bold">KES {paidAmount.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-amber-100 dark:bg-amber-900/30">
              <AlertCircle className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">KES {pendingAmount.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Invoices Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Invoices & Statements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bills.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">No Invoices</p>
                    <p className="text-sm text-muted-foreground">No billing records found</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {bills.map((bill) => (
                    <div key={bill.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex-1">
                        <div className="font-medium">{bill.description || `Invoice #${bill.invoiceNumber}`}</div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(bill.createdAt), "MMM d, yyyy")}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-lg font-semibold">
                          {bill.currency || "KES"} {bill.amount.toLocaleString()}
                        </div>
                        <Badge variant={getStatusColor(bill.status)} className="capitalize">
                          {bill.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Insurance Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Insurance Providers
              </CardTitle>
            </CardHeader>
            <CardContent>
              {insurances.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Shield className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">No Insurance Providers</p>
                    <p className="text-sm text-muted-foreground">Insurance information not available</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {insurances.map((provider) => (
                    <div key={provider.id} className="flex items-center gap-4 rounded-lg border p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/30">
                        <Shield className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{provider.name}</div>
                        {provider.code && (
                          <div className="text-sm text-muted-foreground">Code: {provider.code}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button variant="outline" className="justify-start">
                <CreditCard className="h-4 w-4 mr-2" />
                Add Card
              </Button>
              <Button variant="outline" className="justify-start">
                Bank Transfer
              </Button>
              <Button variant="outline" className="justify-start">
                M-Pesa / Mobile Money
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button
                variant="outline"
                className="justify-start"
                onClick={() =>
                  toast({
                    title: "Invoice Download",
                    description: "Preparing your invoice...",
                  })
                }
              >
                <FileText className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                onClick={() =>
                  toast({
                    title: "Support",
                    description: "Contact billing support",
                  })
                }
              >
                Contact Billing
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment Info</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2 text-muted-foreground">
              <p>• Accepted: All major cards, bank transfers, M-Pesa</p>
              <p>• Secure: 256-bit SSL encryption</p>
              <p>• Instant: Real-time payment confirmation</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
