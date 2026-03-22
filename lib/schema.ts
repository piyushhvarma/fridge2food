import { z } from "zod";

export const recipeSchema = z.object({
  dishName: z
    .string()
    .describe("The name of the dish to be prepared"),
  ingredientsUsed: z
    .array(z.string())
    .describe("List of exact ingredients used from the user's input, plus basic staples like salt or oil"),
  steps: z
    .array(z.string())
    .describe("Short, simple, practical step-by-step cooking instructions"),
  tip: z
    .string()
    .optional()
    .describe("An optional quick tip or trick for the recipe"),
});

export type Recipe = z.infer<typeof recipeSchema>;
