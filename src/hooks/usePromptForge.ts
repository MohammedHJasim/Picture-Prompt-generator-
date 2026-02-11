import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { PromptOptions } from "@/lib/prompt-options";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export function usePromptForge() {
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [lastOptions, setLastOptions] = useState<PromptOptions | null>(null);

  const generatePrompt = async (options: PromptOptions) => {
    if (!options.description.trim()) {
      toast.error("Please enter a description first");
      return null;
    }
    setLastOptions(options);
    setIsGeneratingPrompt(true);
    try {
      const resp = await fetch(`${SUPABASE_URL}/functions/v1/generate-prompt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify(options),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Failed to generate prompt");
      setGeneratedPrompt(data.prompt);
      return data.prompt;
    } catch (e: any) {
      toast.error(e.message);
      return null;
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  const generateImage = async (prompt: string) => {
    if (!prompt.trim()) {
      toast.error("Generate a prompt first");
      return;
    }
    setIsGeneratingImage(true);
    try {
      const resp = await fetch(`${SUPABASE_URL}/functions/v1/generate-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Failed to generate image");
      setGeneratedImage(data.imageUrl);

      // Save to history if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Upload base64 image to storage for persistent URL
        let persistentUrl = data.imageUrl;
        if (data.imageUrl?.startsWith("data:")) {
          try {
            const base64Data = data.imageUrl.split(",")[1];
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: "image/png" });
            const fileName = `${user.id}/${Date.now()}.png`;

            const { data: uploadData, error: uploadError } = await supabase.storage
              .from("generated-images")
              .upload(fileName, blob, { contentType: "image/png" });

            if (!uploadError && uploadData) {
              const { data: urlData } = supabase.storage
                .from("generated-images")
                .getPublicUrl(uploadData.path);
              persistentUrl = urlData.publicUrl;
            }
          } catch {
            // Fallback: store without persistent image
          }
        }

        await supabase.from("generations").insert({
          user_id: user.id,
          description: lastOptions?.description || "",
          prompt,
          image_url: persistentUrl,
          style: lastOptions?.style || null,
          mood: lastOptions?.mood || null,
        });
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const generateAll = async (options: PromptOptions) => {
    const prompt = await generatePrompt(options);
    if (prompt) {
      await generateImage(prompt);
    }
  };

  const loadGeneration = (gen: { prompt: string; image_url: string | null }) => {
    setGeneratedPrompt(gen.prompt);
    setGeneratedImage(gen.image_url || "");
  };

  return {
    generatedPrompt,
    generatedImage,
    isGeneratingPrompt,
    isGeneratingImage,
    isLoading: isGeneratingPrompt || isGeneratingImage,
    generatePrompt,
    generateImage,
    generateAll,
    setGeneratedPrompt,
    loadGeneration,
  };
}
