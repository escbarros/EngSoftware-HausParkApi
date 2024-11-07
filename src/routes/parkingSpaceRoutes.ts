import { getAllParkingSpaces } from "../controllers/parkingSpaceController";
import { Router } from "express";
const router = Router();

router.get("/", getAllParkingSpaces);

export default router;
