import { Request, Response } from "express";
import ParkingSpace from "../models/parkingSpace";
import formatError from "../utils/responseErrorFormatter";
import {
  ParkingSpaceInput,
  parkingSpaceSchema,
} from "../schemas/parkingSpaceSchema";
import User from "../models/user";

export const getAllParkingSpaces = async (req: Request, res: Response) => {
  try {
    const parkingSpaces = await ParkingSpace.findAll();

    res.status(200).json({ parkingSpaces });

    return;
  } catch (error) {
    res.status(500).json({
      error: formatError(
        error,
        "An error occurred while getting all parking spaces"
      ),
    });

    return;
  }
};

export const createParkingSpace = async (req: Request, res: Response) => {
  try {
    const { hostId } = req.params;
    const validatedData: ParkingSpaceInput = parkingSpaceSchema.parse(req.body);

    const user = await User.findByPk(hostId);
    if (!user) {
      res.status(404);
      res.json({ error: formatError(null, "Host/User was not found") });
      return;
    }

    const newParkingSpace = await ParkingSpace.create({
      ...validatedData,
      hostId: parseInt(hostId),
    });

    res.status(201);
    res.json(newParkingSpace);
  } catch (error) {
    res.status(400);
    res.json({
      error: formatError(error, "An error occurred while searching for a user"),
    });
  }
};
