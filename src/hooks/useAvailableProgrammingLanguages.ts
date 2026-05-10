/**
 * useAvailableProgrammingLanguages — Provides a global list of programming languages.
 */
export default function useAvailableProgrammingLanguages() {
  const languages = [
    'TypeScript', 'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby',
    'Go', 'Rust', 'React', 'Vue.js', 'Angular', 'Node.js', 'Django', 'Flask',
    'Spring Boot', 'MongoDB', 'PostgreSQL', 'MySQL',
  ]

  return { languages }
}
