resource "google_cloud_run_service" "service" {
  name     = local.service_name
  location = var.region

  template {
    spec {
      containers {
        image = "${var.region}-docker.pkg.dev/${var.project}/${var.artifact_repository_name}/rules-engine:${var.service_version}"
        env {
          name = "GRAPHILE_API_TOKEN"
          value_from {
            secret_key_ref {
              key  = "latest"
              name = var.graphile_api_token_secret_name
            }
          }
        }
        env {
          name  = "ACTIONS_SERVICE_URL"
          value = var.actions_service_url
        }
        env {
          name  = "RULES_ENGINE_SERVICE_URL"
          value = var.rules_engine_service_url
        }
      }

      service_account_name = var.service_account_email
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  depends_on = [google_project_service.run_api]
}

data "google_iam_policy" "authenticated_service_policy" {
  binding {
    role    = "roles/run.invoker"
    members = [
      "allAuthenticatedUsers"
    ]
  }
}

resource "google_cloud_run_service_iam_policy" "authenticated_service_policy" {
  location = google_cloud_run_service.service.location
  project  = google_cloud_run_service.service.project
  service  = google_cloud_run_service.service.name

  policy_data = data.google_iam_policy.authenticated_service_policy.policy_data
}