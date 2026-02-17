import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, firstName, lastName, role = "clinician" } = req.body;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ message: "Email exists" });
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, password: hash, firstName, lastName, role } });
  res.json({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });
  const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "8h" });
  res.json({ token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } });
});

export default router;