terraform {
  backend "gcs" {
    bucket = "tfstate-jsmithdigimarc"
    prefix = "redirector-poc"
  }
}

provider "google" {
  project = var.project
  region  = var.region
}

locals {
  graphile_api_token_secret_name = "graphile_api_token"
}

resource "google_project_service" "secretmanager_api" {
  project                    = var.project
  service                    = "secretmanager.googleapis.com"
  disable_dependent_services = true
  disable_on_destroy         = false
}

module "actions_service" {
  source                         = "../services/actions/terraform"
  project                        = var.project
  region                         = var.region
  service_account_email          = google_service_account.service_account.email
  graphile_api_token_secret_name = local.graphile_api_token_secret_name
  service_version                = var.actions_service_version
  depends_on                     = [
    google_secret_manager_secret_version.graphile_api_token_version,
    google_project_iam_member.service_account_secrets_accessor
  ]
}

module "rules_engine_service" {
  source                = "../services/rules-engine/terraform"
  project               = var.project
  region                = var.region
  service_account_email = google_service_account.service_account.email
  service_version       = var.rules_engine_service_version
  depends_on            = [
    google_secret_manager_secret_version.graphile_api_token_version,
    google_project_iam_member.service_account_secrets_accessor
  ]
}

module "redirections_service" {
  source                         = "../services/redirections/terraform"
  project                        = var.project
  region                         = var.region
  service_account_email          = google_service_account.service_account.email
  actions_service_url            = module.actions_service.service_url
  rules_engine_service_url       = module.rules_engine_service.service_url
  graphile_base_url              = var.graphile_base_url
  graphile_api_token_secret_name = local.graphile_api_token_secret_name
  service_version                = var.redirections_service_version
  depends_on                     = [
    google_secret_manager_secret_version.graphile_api_token_version,
    google_project_iam_member.service_account_secrets_accessor
  ]
}