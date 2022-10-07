resource "google_service_account" "service_account" {
  account_id   = "redirector-poc-service-account"
  description  = "Service account used to allow inter-service authentication with private services"
  display_name = "redirector-poc-service-account"
}