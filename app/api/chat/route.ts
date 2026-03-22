import { streamText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { recipeSchema } from '@/lib/schema';

// Allow responses to stream for up to 60 seconds
export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-4o-mini') as any,
    system: `You are 'fridge2food', a helpful pixel-art themed cooking assistant.

    User will give a list of ingredients.
    Your job:
    1. Suggest 1-2 dishes they can make conversationally, then provide exactly one full structured recipe using the 'provide_recipe' tool.
    2. ALWAYS use well-known, recognized real-world names for dishes (like "Paneer Tikka", "Chilli Chicken", "Shakshuka", "Fried Rice") instead of random or generic AI-generated names (like "Leftover Surprise"). Match the ingredients to the closest authentic dish possible.
    3. Keep the recipe simple and practical (step-by-step).
    4. Use ONLY the given ingredients (you can add common basics like salt, oil, basic spices).
    
    CRITICAL INSTRUCTIONS:
    1. If the user provides ingredients or explicitly asks for a recipe, ALWAYS use the 'provide_recipe' tool to formally generate the structured recipe UI.
    2. NEVER write the actual recipe steps in plain markdown text. The recipe must ONLY be rendered via the 'provide_recipe' tool.`,
    messages,
    tools: {
      provide_recipe: tool({
        description: 'Call this tool when you need to formally generate and present a structured recipe to the user.',
        parameters: recipeSchema,
        execute: async (recipe) => {
          // Returning the recipe directly maps it to toolInvocation.result on the client
          return recipe;
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
