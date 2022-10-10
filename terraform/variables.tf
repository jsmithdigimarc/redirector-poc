variable "project" {
  type = string
}

variable "region" {
  type = string
}

variable "actions_service_version" {
  type    = string
}

variable "redirections_service_version" {
  type    = string
}

variable "rules_engine_service_version" {
  type    = string
}

variable "artifact_repository_name" {
  type    = string
  default = "gcf-artifacts"
}

variable "graphile_base_url" {
  type = string
}

variable "graphile_api_token" {
  type      = string
  sensitive = true
}