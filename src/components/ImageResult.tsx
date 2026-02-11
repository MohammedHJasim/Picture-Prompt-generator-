interface ImageResultProps {
  imageUrl: string;
  isLoading: boolean;
}

export function ImageResult({ imageUrl, isLoading }: ImageResultProps) {
  if (!imageUrl && !isLoading) return null;

  return (
    <div className="glass rounded-xl p-4 space-y-3">
      <label className="text-sm font-medium text-primary uppercase tracking-wider">
        Generated Image
      </label>
      {isLoading ? (
        <div className="aspect-square max-w-lg mx-auto rounded-lg bg-secondary/50 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground">Generating your image...</p>
          </div>
        </div>
      ) : (
        <div className="relative group">
          <img
            src={imageUrl}
            alt="AI Generated"
            className="w-full max-w-lg mx-auto rounded-lg"
          />
          <a
            href={imageUrl}
            download="promptforge-image.png"
            className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg text-xs font-medium bg-background/80 backdrop-blur border border-border text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Download
          </a>
        </div>
      )}
    </div>
  );
}
