import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Auth routes - Demo user switching
  app.get("/api/auth/demo/:role", async (req, res) => {
    const role = req.params.role;
    let username = "patient";
    if (role === "doctor") username = "doctor";
    if (role === "admin") username = "admin";
    
    const user = await storage.getUserByUsername(username);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  });

  app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await storage.getUserByUsername(username);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.json({ user });
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    const userId = (req.query.userId as string) || "patient-001";
    const role = (req.query.role as string) || "patient";
    const stats = await storage.getDashboardStats(userId, role);
    res.json(stats);
  });

  // Users routes
  app.get("/api/users/patients", async (req, res) => {
    const patients = await storage.getAllPatients();
    res.json(patients);
  });

  app.get("/api/users/doctors", async (req, res) => {
    const doctors = await storage.getAllDoctors();
    res.json(doctors);
  });

  app.get("/api/users/contacts", async (req, res) => {
    const userId = (req.query.userId as string) || "patient-001";
    const role = (req.query.role as string) || "patient";
    const contacts = await storage.getContacts(userId, role);
    res.json(contacts);
  });

  // Appointments routes
  app.get("/api/appointments", async (req, res) => {
    const userId = (req.query.userId as string) || "patient-001";
    const role = (req.query.role as string) || "patient";
    const appointments = await storage.getAppointments(userId, role);
    res.json(appointments);
  });

  app.get("/api/appointments/upcoming", async (req, res) => {
    const userId = (req.query.userId as string) || "patient-001";
    const role = (req.query.role as string) || "patient";
    const appointments = await storage.getUpcomingAppointments(userId, role);
    res.json(appointments);
  });

  app.get("/api/appointments/virtual", async (req, res) => {
    const userId = (req.query.userId as string) || "patient-001";
    const role = (req.query.role as string) || "patient";
    const appointments = await storage.getVirtualAppointments(userId, role);
    res.json(appointments);
  });

  app.post("/api/appointments", async (req, res) => {
    try {
      const appointment = await storage.createAppointment(req.body);
      res.status(201).json(appointment);
    } catch (error) {
      res.status(400).json({ message: "Failed to create appointment" });
    }
  });

  app.patch("/api/appointments/:id/cancel", async (req, res) => {
    const appointment = await storage.updateAppointmentStatus(req.params.id, "cancelled");
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json(appointment);
  });

  // Health Records routes
  app.get("/api/health-records", async (req, res) => {
    const patientId = (req.query.patientId as string) || "patient-001";
    const records = await storage.getHealthRecords(patientId);
    res.json(records);
  });

  app.post("/api/health-records", async (req, res) => {
    try {
      const record = await storage.createHealthRecord(req.body);
      res.status(201).json(record);
    } catch (error) {
      res.status(400).json({ message: "Failed to create health record" });
    }
  });

  // Vital Signs routes
  app.get("/api/vital-signs", async (req, res) => {
    const patientId = (req.query.patientId as string) || "patient-001";
    const vitals = await storage.getVitalSigns(patientId);
    res.json(vitals);
  });

  app.post("/api/vital-signs", async (req, res) => {
    try {
      const vitals = await storage.createVitalSigns(req.body);
      res.status(201).json(vitals);
    } catch (error) {
      res.status(400).json({ message: "Failed to create vital signs" });
    }
  });

  // Lab Results routes
  app.get("/api/lab-results", async (req, res) => {
    const patientId = (req.query.patientId as string) || "patient-001";
    const results = await storage.getLabResults(patientId);
    res.json(results);
  });

  app.post("/api/lab-results", async (req, res) => {
    try {
      const result = await storage.createLabResult(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: "Failed to create lab result" });
    }
  });

  // Prescriptions routes
  app.get("/api/prescriptions", async (req, res) => {
    const userId = (req.query.userId as string) || "patient-001";
    const role = (req.query.role as string) || "patient";
    const prescriptions = await storage.getPrescriptions(userId, role);
    res.json(prescriptions);
  });

  app.post("/api/prescriptions", async (req, res) => {
    try {
      const prescription = await storage.createPrescription(req.body);
      res.status(201).json(prescription);
    } catch (error) {
      res.status(400).json({ message: "Failed to create prescription" });
    }
  });

  app.post("/api/prescriptions/:id/refill", async (req, res) => {
    res.json({ message: "Refill request submitted successfully" });
  });

  // Messages routes
  app.get("/api/messages", async (req, res) => {
    const userId = (req.query.userId as string) || "patient-001";
    const messages = await storage.getMessages(userId);
    res.json(messages);
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const message = await storage.createMessage(req.body);
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ message: "Failed to send message" });
    }
  });

  app.patch("/api/messages/:id/read", async (req, res) => {
    const message = await storage.markMessageAsRead(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.json(message);
  });

  // Departments routes
  app.get("/api/departments", async (req, res) => {
    const departments = await storage.getDepartments();
    res.json(departments);
  });

  app.post("/api/departments", async (req, res) => {
    try {
      const department = await storage.createDepartment(req.body);
      res.status(201).json(department);
    } catch (error) {
      res.status(400).json({ message: "Failed to create department" });
    }
  });

  // Wound care routes
  app.get("/api/wound-care", async (req, res) => {
    const patientId = (req.query.patientId as string) || "patient-001";
    const records = await storage.getWoundRecords(patientId);
    res.json(records);
  });

  app.post("/api/wound-care", async (req, res) => {
    try {
      const record = await storage.createWoundRecord(req.body);
      res.status(201).json(record);
    } catch (error) {
      res.status(400).json({ message: "Failed to create wound record" });
    }
  });

  // Nurses
  app.get("/api/nurses", async (_req, res) => {
    const nurses = await storage.getNurses();
    res.json(nurses);
  });

  // Finance / Billing
  app.get("/api/finance/billing", async (req, res) => {
    const patientId = (req.query.patientId as string) || "patient-001";
    const bills = await storage.getBillingForPatient(patientId);
    res.json(bills);
  });

  app.post("/api/finance/billing", async (req, res) => {
    try {
      const bill = await storage.createBillingRecord(req.body);
      res.status(201).json(bill);
    } catch (error) {
      res.status(400).json({ message: "Failed to create billing record" });
    }
  });

  app.get("/api/finance/insurances", async (_req, res) => {
    const providers = await storage.getInsuranceProviders();
    res.json(providers);
  });

  app.post("/api/finance/payments", async (req, res) => {
    try {
      const payment = await storage.createPayment(req.body);
      res.status(201).json(payment);
    } catch (error) {
      res.status(400).json({ message: "Failed to create payment" });
    }
  });

  // HR Management Routes
  app.get("/api/hr/employees", async (req, res) => {
    const employees = await storage.getEmployees();
    res.json(employees);
  });

  app.get("/api/hr/employees/:id", async (req, res) => {
    const employee = await storage.getEmployeeById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(employee);
  });

  app.post("/api/hr/employees", async (req, res) => {
    try {
      const employee = await storage.createEmployee(req.body);
      res.status(201).json(employee);
    } catch (error) {
      res.status(400).json({ message: "Failed to create employee record" });
    }
  });

  app.patch("/api/hr/employees/:id", async (req, res) => {
    try {
      const employee = await storage.updateEmployee(req.params.id, req.body);
      res.json(employee);
    } catch (error) {
      res.status(400).json({ message: "Failed to update employee" });
    }
  });

  // Attendance routes
  app.get("/api/hr/attendance", async (req, res) => {
    const employeeId = req.query.employeeId as string;
    const month = req.query.month as string;
    const records = await storage.getAttendanceRecords(employeeId, month);
    res.json(records);
  });

  app.post("/api/hr/attendance", async (req, res) => {
    try {
      const record = await storage.createAttendanceRecord(req.body);
      res.status(201).json(record);
    } catch (error) {
      res.status(400).json({ message: "Failed to create attendance record" });
    }
  });

  // Leave request routes
  app.get("/api/hr/leaves", async (req, res) => {
    const employeeId = req.query.employeeId as string;
    const leaves = await storage.getLeaveRequests(employeeId);
    res.json(leaves);
  });

  app.post("/api/hr/leaves", async (req, res) => {
    try {
      const leave = await storage.createLeaveRequest(req.body);
      res.status(201).json(leave);
    } catch (error) {
      res.status(400).json({ message: "Failed to create leave request" });
    }
  });

  app.patch("/api/hr/leaves/:id/approve", async (req, res) => {
    try {
      const leave = await storage.approveLeaveRequest(req.params.id, req.body.approvedBy);
      res.json(leave);
    } catch (error) {
      res.status(400).json({ message: "Failed to approve leave request" });
    }
  });

  // Payroll routes
  app.get("/api/hr/payroll", async (req, res) => {
    const employeeId = req.query.employeeId as string;
    const month = req.query.month as string;
    const records = await storage.getPayrollRecords(employeeId, month);
    res.json(records);
  });

  app.post("/api/hr/payroll", async (req, res) => {
    try {
      const record = await storage.createPayrollRecord(req.body);
      res.status(201).json(record);
    } catch (error) {
      res.status(400).json({ message: "Failed to create payroll record" });
    }
  });

  // Performance review routes
  app.get("/api/hr/performance-reviews", async (req, res) => {
    const employeeId = req.query.employeeId as string;
    const reviews = await storage.getPerformanceReviews(employeeId);
    res.json(reviews);
  });

  app.post("/api/hr/performance-reviews", async (req, res) => {
    try {
      const review = await storage.createPerformanceReview(req.body);
      res.status(201).json(review);
    } catch (error) {
      res.status(400).json({ message: "Failed to create performance review" });
    }
  });

  // Shift schedule routes
  app.get("/api/hr/shifts", async (req, res) => {
    const employeeId = req.query.employeeId as string;
    const shifts = await storage.getShiftSchedules(employeeId);
    res.json(shifts);
  });

  app.post("/api/hr/shifts", async (req, res) => {
    try {
      const shift = await storage.createShiftSchedule(req.body);
      res.status(201).json(shift);
    } catch (error) {
      res.status(400).json({ message: "Failed to create shift schedule" });
    }
  });

  // Certifications routes
  app.get("/api/hr/certifications", async (req, res) => {
    const employeeId = req.query.employeeId as string;
    const certs = await storage.getCertifications(employeeId);
    res.json(certs);
  });

  app.post("/api/hr/certifications", async (req, res) => {
    try {
      const cert = await storage.createCertification(req.body);
      res.status(201).json(cert);
    } catch (error) {
      res.status(400).json({ message: "Failed to add certification" });
    }
  });

  // Assets routes
  app.get("/api/hr/assets", async (req, res) => {
    const employeeId = req.query.employeeId as string;
    const assets = await storage.getAssetAllocations(employeeId);
    res.json(assets);
  });

  app.post("/api/hr/assets", async (req, res) => {
    try {
      const asset = await storage.createAssetAllocation(req.body);
      res.status(201).json(asset);
    } catch (error) {
      res.status(400).json({ message: "Failed to allocate asset" });
    }
  });

  // HR Dashboard stats
  app.get("/api/hr/stats", async (req, res) => {
    const stats = await storage.getHRStats();
    res.json(stats);
  });

  return httpServer;
}
