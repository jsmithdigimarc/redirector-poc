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

variable "postgres_connection_name" {
  type = string
}

variable "postgres_host" {
  type = string
}

variable "postgres_user" {
  type = string
}

variable "postgres_password_secret_name" {
  type = string
}