import { Request, Response } from "express";
import User from "../models/user";
import {
  userSchema,
  userUpdateSchema,
  UserInput,
  UserUpdateInput,
} from "../schemas/userSchema";
import formatError from "../utils/responseErrorFormatter";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();

    res.status(200).json({ users });

    return;
  } catch (error) {
    res.status(500).json({
      error: formatError(error, "An error occurred while getting all users"),
    });

    return;
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      res.status(404);
      res.json({ error: formatError(null, "User was not found") });
      return;
    }
    res.status(200);
    res.json(user);
  } catch (error) {
    res.status(500);
    res.json({
      error: formatError(error, "An error occurred while searching for a user"),
    });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const validatedData: UserInput = userSchema.parse(req.body);
    const newUser = await User.create(validatedData);
    res.status(201);
    res.json(newUser);
  } catch (error) {
    res.status(400);
    res.json({
      error: formatError(error, "An error occurred while creating a user"),
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      res.status(404);
      res.json({ error: formatError(null, "User was not found") });
      return;
    }

    const validatedData: UserUpdateInput = userUpdateSchema.parse(req.body);
    await user.update(validatedData);
    res.status(200);
    res.json(user);
  } catch (error) {
    res.status(400);
    res.json({
      error: formatError(error, "An error occurred while updating a user"),
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      res.status(404);
      res.json({ error: formatError(null, "User was not found") });
      return;
    }
    await user.destroy();
    res.status(200);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500);
    res.json({
      error: formatError(error, "An error occurred while deleting a user"),
    });
  }
};
