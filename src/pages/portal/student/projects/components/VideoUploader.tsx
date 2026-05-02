interface VideoUploaderProps {
  videoUrl?: string;
  onVideoUrlChange: (url: string) => void;
  onRemove: () => void;
}

/**
 * VideoUploader — Input field for demo video URL with preview capability.
 *
 * @param videoUrl - Current video URL value.
 * @param onVideoUrlChange - Callback when video URL changes.
 * @param onRemove - Callback when video URL is removed.
 */
export default function VideoUploader({
  videoUrl,
  onVideoUrlChange,
  onRemove,
}: VideoUploaderProps) {
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onVideoUrlChange(e.target.value);
  };

  return (
    <div>
      <label className="block text-sm font-jakarta font-semibold uppercase tracking-widest text-on-surface mb-2">
        Demo Video URL
      </label>
      <p className="text-xs font-lexend text-on-surface-variant mb-3">
        Paste a link to your demo video (YouTube, Vimeo, or direct video URL). Optional.
      </p>
      <div className="flex gap-2">
        <input
          type="url"
          value={videoUrl || ''}
          onChange={handleChange}
          placeholder="https://www.youtube.com/embed/..."
          className="flex-1 bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 text-base font-lexend text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-colors duration-150"
        />
        {videoUrl && (
          <button
            onClick={onRemove}
            type="button"
            className="px-4 py-3 rounded-lg border border-error text-error hover:bg-error/10 transition-colors duration-150 font-jakarta font-semibold text-sm"
          >
            Remove
          </button>
        )}
      </div>
      {videoUrl && !isValidUrl(videoUrl) && (
        <p className="text-sm text-error mt-1 font-lexend">Invalid URL format</p>
      )}
    </div>
  );
}
