import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User roles for the healthcare system
export type UserRole = "patient" | "doctor" | "nurse" | "admin";

// Users table - supports patients, doctors, nurses, and admins
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role").notNull().$type<UserRole>(),
  phone: text("phone"),
  dateOfBirth: text("date_of_birth"),
  gender: text("gender"),
  address: text("address"),
  avatarUrl: text("avatar_url"),
  specialty: text("specialty"), // For doctors
  licenseNumber: text("license_number"), // For doctors/nurses
  department: text("department"),
  isActive: boolean("is_active").default(true),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Appointments
export type AppointmentStatus = "scheduled" | "confirmed" | "in_progress" | "completed" | "cancelled" | "no_show";
export type AppointmentType = "in_person" | "virtual" | "follow_up" | "emergency";

export const appointments = pgTable("appointments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull(),
  doctorId: varchar("doctor_id").notNull(),
  dateTime: text("date_time").notNull(),
  endTime: text("end_time").notNull(),
  type: text("type").notNull().$type<AppointmentType>(),
  status: text("status").notNull().$type<AppointmentStatus>(),
  reason: text("reason"),
  notes: text("notes"),
  department: text("department"),
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({ id: true });
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;

// Health Records / Medical History
export const healthRecords = pgTable("health_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull(),
  recordType: text("record_type").notNull(), // diagnosis, condition, allergy, surgery, immunization
  title: text("title").notNull(),
  description: text("description"),
  date: text("date").notNull(),
  doctorId: varchar("doctor_id"),
  severity: text("severity"), // mild, moderate, severe
  status: text("status"), // active, resolved, chronic
});

export const insertHealthRecordSchema = createInsertSchema(healthRecords).omit({ id: true });
export type InsertHealthRecord = z.infer<typeof insertHealthRecordSchema>;
export type HealthRecord = typeof healthRecords.$inferSelect;

// Vital Signs
export const vitalSigns = pgTable("vital_signs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull(),
  recordedAt: text("recorded_at").notNull(),
  recordedBy: varchar("recorded_by"),
  bloodPressureSystolic: integer("blood_pressure_systolic"),
  bloodPressureDiastolic: integer("blood_pressure_diastolic"),
  heartRate: integer("heart_rate"),
  temperature: text("temperature"),
  respiratoryRate: integer("respiratory_rate"),
  oxygenSaturation: integer("oxygen_saturation"),
  weight: text("weight"),
  height: text("height"),
  notes: text("notes"),
});

export const insertVitalSignsSchema = createInsertSchema(vitalSigns).omit({ id: true });
export type InsertVitalSigns = z.infer<typeof insertVitalSignsSchema>;
export type VitalSigns = typeof vitalSigns.$inferSelect;

// Lab Results
export type LabResultStatus = "pending" | "in_progress" | "completed" | "reviewed";

export const labResults = pgTable("lab_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull(),
  testName: text("test_name").notNull(),
  testCode: text("test_code"),
  orderedBy: varchar("ordered_by"),
  orderedDate: text("ordered_date").notNull(),
  resultDate: text("result_date"),
  status: text("status").notNull().$type<LabResultStatus>(),
  result: text("result"),
  normalRange: text("normal_range"),
  unit: text("unit"),
  isAbnormal: boolean("is_abnormal").default(false),
  notes: text("notes"),
});

export const insertLabResultSchema = createInsertSchema(labResults).omit({ id: true });
export type InsertLabResult = z.infer<typeof insertLabResultSchema>;
export type LabResult = typeof labResults.$inferSelect;

// Prescriptions
export type PrescriptionStatus = "active" | "completed" | "cancelled" | "on_hold";

export const prescriptions = pgTable("prescriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull(),
  doctorId: varchar("doctor_id").notNull(),
  medicationName: text("medication_name").notNull(),
  dosage: text("dosage").notNull(),
  frequency: text("frequency").notNull(),
  route: text("route"), // oral, injection, topical, etc.
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  refillsRemaining: integer("refills_remaining").default(0),
  refillsTotal: integer("refills_total").default(0),
  status: text("status").notNull().$type<PrescriptionStatus>(),
  instructions: text("instructions"),
  pharmacy: text("pharmacy"),
  notes: text("notes"),
});

export const insertPrescriptionSchema = createInsertSchema(prescriptions).omit({ id: true });
export type InsertPrescription = z.infer<typeof insertPrescriptionSchema>;
export type Prescription = typeof prescriptions.$inferSelect;

// Messages / Secure Communication
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").notNull(),
  receiverId: varchar("receiver_id").notNull(),
  subject: text("subject"),
  content: text("content").notNull(),
  sentAt: text("sent_at").notNull(),
  readAt: text("read_at"),
  isRead: boolean("is_read").default(false),
  isArchived: boolean("is_archived").default(false),
  priority: text("priority").default("normal"), // low, normal, high, urgent
  attachments: text("attachments").array(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({ id: true });
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// Departments
export const departments = pgTable("departments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  headDoctorId: varchar("head_doctor_id"),
  location: text("location"),
  phone: text("phone"),
  isActive: boolean("is_active").default(true),
});

export const insertDepartmentSchema = createInsertSchema(departments).omit({ id: true });
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;
export type Department = typeof departments.$inferSelect;

// Analytics / Stats for Admin Dashboard
export interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  appointmentsToday: number;
  appointmentsThisWeek: number;
  pendingLabResults: number;
  activePrescriptions: number;
  unreadMessages: number;
  virtualCareSessions: number;
}

// Appointment with patient and doctor info
export interface AppointmentWithDetails extends Appointment {
  patient?: User;
  doctor?: User;
}

// Message with sender info
export interface MessageWithSender extends Message {
  sender?: User;
  receiver?: User;
}

// Prescription with doctor info
export interface PrescriptionWithDoctor extends Prescription {
  doctor?: User;
}

// Lab result with doctor info
export interface LabResultWithDoctor extends LabResult {
  orderedByDoctor?: User;
}
