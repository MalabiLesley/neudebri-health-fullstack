import React, { useEffect, useState } from "react";

export default function WoundCare() {
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/wound-care?patientId=patient-001`)
      .then((r) => r.json())
      .then(setRecords)
      .catch(() => setRecords([]));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Wound Care</h1>
      <div className="mt-4 space-y-4">
        {records.length === 0 && <div>No wound records found.</div>}
        {records.map((r) => (
          <div key={r.id} className="rounded-md border p-4">
            <div className="flex justify-between">
              <div>
                <div className="font-medium">{r.woundType || "Wound"}</div>
                <div className="text-sm text-muted-foreground">{new Date(r.date).toLocaleString()}</div>
              </div>
              <div className="text-sm">{r.stage}</div>
            </div>
            <div className="mt-2 text-sm">{r.description}</div>
            <div className="mt-2 text-xs text-muted-foreground">Treatment: {r.treatmentPlan}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
