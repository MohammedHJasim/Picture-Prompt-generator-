export const STYLES = [
  "Realistic", "Cinematic", "Anime", "3D Render", "Illustration",
  "Watercolor", "Oil Painting", "Pixel Art", "Comic Book", "Fantasy Art",
  "Cyberpunk", "Steampunk", "Minimalist", "Surreal", "Pop Art",
] as const;

export const MOODS = [
  "Dramatic", "Calm", "Happy", "Dark", "Mysterious",
  "Romantic", "Energetic", "Melancholic", "Epic", "Cozy",
  "Ethereal", "Gritty",
] as const;

export const LIGHTINGS = [
  "Natural", "Golden Hour", "Neon", "Studio", "Moonlight",
  "Dramatic Shadows", "Soft Diffused", "Backlit", "Volumetric",
] as const;

export const COLOR_TONES = [
  "Warm", "Cool", "Monochrome", "Vibrant", "Pastel",
  "Muted", "High Contrast", "Sepia", "Neon",
] as const;

export const CAMERA_ANGLES = [
  "Close-up", "Wide Shot", "Bird's Eye", "Low Angle", "Eye Level",
  "Dutch Angle", "Over the Shoulder", "Macro", "Panoramic",
] as const;

export type PromptOptions = {
  description: string;
  style?: string;
  mood?: string;
  lighting?: string;
  colorTone?: string;
  cameraAngle?: string;
};
