#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
SKILL_NAME="iwannashare"
SKILL_SOURCE="${REPO_ROOT}/skills/${SKILL_NAME}"
CODEX_HOME_DIR="${CODEX_HOME:-${HOME}/.codex}"
SKILL_TARGET="${CODEX_HOME_DIR}/skills/${SKILL_NAME}"
TEMP_DIR=""
TEMP_SKILL_DIR=""

cleanup() {
  if [[ -n "$TEMP_DIR" ]]; then
    rm -rf "$TEMP_DIR"
  fi
  if [[ -n "$TEMP_SKILL_DIR" ]]; then
    rm -rf "$TEMP_SKILL_DIR"
  fi
}

trap cleanup EXIT

log() {
  printf '==> %s\n' "$*"
}

warn() {
  printf 'Warning: %s\n' "$*" >&2
}

fail() {
  printf 'Error: %s\n' "$*" >&2
  exit 1
}

need_command() {
  command -v "$1" >/dev/null 2>&1 || fail "Missing required command: $1"
}

install_cli() {
  log "Installing npm dependencies"
  npm --prefix "$REPO_ROOT" install --ignore-scripts

  log "Building IWannaShare CLI"
  npm --prefix "$REPO_ROOT" run build

  TEMP_DIR="$(mktemp -d)"

  log "Packing installable CLI artifact"
  local package_file
  package_file="$(cd "$REPO_ROOT" && npm pack --pack-destination "$TEMP_DIR" --silent --ignore-scripts)"

  local package_path="${TEMP_DIR}/${package_file}"
  [[ -f "$package_path" ]] || fail "Package artifact was not created: $package_path"

  log "Installing iws globally"
  npm install -g "$package_path"
}

install_skill() {
  [[ -f "${SKILL_SOURCE}/SKILL.md" ]] || fail "Skill source not found: ${SKILL_SOURCE}"

  log "Installing Codex Skill to ${SKILL_TARGET}"
  mkdir -p "$(dirname "$SKILL_TARGET")"

  TEMP_SKILL_DIR="${SKILL_TARGET}.tmp.$$"
  rm -rf "$TEMP_SKILL_DIR"
  mkdir -p "$TEMP_SKILL_DIR"
  cp -R "${SKILL_SOURCE}/." "$TEMP_SKILL_DIR/"

  rm -rf "$SKILL_TARGET"
  mv "$TEMP_SKILL_DIR" "$SKILL_TARGET"
  TEMP_SKILL_DIR=""
}

verify_install() {
  log "Verifying iws command"
  command -v iws >/dev/null 2>&1 || fail "iws is not available on PATH after install"
  iws --version

  if ! iws doctor; then
    warn "iws is installed, but no Chrome-compatible browser was detected. Install Google Chrome or pass --browser when rendering."
  fi

  log "Installed Skill"
  printf '%s\n' "$SKILL_TARGET"
}

main() {
  [[ -f "${REPO_ROOT}/package.json" ]] || fail "Run this script from a cloned IWannaShare repository."

  need_command node
  need_command npm

  log "Using CODEX_HOME: ${CODEX_HOME_DIR}"
  install_cli
  install_skill
  verify_install

  log "Done. Restart Codex to pick up the iwannashare skill."
}

main "$@"
