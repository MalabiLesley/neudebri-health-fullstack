# Feature parity: Sanitas HmIS → Neudebri

This document maps core Sanitas HmIS features to the current Neudebri project status and lists recommended next steps to reach parity (and improvements).

Implemented features (core):
- Patient profiles: implemented (`/api/users`, client pages)
- Appointments: create/list/cancel (`/api/appointments`)
- Health records (EHR): `health-records` page and API
- Vital signs recording and charts (`/api/vital-signs`, `VitalSignsChart`)
- Prescriptions: list/create (`/api/prescriptions`)
- Lab results: list/create (`/api/lab-results`)
- Virtual care placeholder (`/virtual-care` page)
- Wound care: list and display (`/api/wound-care`, `wound-care` page)
- Messaging: basic secure messages (`/api/messages`)

Partially implemented or placeholders:
- Virtual consult (video): UI placeholder; needs actual signaling/SDK integration (OpenTok, Jitsi, Twilio)
- Prescription e-prescribing workflows / pharmacy integration: missing
- Billing & Insurance: basic CRUD exists; needs payment gateway integration and invoice generation
- Audit logging & HIPAA-level encryption: application-level logging present, but not fully hardened for production

Recommended immediate improvements to reach parity:
1. Integrate a video SDK for virtual visits (start with Jitsi for self-hosting or Twilio for managed service).
2. Add invoice PDF generation and integrate a payment gateway (Stripe or local mobile money where appropriate).
3. Harden authentication (sessions → JWT or session store with HTTPS) and add role-based route guards in the API.
4. Add end-to-end tests for critical flows: login, book appointment, create record, send message.
5. Implement audit logs for data changes (who changed what and when).

Notes and enhancements beyond Sanitas:
- Dashboard analytics and trend detection via simple ML hooks (future roadmap).
- Offline-capable vitals capture and mobile-friendly UI.

If you want, I can start implementing the high priority items (video integration, payment integration) next.
