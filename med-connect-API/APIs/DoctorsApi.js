import express from "express";
import { verifyAdmin } from "../middleware/VerifyToken.js";
import { verifyToken } from "../middleware/VerifyToken.js";

import {getAllDoctors,getdoctorById ,updateDoctor,updateDoctorByAdmin,deleteDoctor,deleteDoctorByAdmin ,addAppointment} from "./ApiFunctions/DoctorsFunction.js";

const router = express.Router();

router.get("/doctors", getAllDoctors);
router.get("/doctors/:id",  getdoctorById);
router.post("/docAppointment/:doctor_id",verifyToken, addAppointment);

router.put("/doctors/:id", verifyToken, updateDoctor);
router.put("/admin-doctors/:id", verifyAdmin, updateDoctorByAdmin);

router.delete("/doctors/:id", verifyToken, deleteDoctor);
router.delete("/admin-doctors/:id", verifyAdmin, deleteDoctorByAdmin);

export default router;