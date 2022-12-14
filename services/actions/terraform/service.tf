data "docker_registry_image" "service" {
  name = "${var.region}-docker.pkg.dev/${var.project}/${var.artifact_repository_name}/${local.service_name}:${var.service_version}"
}

resource "google_cloud_run_service" "service" {
  name     = local.service_name
  location = var.region

  template {
    spec {
      containers {
        image = "${var.region}-docker.pkg.dev/${var.project}/${var.artifact_repository_name}/${local.service_name}@${data.docker_registry_image.service.sha256_digest}"
        env {
          name  = "GRAPHQL_SERVICE_URL"
          value = "${var.graphql_service_url}"
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

data "google_iam_policy" "private_service_policy" {
  binding {
    role    = "roles/run.invoker"
    members = [
      "serviceAccount:${var.service_account_email}"
    ]
  }
}

resource "google_cloud_run_service_iam_policy" "private_service_policy" {
  location = google_cloud_run_service.service.location
  project  = google_cloud_run_service.service.project
  service  = google_cloud_run_service.service.name

  policy_data = data.google_iam_policy.private_service_policy.policy_data
}