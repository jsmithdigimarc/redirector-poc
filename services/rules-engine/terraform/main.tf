provider "google" {
  project = var.project
  region  = var.region
}

locals {
  service_name = "rules-engine-service"
}

resource "google_project_service" "run_api" {
  project                    = var.project
  service                    = "run.googleapis.com"
  disable_dependent_services = true
  disable_on_destroy         = false
}