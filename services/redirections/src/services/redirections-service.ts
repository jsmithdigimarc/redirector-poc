export interface RedirectionsService {
  getRedirect(shortcode: string): Promise<string>
}

export function RedirectionsService(): RedirectionsService {

  async function getRedirect(shortcode: string): Promise<string> {
    return "";
  }

  return {
    getRedirect,
  };
}
