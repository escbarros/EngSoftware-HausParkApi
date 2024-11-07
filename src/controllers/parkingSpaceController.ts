import { Request, Response } from "express";
import ParkingSpace from "../models/parkingSpace";
import formatError from "../utils/responseErrorFormatter";

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
