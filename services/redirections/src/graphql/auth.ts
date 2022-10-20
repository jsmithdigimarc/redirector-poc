const GCP_METADATA_URL =
  "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity";

export async function fetchIDToken(audience: string): Promise<string> {
  const metadataUrl = new URL(GCP_METADATA_URL);
  metadataUrl.searchParams.append("audience", audience);

  const response = await fetch(metadataUrl, {
    method: "GET",
    headers: {
      "Metadata-Flavor": "Google",
    },
  });

  if (response.status !== 200) {
    const error = await response.text();
    throw new Error(
      `failed to fetch identity token from gcp metadata server: ${error}`
    );
  }

  return await response.text();
}
