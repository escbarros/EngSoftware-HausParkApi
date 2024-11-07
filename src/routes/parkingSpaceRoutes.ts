import {
  createParkingSpace,
  getAllParkingSpaces,
} from "../controllers/parkingSpaceController";
import { Router } from "express";
const router = Router();

router.get("/", getAllParkingSpaces);
router.post("/:hostId", createParkingSpace);

export default router;
