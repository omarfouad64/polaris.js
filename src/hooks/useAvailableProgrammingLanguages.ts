import { useState } from 'react';

const AVAILABLE_LANGUAGES = [
  'TypeScript',
  'JavaScript',
  'Python',
  'Java',
  'C++',
  'C#',
  'PHP',
  'Ruby',
  'Go',
  'Rust',
  'React',
  'Vue.js',
  'Angular',
  'Node.js',
  'Django',
  'Flask',
  'Spring Boot',
  'MongoDB',
  'PostgreSQL',
  'MySQL',
];

/**
 * useAvailableProgrammingLanguages — Provides a global list of programming languages
 * for project language selection.
 *
 * @returns List of available programming languages.
 */
export default function useAvailableProgrammingLanguages() {
  const [languages] = useState<string[]>(AVAILABLE_LANGUAGES);

  return {
    languages,
  };
}
