import getPlaceSuggestion from 'places-suggestions';

export default function greet() {
  const suggestion = getPlaceSuggestion();
  console.log({ suggestion });
  return 'Hello user!';
}
