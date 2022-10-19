export const CREATE_REDIRECT = `mutation CreateRedirect($input: CreateRedirectInput!) {
    createRedirect(input: $input) {
      redirect {
        shortCode
      }
    }
  }`;
