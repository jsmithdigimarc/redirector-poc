export const GET_REDIRECT = `query Redirect($shortCode: String!) {
  redirectByShortCode(shortCode: $shortCode) {
    id
    customerId
    shortCode
    shortDomain
    defaultRedirectUrl
    evrythngId
    evrythngType
  }
}`;
