import express from "express";
import { verifyToken } from "../middleware/VerifyToken.js";
import { verifyAdmin } from "../middleware/VerifyToken.js";

import {
  addDoctorAndPatient,
  getDoctorAndPatient,
  getDoctorByPatient,
  getPatientByDoctor,
} from "./ApiFunctions/AssignedFunction.js";
const router = express.Router();


//assigning routes
router.post("/add-Doctor-and-Patient", verifyToken, addDoctorAndPatient);
router.get("/get-Doctor-and-Patient", verifyAdmin, getDoctorAndPatient);
//get all data by patient
router.get("/get-Patient-by-Doctor", verifyToken, getPatientByDoctor);
//get all data by doctor
router.get("/get-Doctor-by-Patient", verifyToken, getDoctorByPatient);



export default router;
