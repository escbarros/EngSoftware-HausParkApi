import { z } from "zod";

export const parkingSpaceSchema = z.object({
  address: z
    .string({
      message: "Address is required",
    })
    .min(10, "Address should have at least 10 chars"),

  width: z
    .number({ message: "Width is required" })
    .min(1, "Width should be at least 1"),

  height: z
    .number({ message: "Height is required" })
    .min(1, "Height should be at least 1"),

  length: z
    .number({ message: "Length is required" })
    .min(1, "Length should be at least 1"),

  description: z
    .string({ message: "Description should be a string" })
    .optional(),

  price: z
    .number({ message: "Price is required" })
    .min(1, "Price should be at least 1"),

  number_of_cars: z
    .number({ message: "Number of cars should be a number" })
    .optional()
    .refine((val) => (val ?? 1) >= 1, {
      message: "Number of cars must be greater than 0",
    }),

  accepts_parlay: z
    .boolean({ message: "Accepts parlay should be a boolean" })
    .optional(),

  has_insurance: z
    .boolean({ message: "Has insurance should be a boolean" })
    .optional(),

  has_washing_service: z
    .boolean({ message: "Has washing service should be a boolean" })
    .optional(),

  has_overnight_service: z
    .boolean({ message: "Has overnight service should be a boolean" })
    .optional(),

  has_charging_service: z
    .boolean({ message: "Has charging service should be a boolean" })
    .optional(),
});

export type ParkingSpaceInput = z.infer<typeof parkingSpaceSchema>;
