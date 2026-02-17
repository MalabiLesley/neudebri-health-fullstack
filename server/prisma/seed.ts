import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const pw = await bcrypt.hash("password", 10);
  await prisma.user.upsert({
    where: { email: "admin@local" },
    update: {},
    create: { email: "admin@local", password: pw, firstName: "Admin", lastName: "User", role: "admin" },
  });

  const patient = await prisma.patient.create({
    data: { firstName: "John", lastName: "Doe", phone: "0700123456" },
  });

  const doctor = await prisma.doctor.create({
    data: { firstName: "Jane", lastName: "Smith", department: "General" },
  });

  await prisma.appointment.create({
    data: {
      dateTime: new Date().toISOString(),
      status: "scheduled",
      department: "General",
      patientId: patient.id,
      doctorId: doctor.id,
    },
  });

  console.log("Seed complete");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });