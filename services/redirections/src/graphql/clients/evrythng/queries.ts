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

export const GET_PRODUCT_AND_RULES = `query RedirectMeta($evrythngId: BigInt!) {
  productById(id: $evrythngId) {
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

export const GET_THNG_AND_RULES = `query RedirectMeta($evrythngId: BigInt!) {
  thngById(id: $evrythngId) {
    name
    id
    tags
    customFields
    productByProductId {
      id
      name
      type
      tags
      customFields
    }
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
