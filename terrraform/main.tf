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

module "actions_service" {
  source                = "../services/actions/terraform"
  project               = var.project
  region                = var.region
  service_account_email = google_service_account.service_account.email
  service_version       = "latest"
}

module "rules_engine_service" {
  source                = "../services/rules-engine/terraform"
  project               = var.project
  region                = var.region
  service_account_email = google_service_account.service_account.email
  service_version       = "latest"
}

module "redirections_service" {
  source                   = "../services/redirections/terraform"
  project                  = var.project
  region                   = var.region
  service_account_email    = google_service_account.service_account.email
  actions_service_url      = module.actions_service.service_url
  rules_engine_service_url = module.rules_engine_service.service_url
  service_version          = "latest"
}