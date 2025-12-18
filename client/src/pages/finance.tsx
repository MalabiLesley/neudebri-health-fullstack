import React, { useEffect, useState } from "react";

export default function Finance() {
  const [bills, setBills] = useState<any[]>([]);
  const [insurances, setInsurances] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/finance/billing?patientId=patient-001`).then((r) => r.json()).then(setBills).catch(() => setBills([]));
    fetch(`/api/finance/insurances`).then((r) => r.json()).then(setInsurances).catch(() => setInsurances([]));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Finance</h1>

      <section className="mt-4">
        <h2 className="font-medium">Invoices</h2>
        {bills.length === 0 && <div className="mt-2">No invoices found.</div>}
        <div className="mt-2 space-y-2">
          {bills.map((b) => (
            <div key={b.id} className="rounded-md border p-3 flex justify-between">
              <div>
                <div className="font-medium">{b.description || b.invoiceNumber}</div>
                <div className="text-sm text-muted-foreground">{b.currency} {b.amount}</div>
              </div>
              <div className="text-sm">{b.status}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="font-medium">Insurance Providers</h2>
        {insurances.length === 0 && <div className="mt-2">No providers found.</div>}
        <ul className="mt-2 list-disc pl-5">
          {insurances.map((i) => (
            <li key={i.id}>{i.name} ({i.code})</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
