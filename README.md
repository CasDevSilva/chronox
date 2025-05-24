# Chronox

Chronox is a productivity CLI tool for developers. It allows you to track time spent on projects, calculate hourly costs, generate visual console reports, and export data to `.xlsx`. Everything is stored locally — no internet connection required.

## 🚀 Available Commands

|Command|Description|
|-------|-----------|
|`chronox init`                     |Initializes the local database (~/.chronox/)|
|`chronox add <name> <alias>`       |Adds a new project with a short alias|
|`chronox close <alias>`            |Marks a project as completed|
|`chronox list`                     |Displays all registered projects|
|`chronox start <alias>`            |Starts a work session for a project|
|`chronox stop <alias>`             |Stops the active session for a project|
|`chronox sessions`                 |Lists active and historical sessions|
|`chronox set-rate <alias> <rate>`  |Sets the hourly rate for a specific project|
|`chronox report [alias]`           |Shows reports by project or all projects|
|`chronox export [alias]`           |Exports sessions and projects to a .xlsx file|

## 📊 Features

- Manage multiple projects using short aliases
- Automatically records session durations
- Per-project hourly rate configuration
- Clean console reports using cli-table3
- Excel export with separate sheets using exceljs
- Local storage via SQLite (no online sync)
- Styled CLI messages using chalk

## 📁 Export Structure

Reports are saved to:
```bash
~/.chronox/exports/
```

Each .xlsx file contains two sheets:
- Projects – list of all tracked projects
- Sessions – all recorded work sessions

For clarification “~” would be your computer's home address

## 🛠 Dependencies

- better-sqlite3
- cli-table3
- exceljs
- chalk
- dayjs

## 📌 Notes

- Sessions must be stopped manually via chronox stop.
- You cannot start a new session if one is already active for the same project.
- Aliases must be unique.

## 📤 Release

This CLI is part of a personal developer toolkit and productivity workflow.

Feel free to clone, adapt, or improve it for your own use.

Built by Carlos Rimachi Silva – 2025.