export class RedirectNotFoundError extends Error {
  constructor(shortCode: string) {
    super(`No redirect found for shortcode ${shortCode}.`);
  }
}
