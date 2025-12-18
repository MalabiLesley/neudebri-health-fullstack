import React, { useEffect, useState } from "react";

export default function Nurses() {
  const [nurses, setNurses] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/nurses`)
      .then((r) => r.json())
      .then(setNurses)
      .catch(() => setNurses([]));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Nurses</h1>
      <div className="mt-4 grid grid-cols-1 gap-4">
        {nurses.map((n) => (
          <div key={n.id} className="rounded-md border p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{n.firstName} {n.lastName}</div>
              <div className="text-sm text-muted-foreground">{n.specialty || "Nurse"}</div>
            </div>
            <div className="text-sm">{n.phone}</div>
          </div>
        ))}
        {nurses.length === 0 && <div>No nurses found.</div>}
      </div>
    </div>
  );
}
