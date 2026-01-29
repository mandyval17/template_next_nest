import { z } from 'zod';

/** POST /example body. Create example request. */
export const createExampleSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email'),
});
export type CreateExampleInput = z.infer<typeof createExampleSchema>;
export type ExampleFormData = CreateExampleInput;

/** Single example (API POST /example response, GET /examples item). */
export const exampleResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.string().datetime(),
});
export type ExampleResponse = z.infer<typeof exampleResponseSchema>;

/** GET /examples response. */
export const examplesListSchema = z.array(exampleResponseSchema);
export type ExamplesList = z.infer<typeof examplesListSchema>;
