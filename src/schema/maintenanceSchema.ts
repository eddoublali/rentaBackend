import { z } from 'zod'


export const MaintenanceTypeEnum = z.enum([
  'OIL_CHANGE',
  'TIMING_CHAIN',
  'WASHING',
  'BRAKE_CHANGE',
  'BATTERY_CHECK',
  'GENERAL_SERVICE',
  'OTHER',
])

export const StatusMaintenanceEnum = z.enum([
  'PENDING',
  'COMPLETED',
])

export const maintenanceSchema = z.object({
  vehicleId: z.number().int().positive({ message: "Vehicle ID is required" }),

  currentMileage: z.number().int().nonnegative().optional(),
  nextOilChange: z.number().int().nonnegative().optional(),

  status: StatusMaintenanceEnum,

  amount: z.number().positive({ message: "Amount must be a positive number" }),

  maintenance: MaintenanceTypeEnum,

  date: z.coerce.date(), // Accepts string or Date

  
})

// Partial version for updates
export const maintenanceUpdateSchema = maintenanceSchema.partial()
