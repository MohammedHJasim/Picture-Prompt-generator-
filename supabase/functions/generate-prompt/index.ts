import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { description, style, mood, lighting, colorTone, cameraAngle } = await req.json();

    // Defensive input validation
    if (!description || typeof description !== "string" || description.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Description is required and cannot be empty" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const descriptionTrimmed = description.trim();

    // Validate parameter types
    if (style && typeof style !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid style parameter" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get API key from environment variable (server-side only, never exposed to frontend)
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not configured in Supabase Edge Functions");
      return new Response(
        JSON.stringify({ error: "Service configuration error. Please contact support." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const systemPrompt = `You are an expert image prompt engineer. Your job is to take a simple user description and transform it into a detailed, professional image generation prompt.

You MUST output ONLY the final prompt text. No explanations, no labels, no markdown.

Structure your prompt with these elements:
1. Subject & composition (what's in the scene, positioning)
2. Style & medium (the artistic style requested)
3. Mood & atmosphere (emotional tone)
4. Lighting (type and direction of light)
5. Color palette (dominant colors and tones)
6. Camera/perspective (angle, lens type, depth of field)
7. Quality keywords (e.g., "highly detailed", "8K", "masterpiece")

Combine everything into one flowing, comma-separated prompt paragraph.`;

    const userMessage = `Description: ${descriptionTrimmed}
${style ? `Style: ${style}` : ""}
${mood ? `Mood: ${mood}` : ""}
${lighting ? `Lighting: ${lighting}` : ""}
${colorTone ? `Color tone: ${colorTone}` : ""}
${cameraAngle ? `Camera angle: ${cameraAngle}` : ""}

Generate a detailed image generation prompt based on the above.`;

    // Combine system prompt and user message for Gemini API
    const fullPrompt = `${systemPrompt}\n\n${userMessage}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: fullPrompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      if (response.status === 401 || response.status === 403) {
        console.error("Gemini API authentication error:", response.status, errorData);
        return new Response(
          JSON.stringify({ error: "Service authentication failed. Please contact support." }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      if (response.status >= 500) {
        console.error("Gemini API service error:", response.status, errorData);
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          {
            status: 503,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      console.error("Gemini API error:", response.status, errorData);
      return new Response(
        JSON.stringify({ error: "Failed to generate prompt. Please try again." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();

    // Extract the generated text from Gemini response
    const generatedPrompt = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!generatedPrompt) {
      console.error("Empty response from Gemini API:", JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: "Failed to generate prompt. Please try again." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ prompt: generatedPrompt }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-prompt error:", e);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
