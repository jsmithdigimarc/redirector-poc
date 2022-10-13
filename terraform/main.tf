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
  postgres_password_secret_name = "postgres_password"
}

resource "google_project_service" "secretmanager_api" {
  project                    = var.project
  service                    = "secretmanager.googleapis.com"
  disable_dependent_services = true
  disable_on_destroy         = false
}

module "actions_service" {
  source                = "../services/actions/terraform"
  project               = var.project
  region                = var.region
  service_account_email = google_service_account.service_account.email
  graphql_service_url   = module.graphql_service.service_url
  service_version       = var.actions_service_version
  depends_on            = [
    google_project_iam_member.service_account_secrets_accessor
  ]
}

module "rules_service" {
  source                = "../services/rules/terraform"
  project               = var.project
  region                = var.region
  service_account_email = google_service_account.service_account.email
  service_version       = var.rules_service_version
  depends_on            = [
    google_project_iam_member.service_account_secrets_accessor
  ]
}

module "redirections_service" {
  source                   = "../services/redirections/terraform"
  project                  = var.project
  region                   = var.region
  service_account_email    = google_service_account.service_account.email
  actions_service_url      = module.actions_service.service_url
  rules_service_url        = module.rules_service.service_url
  graphql_service_url      = module.graphql_service.service_url
  service_version          = var.redirections_service_version
  depends_on               = [
    google_project_iam_member.service_account_secrets_accessor
  ]
}

module "graphql_service" {
  source                        = "../services/graphql/terraform"
  project                       = var.project
  region                        = var.region
  service_account_email         = google_service_account.service_account.email
  postgres_connection_name      = var.postgres_connection_name
  postgres_host                 = var.postgres_host
  postgres_password_secret_name = local.postgres_password_secret_name
  postgres_user                 = var.postgres_user
  service_version               = var.graphql_service_version
  depends_on                    = [
    google_secret_manager_secret_version.postgres_password_version,
    google_project_iam_member.service_account_secrets_accessor
  ]
}