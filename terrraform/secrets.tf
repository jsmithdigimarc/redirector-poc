resource "google_secret_manager_secret" "graphile_api_token" {
  secret_id = local.graphile_api_token_secret_name

  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret_version" "graphile_api_token_version" {
  secret      = google_secret_manager_secret.graphile_api_token.id
  secret_data = var.graphile_api_token
}