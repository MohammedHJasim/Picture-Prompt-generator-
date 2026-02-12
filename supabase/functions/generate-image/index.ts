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
    const { prompt } = await req.json();

    // Defensive input validation
    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Prompt is required and cannot be empty" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const trimmedPrompt = prompt.trim();

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

    // Using stable gemini-2.5-flash-image model for image generation
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${GEMINI_API_KEY}`,
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
                  text: trimmedPrompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            responseModalities: ["image", "text"],
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
        JSON.stringify({ error: "Failed to generate image. Please try again." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();

    // Extract image from Gemini response
    // Gemini returns images as inline data (base64) in parts
    const parts = data.candidates?.[0]?.content?.parts || [];

    let imageUrl = null;
    let textContent = null;

    for (const part of parts) {
      if (part.inlineData) {
        // Convert base64 to data URL
        const { mimeType, data: imageData } = part.inlineData;
        imageUrl = `data:${mimeType};base64,${imageData}`;
      } else if (part.text) {
        textContent = part.text;
      }
    }

    if (!imageUrl) {
      console.error("No image in Gemini response:", JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: "Failed to generate image. Please try again." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ imageUrl, text: textContent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-image error:", e);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
