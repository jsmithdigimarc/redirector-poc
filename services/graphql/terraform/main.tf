terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "2.22.0"
    }
    google = {
      source  = "hashicorp/google"
      version = "4.41.0"
    }
  }
}

locals {
  service_name = "graphql-service"
}

resource "google_project_service" "run_api" {
  project                    = var.project
  service                    = "run.googleapis.com"
  disable_dependent_services = true
  disable_on_destroy         = false
}