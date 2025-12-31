import { z } from 'zod';

// User validation schemas
export const createUserSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase(),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['SENDER', 'RECEIVER', 'ADMIN']).default('SENDER')
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase(),
  password: z.string().min(1, 'Password is required')
});

export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().toLowerCase().optional(),
  role: z.enum(['SENDER', 'RECEIVER', 'ADMIN']).optional()
});

// Database query validation
export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format');

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc')
});

// Payment validation schemas
export const paymentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3, 'Currency must be 3 characters'),
  transactionId: z.string().min(1, 'Transaction ID is required'),
  userId: objectIdSchema,
  status: z.enum(['pending', 'completed', 'failed', 'refunded']).default('pending'),
  metadata: z.record(z.string(), z.string()).optional()
});

// Message validation schemas
export const createMessageSchema = z.object({
  senderId: objectIdSchema,
  receiverId: objectIdSchema,
  content: z.string().min(1, 'Content is required').max(5000, 'Content too long'),
  type: z.enum(['text', 'media', 'voice']).default('text'),
  metadata: z.record(z.string(), z.any()).optional()
});

// Memory validation schemas
export const memorySchema = z.object({
  type: z.enum(['image', 'video', 'audio', 'text']),
  content: z.string().min(1, 'Content is required'),
  caption: z.string().max(500).optional(),
  filename: z.string().optional(),
  userId: objectIdSchema
});

// Database connection validation
export const mongoConnectionSchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.number().int().min(1).max(65535).default(27017),
  database: z.string().min(1, 'Database name is required'),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  ssl: z.boolean().default(true),
  authSource: z.string().default('admin'),
  retryWrites: z.boolean().default(true)
});

// Export type definitions
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
export type CreateMessageInput = z.infer<typeof createMessageSchema>;
export type MemoryInput = z.infer<typeof memorySchema>;
export type MongoConnectionInput = z.infer<typeof mongoConnectionSchema>;

// Validation helper functions
export function validateObjectId(id: unknown): string {
  const result = objectIdSchema.safeParse(id);
  if (!result.success) {
    throw new Error(`Invalid ObjectId: ${result.error.issues[0].message}`);
  }
  return result.data;
}

export function validatePagination(params: unknown): PaginationInput {
  const result = paginationSchema.safeParse(params);
  if (!result.success) {
    throw new Error(`Invalid pagination: ${result.error.issues[0].message}`);
  }
  return result.data;
}

export function validateAndSanitizeInput<T>(schema: z.ZodSchema<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new Error(`Validation failed: ${result.error.issues.map((e: any) => e.message).join(', ')}`);
  }
  return result.data;
}