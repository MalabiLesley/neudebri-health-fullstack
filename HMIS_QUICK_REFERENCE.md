# 🎯 SANITAS HMIS - Quick Reference Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  SANITAS HMIS SYSTEM                     │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  OPD CONSOLE │  │  IPD CONSOLE │  │ EMERGENCY    │  │
│  │              │  │              │  │   CONSOLE    │  │
│  │ - Consults   │  │ - Ward Mgmt  │  │ - Triage     │  │
│  │ - Patients   │  │ - Beds       │  │ - Critical   │  │
│  │ - Doctors    │  │ - Admissions │  │ - Alerts     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │         SHARED MODULES & SERVICES                  │ │
│  │  Patient Mgmt │ Prescriptions │ Lab │ Finance │    │ │
│  │  Messaging │ Vital Signs │ Health Records │        │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │              DATABASE & STORAGE                    │ │
│  │  PostgreSQL (Production) / In-Memory (Demo)        │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## Module Access by Role

| Module | Patient | Doctor | Nurse | Admin |
|--------|---------|--------|-------|-------|
| OPD Console | - | ✅ | - | ✅ |
| IPD Console | - | - | ✅ | ✅ |
| Emergency | - | - | ✅ | ✅ |
| Appointments | ✅ | ✅ | - | ✅ |
| Prescriptions | ✅ | ✅ | - | ✅ |
| Lab Results | ✅ | ✅ | - | ✅ |
| Health Records | ✅ | ✅ | ✅ | ✅ |
| Messages | ✅ | ✅ | ✅ | ✅ |
| Patients | - | ✅ | ✅ | ✅ |
| Doctors | - | - | - | ✅ |
| Nurses | - | ✅ | - | ✅ |
| Finance | - | - | - | ✅ |

---

## OPD Console Workflow

```
┌─────────────────────────────────────────────┐
│  PATIENT ARRIVES FOR CONSULTATION           │
├─────────────────────────────────────────────┤
│  1. Patient Check-in                        │
│     └─> Queue Management System             │
│                                              │
│  2. Doctor Assignment                       │
│     └─> Doctor Availability Check           │
│                                              │
│  3. Consultation                            │
│     └─> Patient-Doctor Interaction          │
│     └─> Observations & Notes                │
│                                              │
│  4. Output Generation                       │
│     └─> Prescription                        │
│     └─> Lab Order (if needed)               │
│     └─> Follow-up Schedule                  │
│                                              │
│  5. Complete                                │
│     └─> Consultation Record Saved           │
└─────────────────────────────────────────────┘
```

**Status Flow:** Scheduled → Confirmed → In Progress → Completed

---

## IPD Console Workflow

```
┌────────────────────────────────────────────┐
│  PATIENT ADMISSION TO WARD                 │
├────────────────────────────────────────────┤
│  1. Admission                              │
│     └─> Ward Selection                     │
│     └─> Bed Assignment                     │
│     └─> Doctor Assignment                  │
│                                             │
│  2. Ongoing Care                           │
│     └─> Vital Signs Monitoring             │
│     └─> Nursing Care Plans                 │
│     └─> Medication Administration          │
│     └─> Progress Tracking                  │
│                                             │
│  3. Ward Management                        │
│     └─> Patient Transfers                  │
│     └─> Bed Occupancy Tracking             │
│                                             │
│  4. Discharge                              │
│     └─> Final Assessment                   │
│     └─> Discharge Summary                  │
│     └─> Follow-up Plan                     │
│                                             │
│  5. Record Archival                        │
│     └─> Medical Records Stored             │
└────────────────────────────────────────────┘
```

**Bed Status:** Available → Occupied → Recovery → Discharge Ready → Cleaned

---

## Emergency Console Workflow

