import { 
  type User, type InsertUser, type UserRole,
  type Appointment, type InsertAppointment, type AppointmentType, type AppointmentStatus,
  type HealthRecord, type InsertHealthRecord,
  type VitalSigns, type InsertVitalSigns,
  type LabResult, type InsertLabResult, type LabResultStatus,
  type Prescription, type InsertPrescription, type PrescriptionStatus,
  type Message, type InsertMessage,
  type Department, type InsertDepartment,
  type DashboardStats,
  type AppointmentWithDetails,
  type MessageWithSender,
  type PrescriptionWithDoctor,
  type LabResultWithDoctor,
  type WoundRecord, type InsertWoundRecord,
  type BillingRecord, type InsertBillingRecord,
  type InsuranceProvider, type Payment, type InsertPayment,
  type EmployeeRecord, type InsertEmployeeRecord,
  type ShiftSchedule, type InsertShiftSchedule,
  type AttendanceRecord, type InsertAttendanceRecord,
  type LeaveRequest, type InsertLeaveRequest,
  type PayrollRecord, type InsertPayrollRecord,
  type PerformanceReview, type InsertPerformanceReview,
  type Certification, type InsertCertification,
  type AssetAllocation, type InsertAssetAllocation,
  type DisciplinaryAction, type InsertDisciplinaryAction,
  type HRStats,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsersByRole(role: string): Promise<User[]>;
  getAllPatients(): Promise<User[]>;
  getAllDoctors(): Promise<User[]>;
  
  // Appointments
  getAppointments(userId: string, role: string): Promise<AppointmentWithDetails[]>;
  getUpcomingAppointments(userId: string, role: string): Promise<AppointmentWithDetails[]>;
  getVirtualAppointments(userId: string, role: string): Promise<AppointmentWithDetails[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointmentStatus(id: string, status: string): Promise<Appointment | undefined>;
  
  // Health Records
  getHealthRecords(patientId: string): Promise<HealthRecord[]>;
  createHealthRecord(record: InsertHealthRecord): Promise<HealthRecord>;
  
  // Vital Signs
  getVitalSigns(patientId: string): Promise<VitalSigns[]>;
  createVitalSigns(vitals: InsertVitalSigns): Promise<VitalSigns>;
  
  // Lab Results
  getLabResults(patientId: string): Promise<LabResultWithDoctor[]>;
  createLabResult(result: InsertLabResult): Promise<LabResult>;
  
  // Prescriptions
  getPrescriptions(userId: string, role: string): Promise<PrescriptionWithDoctor[]>;
  createPrescription(prescription: InsertPrescription): Promise<Prescription>;
  
  // Messages
  getMessages(userId: string): Promise<MessageWithSender[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: string): Promise<Message | undefined>;
  
  // Departments
  getDepartments(): Promise<Department[]>;
  createDepartment(department: InsertDepartment): Promise<Department>;

  // Wound care
  getWoundRecords(patientId: string): Promise<WoundRecord[]>;
  createWoundRecord(record: InsertWoundRecord): Promise<WoundRecord>;

  // Nurses
  getNurses(): Promise<User[]>;

  // Finance / Billing
  getBillingForPatient(patientId: string): Promise<BillingRecord[]>;
  createBillingRecord(billing: InsertBillingRecord): Promise<BillingRecord>;
  getInsuranceProviders(): Promise<InsuranceProvider[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  
  // HR Management
  getEmployees(): Promise<EmployeeRecord[]>;
  getEmployeeById(id: string): Promise<EmployeeRecord | undefined>;
  createEmployee(employee: InsertEmployeeRecord): Promise<EmployeeRecord>;
  updateEmployee(id: string, employee: Partial<InsertEmployeeRecord>): Promise<EmployeeRecord | undefined>;
  
  // Attendance
  getAttendanceRecords(employeeId: string, month?: string): Promise<AttendanceRecord[]>;
  createAttendanceRecord(record: InsertAttendanceRecord): Promise<AttendanceRecord>;
  
  // Leave Management
  getLeaveRequests(employeeId?: string): Promise<LeaveRequest[]>;
  createLeaveRequest(request: InsertLeaveRequest): Promise<LeaveRequest>;
  approveLeaveRequest(id: string, approvedBy: string): Promise<LeaveRequest | undefined>;
  
  // Payroll
  getPayrollRecords(employeeId?: string, month?: string): Promise<PayrollRecord[]>;
  createPayrollRecord(record: InsertPayrollRecord): Promise<PayrollRecord>;
  
  // Performance Reviews
  getPerformanceReviews(employeeId?: string): Promise<PerformanceReview[]>;
  createPerformanceReview(review: InsertPerformanceReview): Promise<PerformanceReview>;
  
  // Shift Schedules
  getShiftSchedules(employeeId?: string): Promise<ShiftSchedule[]>;
  createShiftSchedule(schedule: InsertShiftSchedule): Promise<ShiftSchedule>;
  
  // Certifications
  getCertifications(employeeId?: string): Promise<Certification[]>;
  createCertification(cert: InsertCertification): Promise<Certification>;
  
  // Asset Management
  getAssetAllocations(employeeId?: string): Promise<AssetAllocation[]>;
  createAssetAllocation(asset: InsertAssetAllocation): Promise<AssetAllocation>;
  
  // HR Stats
  getHRStats(): Promise<HRStats>;
  
  // Dashboard
  getDashboardStats(userId: string, role: string): Promise<DashboardStats>;
  
  // Contacts
  getContacts(userId: string, role: string): Promise<User[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private appointments: Map<string, Appointment>;
  private healthRecords: Map<string, HealthRecord>;
  private vitalSigns: Map<string, VitalSigns>;
  private labResults: Map<string, LabResult>;
  private prescriptions: Map<string, Prescription>;
  private messages: Map<string, Message>;
  private departments: Map<string, Department>;
  private woundRecords: Map<string, WoundRecord>;
  private billings: Map<string, BillingRecord>;
  private insurances: Map<string, InsuranceProvider>;
  private payments: Map<string, Payment>;
  private employees: Map<string, EmployeeRecord>;
  private shifts: Map<string, ShiftSchedule>;
  private attendance: Map<string, AttendanceRecord>;
  private leaves: Map<string, LeaveRequest>;
  private payroll: Map<string, PayrollRecord>;
  private reviews: Map<string, PerformanceReview>;
  private certifications: Map<string, Certification>;
  private assets: Map<string, AssetAllocation>;

  constructor() {
    this.users = new Map();
    this.appointments = new Map();
    this.healthRecords = new Map();
    this.vitalSigns = new Map();
    this.labResults = new Map();
    this.prescriptions = new Map();
    this.messages = new Map();
    this.departments = new Map();
    this.woundRecords = new Map();
    this.billings = new Map();
    this.insurances = new Map();
    this.payments = new Map();
    this.employees = new Map();
    this.shifts = new Map();
    this.attendance = new Map();
    this.leaves = new Map();
    this.payroll = new Map();
    this.reviews = new Map();
    this.certifications = new Map();
    this.assets = new Map();
    
    this.seedData();
  }

  private seedData() {
    // Create demo users
    const patientId = "patient-001";
    const doctorId = "doctor-001";
    const doctor2Id = "doctor-002";
    const adminId = "admin-001";
    const nurseId = "nurse-001";

    // Patient
    this.users.set(patientId, {
      id: patientId,
      username: "patient",
      password: "password",
      email: "john.doe@email.com",
      firstName: "John",
      lastName: "Doe",
      role: "patient",
      phone: "+254 712 345 678",
      dateOfBirth: "1985-06-15",
      gender: "male",
      address: "123 Health Street, Nairobi, Kenya",
      avatarUrl: null,
      specialty: null,
      licenseNumber: null,
      department: null,
      isActive: true,
    });

    // Doctors
    this.users.set(doctorId, {
      id: doctorId,
      username: "doctor",
      password: "password",
      email: "dr.smith@neudebri.com",
      firstName: "Sarah",
      lastName: "Smith",
      role: "doctor",
      phone: "+254 722 111 222",
      dateOfBirth: "1978-03-20",
      gender: "female",
      address: "Neudebri Medical Center",
      avatarUrl: null,
      specialty: "Internal Medicine",
      licenseNumber: "KEN-MED-12345",
      department: "Internal Medicine",
      isActive: true,
    });

    this.users.set(doctor2Id, {
      id: doctor2Id,
      username: "doctor2",
      password: "password",
      email: "dr.johnson@neudebri.com",
      firstName: "Michael",
      lastName: "Johnson",
      role: "doctor",
      phone: "+254 722 333 444",
      dateOfBirth: "1982-09-10",
      gender: "male",
      address: "Neudebri Medical Center",
      avatarUrl: null,
      specialty: "Cardiology",
      licenseNumber: "KEN-MED-67890",
      department: "Cardiology",
      isActive: true,
    });

    // Admin
    this.users.set(adminId, {
      id: adminId,
      username: "admin",
      password: "password",
      email: "admin@neudebri.com",
      firstName: "Admin",
      lastName: "User",
      role: "admin",
      phone: "+254 700 000 000",
      dateOfBirth: "1990-01-01",
      gender: "other",
      address: "Neudebri Health System HQ",
      avatarUrl: null,
      specialty: null,
      licenseNumber: null,
      department: "Administration",
      isActive: true,
    });

    // Nurse
    this.users.set(nurseId, {
      id: nurseId,
      username: "nurse",
      password: "password",
      email: "nurse.mary@neudebri.com",
      firstName: "Mary",
      lastName: "Wanjiku",
      role: "nurse",
      phone: "+254 711 555 666",
      dateOfBirth: "1992-07-25",
      gender: "female",
      address: "Neudebri Medical Center",
      avatarUrl: null,
      specialty: "General Nursing",
      licenseNumber: "KEN-NUR-11111",
      department: "Internal Medicine",
      isActive: true,
    });

    // Create departments
    const depts = [
      { name: "Internal Medicine", description: "General medical care and diagnostics", location: "Building A, Floor 2", phone: "+254 20 111 1111" },
      { name: "Cardiology", description: "Heart and cardiovascular care", location: "Building B, Floor 1", phone: "+254 20 222 2222" },
      { name: "Pediatrics", description: "Child and adolescent healthcare", location: "Building A, Floor 3", phone: "+254 20 333 3333" },
      { name: "Laboratory", description: "Diagnostic testing and analysis", location: "Building C, Floor 1", phone: "+254 20 444 4444" },
      { name: "Radiology", description: "Medical imaging services", location: "Building C, Floor 2", phone: "+254 20 555 5555" },
      { name: "Pharmacy", description: "Medication dispensing and consultation", location: "Building A, Floor 1", phone: "+254 20 666 6666" },
    ];

    depts.forEach((dept, i) => {
      const id = `dept-${i + 1}`;
      this.departments.set(id, {
        id,
        name: dept.name,
        description: dept.description,
        headDoctorId: i === 0 ? doctorId : i === 1 ? doctor2Id : null,
        location: dept.location,
        phone: dept.phone,
        isActive: true,
      });
    });

    // Create appointments
    const now = new Date();
    const appointments = [
      {
        patientId,
        doctorId,
        dateTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
        type: "in_person" as const,
        status: "scheduled" as const,
        reason: "Annual physical examination",
        department: "Internal Medicine",
      },
      {
        patientId,
        doctorId: doctor2Id,
        dateTime: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
        type: "virtual" as const,
        status: "confirmed" as const,
        reason: "Follow-up on blood pressure management",
        department: "Cardiology",
      },
      {
        patientId,
        doctorId,
        dateTime: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
        type: "in_person" as const,
        status: "completed" as const,
        reason: "Flu symptoms consultation",
        department: "Internal Medicine",
      },
    ];

    appointments.forEach((apt, i) => {
      const id = `apt-${i + 1}`;
      this.appointments.set(id, { id, ...apt, notes: null });
    });

    // Create health records
    const healthRecords = [
      { patientId, recordType: "condition", title: "Hypertension", description: "Essential hypertension, well controlled with medication", date: "2023-01-15", severity: "moderate", status: "chronic" },
      { patientId, recordType: "allergy", title: "Penicillin", description: "Allergic reaction to penicillin-based antibiotics", date: "2020-05-10", severity: "severe", status: "active" },
      { patientId, recordType: "allergy", title: "Shellfish", description: "Mild allergic reaction to shellfish", date: "2019-08-22", severity: "mild", status: "active" },
      { patientId, recordType: "immunization", title: "COVID-19 Vaccine (Pfizer)", description: "Third booster dose administered", date: "2023-11-01", severity: null, status: null },
      { patientId, recordType: "immunization", title: "Influenza Vaccine", description: "Annual flu shot", date: "2024-10-15", severity: null, status: null },
      { patientId, recordType: "surgery", title: "Appendectomy", description: "Laparoscopic appendectomy performed successfully", date: "2018-03-20", severity: null, status: "resolved" },
    ];

    healthRecords.forEach((rec, i) => {
      const id = `hr-${i + 1}`;
      this.healthRecords.set(id, { id, ...rec, doctorId });
    });

    // Create vital signs
    const vitals = [
      { bloodPressureSystolic: 128, bloodPressureDiastolic: 82, heartRate: 72, temperature: "98.4", respiratoryRate: 16, oxygenSaturation: 98, weight: "78", height: "175" },
      { bloodPressureSystolic: 130, bloodPressureDiastolic: 85, heartRate: 75, temperature: "98.6", respiratoryRate: 18, oxygenSaturation: 97, weight: "78.5", height: "175" },
      { bloodPressureSystolic: 125, bloodPressureDiastolic: 80, heartRate: 70, temperature: "98.2", respiratoryRate: 15, oxygenSaturation: 99, weight: "77.8", height: "175" },
    ];

    vitals.forEach((v, i) => {
      const id = `vs-${i + 1}`;
      const recordedAt = new Date(now.getTime() - i * 30 * 24 * 60 * 60 * 1000).toISOString();
      this.vitalSigns.set(id, { id, patientId, recordedAt, recordedBy: nurseId, ...v, notes: null });
    });

    // Create lab results
    const labs = [
      { testName: "Complete Blood Count (CBC)", testCode: "CBC-001", status: "completed" as const, result: "Normal", normalRange: "N/A", unit: "", isAbnormal: false },
      { testName: "Hemoglobin A1C", testCode: "HBA1C-001", status: "completed" as const, result: "5.8", normalRange: "4.0-5.6", unit: "%", isAbnormal: true },
      { testName: "Lipid Panel", testCode: "LIPID-001", status: "completed" as const, result: "Total: 195", normalRange: "<200", unit: "mg/dL", isAbnormal: false },
      { testName: "Thyroid Panel (TSH)", testCode: "TSH-001", status: "pending" as const, result: null, normalRange: "0.4-4.0", unit: "mIU/L", isAbnormal: false },
    ];

    labs.forEach((lab, i) => {
      const id = `lab-${i + 1}`;
      const orderedDate = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000).toISOString();
      const resultDate = lab.status === "completed" ? new Date(now.getTime() - i * 5 * 24 * 60 * 60 * 1000).toISOString() : null;
      this.labResults.set(id, { id, patientId, orderedBy: doctorId, orderedDate, resultDate, ...lab, notes: null });
    });

    // Create prescriptions
    const prescriptions = [
      { medicationName: "Lisinopril", dosage: "10mg", frequency: "Once daily", route: "oral", refillsRemaining: 2, refillsTotal: 3, status: "active" as const, instructions: "Take in the morning with water", pharmacy: "Neudebri Pharmacy" },
      { medicationName: "Metformin", dosage: "500mg", frequency: "Twice daily", route: "oral", refillsRemaining: 1, refillsTotal: 2, status: "active" as const, instructions: "Take with meals", pharmacy: "Neudebri Pharmacy" },
      { medicationName: "Atorvastatin", dosage: "20mg", frequency: "Once daily", route: "oral", refillsRemaining: 0, refillsTotal: 3, status: "completed" as const, instructions: "Take at bedtime", pharmacy: "Neudebri Pharmacy" },
    ];

    prescriptions.forEach((rx, i) => {
      const id = `rx-${i + 1}`;
      const startDate = new Date(now.getTime() - (90 - i * 30) * 24 * 60 * 60 * 1000).toISOString();
      this.prescriptions.set(id, { id, patientId, doctorId, startDate, endDate: null, ...rx, notes: null });
    });

    // Create messages
    const msgs = [
      { senderId: doctorId, receiverId: patientId, subject: "Lab Results Available", content: "Dear John,\n\nYour recent lab results are now available in your patient portal. Your A1C is slightly elevated at 5.8%. I recommend we discuss dietary adjustments at your next appointment.\n\nBest regards,\nDr. Sarah Smith", priority: "normal", isRead: false },
      { senderId: patientId, receiverId: doctorId, subject: "Question about medication", content: "Dr. Smith,\n\nI've been experiencing some dizziness after taking my blood pressure medication in the morning. Should I be concerned?\n\nThank you,\nJohn", priority: "high", isRead: true },
      { senderId: doctor2Id, receiverId: patientId, subject: "Upcoming Virtual Appointment", content: "Hello John,\n\nThis is a reminder about your upcoming virtual consultation on cardiology follow-up. Please ensure you have your blood pressure readings from the past week ready to discuss.\n\nSee you soon,\nDr. Michael Johnson", priority: "normal", isRead: false },
    ];

    msgs.forEach((msg, i) => {
      const id = `msg-${i + 1}`;
      const sentAt = new Date(now.getTime() - i * 2 * 24 * 60 * 60 * 1000).toISOString();
      this.messages.set(id, { id, ...msg, sentAt, readAt: msg.isRead ? sentAt : null, isArchived: false, attachments: null });
    });

    // Sample wound care record
    const woundId = `wound-1`;
    this.woundRecords.set(woundId, {
      id: woundId,
      patientId: patientId,
      nurseId: nurseId,
      doctorId: doctorId,
      date: new Date().toISOString(),
      woundType: "Pressure Ulcer",
      size: "2cm x 1cm",
      stage: "Stage II",
      description: "Small superficial ulcer on left heel",
      treatmentPlan: "Cleanse with saline, apply dressing twice daily",
      photos: null,
      notes: "Monitor for infection",
    });

    // Sample insurance providers
    this.insurances.set("ins-1", { id: "ins-1", name: "Sanitas Health Insurance", code: "SAN-001" });
    this.insurances.set("ins-2", { id: "ins-2", name: "National Health Cover", code: "NHC-KE" });

    // Sample billing record
    const billId = `bill-1`;
    this.billings.set(billId, {
      id: billId,
      patientId,
      amount: 12000,
      currency: "KES",
      status: "pending",
      insuranceProviderId: "ins-1",
      invoiceNumber: "INV-1001",
      createdAt: new Date().toISOString(),
      description: "Wound care consultation and dressing",
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      role: insertUser.role as UserRole,
      address: insertUser.address ?? null,
      phone: insertUser.phone ?? null,
      dateOfBirth: insertUser.dateOfBirth ?? null,
      gender: insertUser.gender ?? null,
      avatarUrl: insertUser.avatarUrl ?? null,
      specialty: insertUser.specialty ?? null,
      licenseNumber: insertUser.licenseNumber ?? null,
      department: insertUser.department ?? null,
      isActive: insertUser.isActive ?? true,
    };
    this.users.set(id, user);
    return user;
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return Array.from(this.users.values()).filter((user) => user.role === role);
  }

  async getAllPatients(): Promise<User[]> {
    return this.getUsersByRole("patient");
  }

  async getAllDoctors(): Promise<User[]> {
    return Array.from(this.users.values()).filter((user) => user.role === "doctor" || user.role === "nurse");
  }

  // Appointment methods
  async getAppointments(userId: string, role: string): Promise<AppointmentWithDetails[]> {
    const appointments = Array.from(this.appointments.values());
    const filtered = role === "patient" 
      ? appointments.filter((a) => a.patientId === userId)
      : role === "doctor" || role === "nurse"
        ? appointments.filter((a) => a.doctorId === userId)
        : appointments;
    
    return Promise.all(filtered.map(async (apt) => ({
      ...apt,
      patient: await this.getUser(apt.patientId),
      doctor: await this.getUser(apt.doctorId),
    })));
  }

  async getUpcomingAppointments(userId: string, role: string): Promise<AppointmentWithDetails[]> {
    const all = await this.getAppointments(userId, role);
    const now = new Date();
    return all
      .filter((a) => new Date(a.dateTime) >= now && a.status !== "cancelled")
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  }

  async getVirtualAppointments(userId: string, role: string): Promise<AppointmentWithDetails[]> {
    const all = await this.getAppointments(userId, role);
    return all.filter((a) => a.type === "virtual");
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const id = randomUUID();
    const apt: Appointment = {
      ...appointment,
      id,
      type: appointment.type as AppointmentType,
      status: appointment.status as AppointmentStatus,
      reason: appointment.reason ?? null,
      notes: appointment.notes ?? null,
      department: appointment.department ?? null,
    };
    this.appointments.set(id, apt);
    return apt;
  }

  async updateAppointmentStatus(id: string, status: string): Promise<Appointment | undefined> {
    const apt = this.appointments.get(id);
    if (apt) {
      apt.status = status as any;
      this.appointments.set(id, apt);
    }
    return apt;
  }

  // Health Record methods
  async getHealthRecords(patientId: string): Promise<HealthRecord[]> {
    return Array.from(this.healthRecords.values())
      .filter((r) => r.patientId === patientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createHealthRecord(record: InsertHealthRecord): Promise<HealthRecord> {
    const id = randomUUID();
    const hr: HealthRecord = {
      ...record,
      id,
      description: record.description ?? null,
      doctorId: record.doctorId ?? null,
      severity: record.severity ?? null,
      status: record.status ?? null,
    };
    this.healthRecords.set(id, hr);
    return hr;
  }

  // Vital Signs methods
  async getVitalSigns(patientId: string): Promise<VitalSigns[]> {
    return Array.from(this.vitalSigns.values())
      .filter((v) => v.patientId === patientId)
      .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
  }

  async createVitalSigns(vitals: InsertVitalSigns): Promise<VitalSigns> {
    const id = randomUUID();
    const vs: VitalSigns = {
      ...vitals,
      id,
      recordedBy: vitals.recordedBy ?? null,
      bloodPressureSystolic: vitals.bloodPressureSystolic ?? null,
      bloodPressureDiastolic: vitals.bloodPressureDiastolic ?? null,
      heartRate: vitals.heartRate ?? null,
      temperature: vitals.temperature ?? null,
      respiratoryRate: vitals.respiratoryRate ?? null,
      oxygenSaturation: vitals.oxygenSaturation ?? null,
      weight: vitals.weight ?? null,
      height: vitals.height ?? null,
      notes: vitals.notes ?? null,
    };
    this.vitalSigns.set(id, vs);
    return vs;
  }

  // Lab Result methods
  async getLabResults(patientId: string): Promise<LabResultWithDoctor[]> {
    const results = Array.from(this.labResults.values())
      .filter((r) => r.patientId === patientId)
      .sort((a, b) => new Date(b.orderedDate).getTime() - new Date(a.orderedDate).getTime());
    
    return Promise.all(results.map(async (r) => ({
      ...r,
      orderedByDoctor: r.orderedBy ? await this.getUser(r.orderedBy) : undefined,
    })));
  }

  async createLabResult(result: InsertLabResult): Promise<LabResult> {
    const id = randomUUID();
    const lr: LabResult = {
      ...result,
      id,
      testCode: result.testCode ?? null,
      orderedBy: result.orderedBy ?? null,
      resultDate: result.resultDate ?? null,
      result: result.result ?? null,
      normalRange: result.normalRange ?? null,
      unit: result.unit ?? null,
      isAbnormal: result.isAbnormal ?? false,
      notes: result.notes ?? null,
      status: result.status as LabResultStatus,
    };
    this.labResults.set(id, lr);
    return lr;
  }

  // Prescription methods
  async getPrescriptions(userId: string, role: string): Promise<PrescriptionWithDoctor[]> {
    const prescriptions = Array.from(this.prescriptions.values());
    const filtered = role === "patient"
      ? prescriptions.filter((p) => p.patientId === userId)
      : role === "doctor" || role === "nurse"
        ? prescriptions.filter((p) => p.doctorId === userId)
        : prescriptions;
    
    return Promise.all(filtered.map(async (p) => ({
      ...p,
      doctor: await this.getUser(p.doctorId),
    })));
  }

  async createPrescription(prescription: InsertPrescription): Promise<Prescription> {
    const id = randomUUID();
    const rx: Prescription = {
      ...prescription,
      id,
      route: prescription.route ?? null,
      endDate: prescription.endDate ?? null,
      refillsRemaining: prescription.refillsRemaining ?? 0,
      refillsTotal: prescription.refillsTotal ?? 0,
      instructions: prescription.instructions ?? null,
      pharmacy: prescription.pharmacy ?? null,
      notes: prescription.notes ?? null,
      status: prescription.status as PrescriptionStatus,
    };
    this.prescriptions.set(id, rx);
    return rx;
  }

  // Message methods
  async getMessages(userId: string): Promise<MessageWithSender[]> {
    const messages = Array.from(this.messages.values())
      .filter((m) => m.senderId === userId || m.receiverId === userId)
      .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
    
    return Promise.all(messages.map(async (m) => ({
      ...m,
      sender: await this.getUser(m.senderId),
      receiver: await this.getUser(m.receiverId),
    })));
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const msg: Message = {
      ...message,
      id,
      subject: message.subject ?? null,
      readAt: message.readAt ?? null,
      isRead: message.isRead ?? false,
      isArchived: message.isArchived ?? false,
      priority: message.priority ?? "normal",
      attachments: message.attachments ?? null,
    };
    this.messages.set(id, msg);
    return msg;
  }

  async markMessageAsRead(id: string): Promise<Message | undefined> {
    const msg = this.messages.get(id);
    if (msg) {
      msg.isRead = true;
      msg.readAt = new Date().toISOString();
      this.messages.set(id, msg);
    }
    return msg;
  }

  // Department methods
  async getDepartments(): Promise<Department[]> {
    return Array.from(this.departments.values());
  }

  async createDepartment(department: InsertDepartment): Promise<Department> {
    const id = randomUUID();
    const dept: Department = {
      ...department,
      id,
      description: department.description ?? null,
      headDoctorId: department.headDoctorId ?? null,
      location: department.location ?? null,
      phone: department.phone ?? null,
      isActive: department.isActive ?? true,
    };
    this.departments.set(id, dept);
    return dept;
  }

  // Dashboard stats
  async getDashboardStats(userId: string, role: string): Promise<DashboardStats> {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const appointments = await this.getAppointments(userId, role);
    const messages = await this.getMessages(userId);
    const prescriptions = await this.getPrescriptions(userId, role);
    
    const patientId = role === "patient" ? userId : undefined;
    const labResults = patientId ? await this.getLabResults(patientId) : [];

    return {
      totalPatients: (await this.getAllPatients()).length,
      totalDoctors: (await this.getAllDoctors()).length,
      appointmentsToday: appointments.filter((a) => {
        const aptDate = new Date(a.dateTime);
        return aptDate >= startOfToday && aptDate < new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);
      }).length,
      appointmentsThisWeek: appointments.filter((a) => {
        const aptDate = new Date(a.dateTime);
        return aptDate >= startOfWeek && aptDate < new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000) && a.status !== "cancelled";
      }).length,
      pendingLabResults: labResults.filter((r) => r.status === "pending" || r.status === "in_progress").length,
      activePrescriptions: prescriptions.filter((p) => p.status === "active").length,
      unreadMessages: messages.filter((m) => !m.isRead && m.receiverId === userId).length,
      virtualCareSessions: appointments.filter((a) => 
        a.type === "virtual" && 
        new Date(a.dateTime) >= startOfWeek && 
        new Date(a.dateTime) < new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000)
      ).length,
    };
  }

  // Contacts
  async getContacts(userId: string, role: string): Promise<User[]> {
    if (role === "patient") {
      return this.getAllDoctors();
    }
    return this.getAllPatients();
  }

  // Wound care methods
  async getWoundRecords(patientId: string): Promise<WoundRecord[]> {
    return Array.from(this.woundRecords.values())
      .filter((w) => w.patientId === patientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createWoundRecord(record: InsertWoundRecord): Promise<WoundRecord> {
    const id = randomUUID();
    const wr: WoundRecord = {
      id,
      ...record,
    };
    this.woundRecords.set(id, wr);
    return wr;
  }

  // Nurses
  async getNurses(): Promise<User[]> {
    return Array.from(this.users.values()).filter((u) => u.role === "nurse");
  }

  // Finance / Billing
  async getBillingForPatient(patientId: string): Promise<BillingRecord[]> {
    return Array.from(this.billings.values())
      .filter((b) => b.patientId === patientId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createBillingRecord(billing: InsertBillingRecord): Promise<BillingRecord> {
    const id = randomUUID();
    const br: BillingRecord = {
      id,
      ...billing,
      status: billing.status ?? "pending",
      createdAt: new Date().toISOString(),
    } as BillingRecord;
    this.billings.set(id, br);
    return br;
  }

  async getInsuranceProviders(): Promise<InsuranceProvider[]> {
    return Array.from(this.insurances.values());
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const id = randomUUID();
    const paidAt = new Date().toISOString();
    const p: Payment = { id, ...payment, paidAt } as Payment;
    this.payments.set(id, p);

    // mark billing as paid or partial
    const billing = this.billings.get(payment.billingId);
    if (billing) {
      if (payment.amount >= billing.amount) billing.status = "paid";
      else billing.status = "partial";
      this.billings.set(billing.id, billing);
    }

    return p;
  }

  // HR Management Methods
  async getEmployees(): Promise<EmployeeRecord[]> {
    return Array.from(this.employees.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getEmployeeById(id: string): Promise<EmployeeRecord | undefined> {
    return this.employees.get(id);
  }

  async createEmployee(employee: InsertEmployeeRecord): Promise<EmployeeRecord> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const record: EmployeeRecord = {
      id,
      ...employee,
      createdAt: now,
      updatedAt: now,
    };
    this.employees.set(id, record);
    return record;
  }

  async updateEmployee(id: string, updates: Partial<InsertEmployeeRecord>): Promise<EmployeeRecord | undefined> {
    const employee = this.employees.get(id);
    if (!employee) return undefined;
    
    const updated: EmployeeRecord = {
      ...employee,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.employees.set(id, updated);
    return updated;
  }

  async getAttendanceRecords(employeeId: string, month?: string): Promise<AttendanceRecord[]> {
    return Array.from(this.attendance.values())
      .filter((a) => {
        if (a.employeeId !== employeeId) return false;
        if (month && !a.date.startsWith(month)) return false;
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createAttendanceRecord(record: InsertAttendanceRecord): Promise<AttendanceRecord> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const ar: AttendanceRecord = {
      id,
      ...record,
      createdAt: now,
    };
    this.attendance.set(id, ar);
    return ar;
  }

  async getLeaveRequests(employeeId?: string): Promise<LeaveRequest[]> {
    return Array.from(this.leaves.values())
      .filter((l) => !employeeId || l.employeeId === employeeId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createLeaveRequest(request: InsertLeaveRequest): Promise<LeaveRequest> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const lr: LeaveRequest = {
      id,
      ...request,
      status: "pending",
      createdAt: now,
    };
    this.leaves.set(id, lr);
    return lr;
  }

  async approveLeaveRequest(id: string, approvedBy: string): Promise<LeaveRequest | undefined> {
    const leave = this.leaves.get(id);
    if (!leave) return undefined;
    
    const updated: LeaveRequest = {
      ...leave,
      status: "approved",
      approvedBy,
      approvalDate: new Date().toISOString(),
    };
    this.leaves.set(id, updated);
    return updated;
  }

  async getPayrollRecords(employeeId?: string, month?: string): Promise<PayrollRecord[]> {
    return Array.from(this.payroll.values())
      .filter((p) => {
        if (employeeId && p.employeeId !== employeeId) return false;
        if (month && p.month !== month) return false;
        return true;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createPayrollRecord(record: InsertPayrollRecord): Promise<PayrollRecord> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const pr: PayrollRecord = {
      id,
      ...record,
      status: "pending",
      createdAt: now,
    };
    this.payroll.set(id, pr);
    return pr;
  }

  async getPerformanceReviews(employeeId?: string): Promise<PerformanceReview[]> {
    return Array.from(this.reviews.values())
      .filter((r) => !employeeId || r.employeeId === employeeId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createPerformanceReview(review: InsertPerformanceReview): Promise<PerformanceReview> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const pr: PerformanceReview = {
      id,
      ...review,
      status: "draft",
      createdAt: now,
    };
    this.reviews.set(id, pr);
    return pr;
  }

  async getShiftSchedules(employeeId?: string): Promise<ShiftSchedule[]> {
    return Array.from(this.shifts.values())
      .filter((s) => !employeeId || s.employeeId === employeeId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createShiftSchedule(schedule: InsertShiftSchedule): Promise<ShiftSchedule> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const ss: ShiftSchedule = {
      id,
      ...schedule,
      createdAt: now,
    };
    this.shifts.set(id, ss);
    return ss;
  }

  async getCertifications(employeeId?: string): Promise<Certification[]> {
    return Array.from(this.certifications.values())
      .filter((c) => !employeeId || c.employeeId === employeeId)
      .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
  }

  async createCertification(cert: InsertCertification): Promise<Certification> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const c: Certification = {
      id,
      ...cert,
      createdAt: now,
    };
    this.certifications.set(id, c);
    return c;
  }

  async getAssetAllocations(employeeId?: string): Promise<AssetAllocation[]> {
    return Array.from(this.assets.values())
      .filter((a) => !employeeId || a.employeeId === employeeId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createAssetAllocation(asset: InsertAssetAllocation): Promise<AssetAllocation> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const aa: AssetAllocation = {
      id,
      ...asset,
      createdAt: now,
    };
    this.assets.set(id, aa);
    return aa;
  }

  async getHRStats(): Promise<HRStats> {
    const allEmployees = Array.from(this.employees.values());
    const activeEmployees = allEmployees.filter((e) => e.status === "active");
    const onLeave = allEmployees.filter((e) => e.status === "on_leave");
    
    const totalAttendance = Array.from(this.attendance.values());
    const absences = totalAttendance.filter((a) => a.status === "absent").length;
    const absenceRate = totalAttendance.length > 0 
      ? (absences / totalAttendance.length) * 100 
      : 0;

    const departments: Record<string, number> = {};
    allEmployees.forEach((emp) => {
      departments[emp.department] = (departments[emp.department] || 0) + 1;
    });

    const pendingLeaves = Array.from(this.leaves.values())
      .filter((l) => l.status === "pending").length;

    const pendingPayroll = Array.from(this.payroll.values())
      .filter((p) => p.status === "pending").length;

    const today = new Date();
    const expiringCerts = Array.from(this.certifications.values())
      .filter((c) => {
        if (!c.expiryDate) return false;
        const expiry = new Date(c.expiryDate);
        const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
        return expiry <= thirtyDaysFromNow && expiry >= today;
      }).length;

    return {
      totalEmployees: allEmployees.length,
      activeEmployees: activeEmployees.length,
      onLeaveCount: onLeave.length,
      absenceRate: Math.round(absenceRate * 100) / 100,
      departmentBreakdown: departments,
      upcomingLeaveRequests: pendingLeaves,
      pendingPayroll,
      certificationsExpiring: expiringCerts,
    };
  }


