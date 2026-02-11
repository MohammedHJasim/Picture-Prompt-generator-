import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Wand2, ChevronDown, ChevronUp, LogOut } from "lucide-react";
import { usePromptForge } from "@/hooks/usePromptForge";
import { useAuth } from "@/hooks/useAuth";
import { OptionSection } from "@/components/OptionSection";
import { PromptDisplay } from "@/components/PromptDisplay";
import { ImageResult } from "@/components/ImageResult";
import {
  STYLES, MOODS, LIGHTINGS, COLOR_TONES, CAMERA_ANGLES,
} from "@/lib/prompt-options";

const Index = () => {
  const navigate = useNavigate();
  const { user, isAuthorized, loading: authLoading, signOut } = useAuth();
  const [description, setDescription] = useState("");
  const [style, setStyle] = useState("");
  const [mood, setMood] = useState("");
  const [lighting, setLighting] = useState("");
  const [colorTone, setColorTone] = useState("");
  const [cameraAngle, setCameraAngle] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    generatedPrompt,
    generatedImage,
    isGeneratingPrompt,
    isGeneratingImage,
    isLoading,
    generateAll,
    generateImage,
    setGeneratedPrompt,
  } = usePromptForge();

  // Redirect to login if not authenticated or not authorized
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/login", { replace: true });
      } else if (!isAuthorized) {
        signOut();
        navigate("/login", { replace: true });
      }
    }
  }, [user, isAuthorized, authLoading, navigate, signOut]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-atmosphere flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const handleGenerate = () => {
    generateAll({ description, style, mood, lighting, colorTone, cameraAngle });
  };

  const handleRegenerateImage = () => {
    if (generatedPrompt) generateImage(generatedPrompt);
  };

  return (
    <div className="min-h-screen bg-atmosphere">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-20 bg-background/80">
        <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <h1 className="text-lg font-bold">
            <span className="gradient-text">PromptForge</span>
          </h1>
          <div className="ml-auto">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border border-border/50 hover:bg-secondary/50 transition-all text-foreground"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Hero */}
        <section className="text-center space-y-3 py-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Describe it simply.{" "}
            <span className="gradient-text">Get stunning images.</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Write what you imagine, pick a style, and let AI craft the perfect prompt & image for you.
          </p>
        </section>

        {/* Input */}
        <div className="glass rounded-xl p-5 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              What do you want to create?
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A warrior standing on a cliff overlooking a burning city at sunset..."
              rows={3}
              className="w-full bg-background/50 rounded-lg p-4 text-foreground border border-border/50 resize-none focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground/50"
            />
          </div>

          <OptionSection title="Style" options={STYLES} selected={style} onSelect={setStyle} />
          <OptionSection title="Mood" options={MOODS} selected={mood} onSelect={setMood} />

          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Advanced Options
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showAdvanced && (
            <div className="space-y-5 animate-in slide-in-from-top-2 duration-200">
              <OptionSection title="Lighting" options={LIGHTINGS} selected={lighting} onSelect={setLighting} />
              <OptionSection title="Color Tone" options={COLOR_TONES} selected={colorTone} onSelect={setColorTone} />
              <OptionSection title="Camera Angle" options={CAMERA_ANGLES} selected={cameraAngle} onSelect={setCameraAngle} />
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isLoading || !description.trim()}
            className="w-full py-3 rounded-xl font-semibold text-primary-foreground bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 glow-border"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                {isGeneratingPrompt ? "Crafting prompt..." : "Generating image..."}
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Generate
              </>
            )}
          </button>
        </div>

        {/* Image result */}
        <ImageResult
          imageUrl={generatedImage}
          isLoading={isGeneratingImage}
        />

        {/* Editable prompt - shown after image is generated */}
        {(generatedImage || isGeneratingImage) && (
          <>
            <PromptDisplay
              prompt={generatedPrompt}
              isLoading={isGeneratingPrompt}
              onEdit={setGeneratedPrompt}
            />

            {generatedPrompt && !isGeneratingPrompt && (
              <button
                onClick={handleRegenerateImage}
                disabled={isGeneratingImage}
                className="w-full py-2.5 rounded-xl font-medium border border-primary/30 text-primary hover:bg-primary/10 disabled:opacity-40 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {isGeneratingImage ? "Generating..." : "Regenerate Image"}
              </button>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
