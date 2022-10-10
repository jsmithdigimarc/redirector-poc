resource "google_service_account" "service_account" {
  account_id   = "redirector-poc-service-account"
  description  = "Service account used to allow inter-service authentication with private services"
  display_name = "redirector-poc-service-account"
}

resource "google_project_iam_member" "service_account_secrets_accessor" {
  project = var.project
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.service_account.email}"
}