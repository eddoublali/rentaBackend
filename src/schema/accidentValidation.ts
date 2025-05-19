import { z } from "zod";

export const FaultTypeEnum = z.enum(["CLIENT", "THIRD_PARTY", "UNKNOWN"]);
export type FaultType = z.infer<typeof FaultTypeEnum>;

export const AccidentStatusEnum = z.enum(["REPORTED", "IN_PROGRESS", "REPAIRED", "CLOSED"]);
export type AccidentStatus = z.infer<typeof AccidentStatusEnum>;

export const accidentSchema = z.object({
  vehicleId: z.coerce.number().int().positive("Vehicle ID must be a positive integer"),
  clientId: z.coerce.number().int().positive("Client ID must be a positive integer").nullable().optional(),

  accidentDate: z
  .string()
  .datetime()
  .transform(str => new Date(str)), 
  location: z.string().min(1, "Location is required"),
  description: z.string().optional(),
  repairCost: z.coerce.number().nonnegative("Repair cost must be zero or positive").optional(),
  fault: FaultTypeEnum.default("UNKNOWN"),
  
  // This can be a JSON string of photo paths or an array that will be stringified
  damagePhotos: z.union([
    z.string(),
    z.array(z.string())
  ]).optional().nullable(), 
  
  status: AccidentStatusEnum.default("REPORTED"),


});

// For updates, all fields are optional
export const accidentUpdateSchema = accidentSchema.partial();

// TypeScript type for Accident model
export type Accident = z.infer<typeof accidentSchema> & {
  id: number;
};