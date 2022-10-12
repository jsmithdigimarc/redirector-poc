variable "project" {
  type = string
}

variable "region" {
  type = string
}

variable "actions_service_version" {
  type = string
}

variable "redirections_service_version" {
  type = string
}

variable "rules_engine_service_version" {
  type = string
}

variable "graphql_service_version" {
  type = string
}

variable "artifact_repository_name" {
  type    = string
  default = "gcf-artifacts"
}

variable "postgres_connection_name" {
  type = string
}

variable "postgres_password" {
  type      = string
  sensitive = true
}

variable "postgres_host" {
  type = string
}

variable "postgres_user" {
  type = string
}