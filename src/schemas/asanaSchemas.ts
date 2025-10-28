import { z } from "zod";

// Asana custom field value schemas
const AsanaEnumValueSchema = z.object({
  gid: z.string(),
  name: z.string(),
  enabled: z.boolean().optional(),
  color: z.string().optional(),
}).nullable();

const AsanaCustomFieldSchema = z.object({
  gid: z.string(),
  name: z.string(),
  resource_type: z.string().optional(),
  type: z.string().optional(),
  enum_value: AsanaEnumValueSchema.optional(),
  number_value: z.number().nullable().optional(),
  text_value: z.string().nullable().optional(),
});

// Asana user/assignee schema
const AsanaUserSchema = z.object({
  gid: z.string(),
  name: z.string(),
  resource_type: z.string().optional(),
}).nullable();

// Asana task schema
export const AsanaTaskSchema = z.object({
  gid: z.string(),
  name: z.string().default("Untitled Task"),
  created_at: z.string(),
  modified_at: z.string().optional(),
  completed_at: z.string().nullable().optional(),
  notes: z.string().default(""),
  assignee: AsanaUserSchema.optional(),
  custom_fields: z.array(AsanaCustomFieldSchema).default([]),
  resource_type: z.string().optional(),
});

// Asana API response schema
export const AsanaResponseSchema = z.object({
  data: z.array(AsanaTaskSchema),
  next_page: z
    .object({
      offset: z.string(),
      path: z.string(),
      uri: z.string(),
    })
    .nullable()
    .optional(),
});

// Type inference from schemas
export type AsanaTask = z.infer<typeof AsanaTaskSchema>;
export type AsanaResponse = z.infer<typeof AsanaResponseSchema>;
export type AsanaCustomField = z.infer<typeof AsanaCustomFieldSchema>;

// Validation helper with detailed error messages
export function validateAsanaResponse(data: unknown): AsanaResponse {
  try {
    return AsanaResponseSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => {
        return `${err.path.join(".")}: ${err.message}`;
      });
      throw new Error(
        `Invalid Asana API response: ${errorMessages.join(", ")}`
      );
    }
    throw error;
  }
}

// Safe validation that returns success/error
export function safeValidateAsanaResponse(data: unknown): {
  success: boolean;
  data?: AsanaResponse;
  error?: string;
} {
  const result = AsanaResponseSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    const errorMessages = result.error.errors.map((err) => {
      return `${err.path.join(".")}: ${err.message}`;
    });
    return {
      success: false,
      error: `Invalid Asana API response: ${errorMessages.join(", ")}`,
    };
  }
}
