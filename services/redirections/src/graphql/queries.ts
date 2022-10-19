export const GET_REDIRECT = `query Redirect($shortCode: String!) {
  redirectByShortCode(shortCode: $shortCode) {
    id
    shortCode
    shortDomain
    defaultRedirectUrl
    evrythngId
    evrythngType
  }
}`;

export const GET_REDIRECT_META = `query RedirectMeta($evrythngId: BigInt!) {
  productById(id: $evrythngId) {
    name
    id
    tags
    customFields
  }
  thngById(id: $evrythngId) {
    name
    id
    tags
    customFields
  }
  allRules {
    nodes {
      id
      weight
      name
      match
      meta
    }
  }
}`;