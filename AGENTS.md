# Repository Guidelines

## Project Structure & Module Organization
This repository is a Kodi add-on package. Top-level entry points are `navigation.py` and `service.py`. Core Python code lives in `resources/site-packages/elementum/` (add-on logic) and `resources/site-packages/bjsonrpc/` (RPC support).  
Web UI source is in `resources/web-src/src/`, and compiled static output is committed under `resources/web/`.  
UI assets, skins, and localization files are under `resources/img/`, `resources/skins/`, and `resources/language/<Language>/strings.po`.  
Release/build tooling is at the root: `Makefile`, `bundle.sh`, `release.sh`, and translation scripts in `scripts/`.

## Build, Test, and Development Commands
- `pip install -r requirements.txt`: install Python tooling (`flake8`).
- `flake8`: run Python lint checks (configured in `setup.cfg`).
- `./scripts/xgettext.sh`: validate/update translation catalogs.
- `make`: clean and build the main distributable zip.
- `make zipfiles`: build per-platform zip artifacts.
- `./bundle.sh --binaries=/path/to/elementum/build`: package add-on using prebuilt daemon binaries.
- `cd resources/web-src && npm install && npm start`: run Web UI locally (Node.js 12 recommended).
- `cd resources/web-src && npm run build`: build Web UI into `resources/web/`.

## Coding Style & Naming Conventions
Use 4-space indentation for Python. Prefer `snake_case` for Python files, functions, and variables; keep module names lowercase.  
Run `flake8` before committing; project lint rules allow selected exceptions and a high line limit (`max-line-length = 370`).  
For Web UI, follow existing TypeScript + React conventions, ESLint (`airbnb-typescript` stack), and Prettier (`singleQuote: true`, `trailingComma: all`, width 140).

## Testing Guidelines
CI primarily enforces lint and localization integrity (`flake8` and `./scripts/xgettext.sh`), plus packaging (`make`).  
There is no large in-repo Python unit test suite today; if you add tests, use `pytest` conventions (`test_*.py`) and keep tests outside vendored code.  
For UI changes, run `npm test` in `resources/web-src` and include manual verification notes.

## Commit & Pull Request Guidelines
Use focused, imperative commit messages; optional scope prefixes and issue refs are common (example: `proxy: fix no_proxy handling (#1143)`).  
Avoid mixing unrelated changes (translations, refactors, behavior fixes) in one commit.  
Open PRs against `master` and complete the template: description, related issue, motivation, testing, and change type. Include screenshots for UI changes.

## Security & Configuration Tips
Do not commit secrets, tokens, or machine-specific paths. Keep release credentials in environment variables only.
