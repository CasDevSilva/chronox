# 📦 Changelog – Chronox CLI

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org).

---

## [1.0.0] - 2025-05-24
### Added
- CLI commands: `init`, `add`, `close`, `list`, `start`, `stop`, `sessions`, `set-rate`, `report`, `export`
- Session tracking by alias with timestamp and duration
- Hourly rate configuration per project and globally
- Console reports via `cli-table3`
- Excel export with `exceljs` (.xlsx, two sheets)
- SQLite database with auto-initialization
- Colored terminal messages with `chalk`

### Fixed
- Validation for duplicate aliases
- Prevention of overlapping sessions
- Auto-creation of `.chronox/exports` folder

---

## [Unreleased]
- Internal tests with `vitest` (planned)
- `--help` and command parsing with Commander.js (v1.1+)
- Web dashboard (future version)