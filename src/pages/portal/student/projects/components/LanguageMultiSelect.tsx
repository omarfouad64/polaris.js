import useAvailableProgrammingLanguages from '../../../../../hooks/useAvailableProgrammingLanguages';

interface LanguageMultiSelectProps {
  selectedLanguages: string[];
  onSelectLanguages: (languages: string[]) => void;
}

/**
 * LanguageMultiSelect — Multi-select chip picker for programming languages.
 *
 * @param selectedLanguages - Array of currently selected language names.
 * @param onSelectLanguages - Callback when language selection changes.
 */
export default function LanguageMultiSelect({
  selectedLanguages,
  onSelectLanguages,
}: LanguageMultiSelectProps) {
  const { languages } = useAvailableProgrammingLanguages();

  const handleToggleLanguage = (lang: string) => {
    if (selectedLanguages.includes(lang)) {
      onSelectLanguages(selectedLanguages.filter((l) => l !== lang));
    } else {
      onSelectLanguages([...selectedLanguages, lang]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-jakarta font-semibold uppercase tracking-widest text-on-surface mb-3">
        Programming Languages *
      </label>
      <div className="flex flex-wrap gap-2 p-4 bg-surface-container-low border border-outline-variant rounded-lg">
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => handleToggleLanguage(lang)}
            className={`text-sm font-jakarta font-semibold px-3 py-1.5 rounded-full transition-all duration-150 ${selectedLanguages.includes(lang)
                ? 'bg-primary text-on-primary'
                : 'bg-surface text-on-surface border border-outline-variant hover:bg-surface-container'
              }`}
          >
            {lang}
          </button>
        ))}
      </div>
      {selectedLanguages.length === 0 && (
        <p className="text-sm text-error mt-1 font-lexend">
          At least one language is required
        </p>
      )}
    </div>
  );
}
