variable "project" {
  type = string
}

variable "region" {
  type = string
}

variable "service_version" {
  type    = string
  default = "latest"
}

variable "artifact_repository_name" {
  type    = string
  default = "gcf-artifacts"
}

variable "service_account_email" {
  type = string
}

variable "graphile_base_url" {
  type = string
}

variable "actions_service_url" {
  type = string
}

variable "rules_engine_service_url" {
  type = string
}

variable "graphile_api_token_secret_name" {
  type = string
}