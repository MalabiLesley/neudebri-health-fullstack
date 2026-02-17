import express from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middleware/auth";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", requireAuth, async (_req, res) => {
  const appts = await prisma.appointment.findMany({
    include: { patient: true, doctor: true },
    orderBy: { dateTime: "asc" },
  });
  res.json(appts);
});

export default router;