```
┌─────────────────────────────────────────────┐
│  EMERGENCY PATIENT ARRIVES                  │
├─────────────────────────────────────────────┤
│  1. Triage Assessment                       │
│     ├─ Critical (🔴)                        │
│     ├─ Urgent (🟠)                          │
│     ├─ Semi-Urgent (🟡)                     │
│     └─ Non-Urgent (🟢)                      │
│                                              │
│  2. Resource Allocation                     │
│     └─> Bed Assignment                      │
│     └─> Doctor Assignment                   │
│     └─> Priority Queue Placement            │
│                                              │
│  3. Initial Treatment                       │
│     └─> Vital Signs Monitoring              │
│     └─> Emergency Procedures                │
│     └─> Medication Administration           │
│                                              │
│  4. Outcomes                                │
│     ├─ Stabilized → Ward Admission          │
│     ├─ Treated → Discharge                  │
│     ├─ Critical → ICU Admission             │
│     └─> Medical Records Updated             │
└─────────────────────────────────────────────┘
```

**Wait Time Tracking:** Real-time updates with minute-level precision

---

## Key Features by Module

### OPD Console
✅ Real-time consultation queue  
✅ Doctor availability management  
✅ Consultation status tracking  
✅ Patient search & filtering  
✅ Statistics dashboard  
✅ Department-wise view  

### IPD Console
✅ Ward management (capacity, occupancy, type)  
✅ Bed assignment and tracking  
✅ Patient admission/discharge workflow  
✅ Ward status monitoring  
✅ Occupancy rate calculation  
✅ Patient transfer management  

### Emergency Console
✅ Triage level classification  
✅ Real-time wait time tracking  
✅ Critical case alerts  
✅ Emergency queue management  
✅ Doctor/bed assignment for ER  
✅ Case severity filtering  

---

## User Navigation

### Doctor Dashboard
```
Dashboard
├─ OPD Console (⭐ Primary)
├─ Appointments
├─ My Patients
├─ Prescriptions
├─ Lab Results
├─ Virtual Care
├─ Nurses Management
└─ Messages
```

### Nurse Dashboard
```
Dashboard
├─ IPD Console (⭐ Primary)
├─ Emergency Console (⭐ Primary)
├─ My Patients
├─ Vital Signs
├─ Wound Care
└─ Messages
```

### Admin Dashboard
```
Dashboard
├─ OPD Console
├─ IPD Console
├─ Emergency Console
├─ Patients Management
├─ Doctors Management
├─ Nurses Management
├─ Departments
├─ Finance
├─ Appointments
└─ Messages
```

---

## Demo Credentials

| Role | Username | Password | Access |
|------|----------|----------|--------|
| Patient | patient | password | Patient Portal |
| Doctor | doctor | password | OPD + Management |
| Nurse | nurse | password | IPD + Emergency |
| Admin | admin | password | Full System |

---

## API Quick Reference

```bash
# List all patients
curl http://localhost:5000/api/users/patients

# List all doctors
curl http://localhost:5000/api/users/doctors

# List all nurses
curl http://localhost:5000/api/nurses

# Get appointments
curl http://localhost:5000/api/appointments

# Get dashboard stats
curl http://localhost:5000/api/dashboard/stats

# Demo login as patient
curl http://localhost:5000/api/auth/demo/patient

# Demo login as doctor
curl http://localhost:5000/api/auth/demo/doctor

# Demo login as admin
curl http://localhost:5000/api/auth/demo/admin
```

---

## Deployment Checklist

- [ ] Backend deployed to Render.com
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] VITE_API_BASE set to Render backend URL
- [ ] Database configured (if using PostgreSQL)
- [ ] SSL/HTTPS enabled
- [ ] Backup strategy implemented
- [ ] Monitoring configured
- [ ] Users created and assigned roles
- [ ] Initial data loaded

---

## Important URLs

### Local Development
- **Frontend:** http://localhost:5000
- **API:** http://localhost:5000/api

### Production (Example)
- **Frontend:** https://neudebri-health.vercel.app
- **Backend:** https://neudebri-health-api.render.com

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| OPD not loading | Check API endpoint accessibility |
| IPD bed status wrong | Refresh page, check database |
| Emergency queue empty | Verify sample data loaded |
| API 404 errors | Ensure backend is running |
| CORS errors | Check VITE_API_BASE setting |

---

**Last Updated:** January 23, 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅
