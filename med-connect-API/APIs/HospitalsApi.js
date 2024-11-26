import express from "express";
import { verifyAdmin } from "../middleware/VerifyToken.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import {
  getAllHospitals,
  getHospitalsById,
  getHospitalsByName,
  getHospitalsByAddress,
  addHospital,
  updateHospital,
  deleteHospital,
  getTreatmentsById,
  addUserTreatmentInHospital,
  getHospitalsByArray,
  getTreatmentsByArray,
} from "./ApiFunctions/HospitalsFunction.js";

const router = express.Router();

router.get("/hospitals", getAllHospitals);
router.get("/hospital/:hospital_id", getHospitalsById);
router.get("/hospitalInArray", getHospitalsByArray);
router.get("/treatment/:treatment_id", getTreatmentsById);
router.get("/treatmentInArray", getTreatmentsByArray);
router.get("/hospital-name/:hospital_name", getHospitalsByName);
router.get("/hospital-address/:hospital_address", getHospitalsByAddress);
router.post("/treatment/:treatment_id/hospital/:hospital_id", verifyToken, addUserTreatmentInHospital);

// Protected route
router.post("/hospital", verifyAdmin, addHospital);
router.put("/hospital/:hospital_id", verifyAdmin, updateHospital);
router.delete("/hospital/:hospital_id", verifyAdmin, deleteHospital);

export default router;
