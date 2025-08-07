# GitHub Workflows Overview

This document summarizes the workflows found in the `.github/workflows` folder of this repository, their purposes, and what you need to change to use them in your own forked repo.

---

## 1. `.github/workflows/azure-dev-validation.yaml`
- **Purpose:** Validates the Azure Developer (`azd`) template and Bicep files for infrastructure-as-code best practices and security.
- **Triggers:** On push or pull request to `main` branch, but only if files in the `infra/` folder change. Can also be run manually via workflow dispatch.
- **Jobs:** 
  - **bicep**: Checks out code, builds the main Bicep file for linting using Azure CLI.
  - **psrule**: Checks out code, runs PSRule analysis for Azure security best practices on test Bicep files, uploads results to the Security tab (only for the original repo).
- **To use:** 
  - Update file paths if your Bicep files are in a different folder or have different names.
  - Update `inputPath` if you don't use `.test.bicep` files.
  - Change or remove `if: github.repository == 'Azure-Samples/azure-search-openai-demo'` to enable uploading in your own repo.
  - Make sure your repo allows writing security events if you want SARIF results in the Security tab.
  - Update Azure CLI version if you need a newer version.

## 2. `.github/workflows/azure-dev.yml`
**Purpose:** Automates deployment of the app and infrastructure to Azure using the Azure Developer CLI (`azd`).

**Triggers:**
- On push to `main` or `master` branches
- Manual trigger via workflow dispatch

**Jobs:**
- **build**: Sets up environment, installs dependencies, logs into Azure, provisions infrastructure, and deploys the app

**Step-by-step:**
- Checks out the repo
- Installs Azure Developer CLI (`azd`)
- Installs Node.js (v18)
- Logs into Azure using federated credentials (OpenID Connect)
- Provisions infrastructure with `azd provision` (using secrets for app registration)
- Deploys the application with `azd deploy`

**What to change when forking or using in a new repo:**
- **Branch names:** If your main branch is not `main` or `master`, update the `branches` list under `push`
- **Environment variables:** All `env:` variables are set from GitHub repository variables (not secrets). You must set these in your repo’s GitHub Actions settings (Settings → Variables)
- **Secrets:** You must add `AZD_INITIAL_ENVIRONMENT_CONFIG`, `AZURE_SERVER_APP_SECRET`, and `AZURE_CLIENT_APP_SECRET` as GitHub secrets (Settings → Secrets and variables → Actions)
- **Azure setup:** Run `azd pipeline config` in your repo to set up required Azure federated credentials and permissions
- **Resource names:** Update any resource names, locations, or SKUs to match your Azure environment
- **App registration:** Make sure your Azure AD app registrations (client/server) and secrets are correct for your environment
- **Permissions:** The workflow uses federated credentials for secretless login. Make sure your Azure subscription and tenant are configured for this
- **Node version:** Update `node-version` if your app requires a different version

**Summary:**
This workflow is the main automation for Azure deployment. You must set up all required variables and secrets in your repo, and ensure your Azure environment matches the configuration. After setup, you can deploy by pushing to your main branch or running the workflow manually.

## 3. `.github/workflows/evaluate.yaml`
**Purpose:** Automates evaluation of the RAG (Retrieval-Augmented Generation) answer flow for pull requests, posting results as comments and artifacts.

**Triggers:**
- When a comment is created on a pull request with the exact body `/evaluate` by a repo member, collaborator, or owner

**Jobs:**
- **evaluate**: Sets up environment, builds and runs the app locally, runs evaluation scripts, uploads results, and comments on the PR

**Step-by-step:**
- Checks if the comment is `/evaluate` and the author is a repo member/collaborator/owner
- Comments on the PR to indicate evaluation is starting
- Checks out the PR branch
- Installs Python and Node dependencies
- Installs Azure Developer CLI (`azd`)
- Logs into Azure using federated credentials and Azure CLI
- Refreshes environment variables
- Builds the frontend
- Installs backend and evaluation dependencies
- Runs the backend server locally in the background
- Runs the evaluation script against the local server
- Uploads evaluation results and server logs as build artifacts
- Summarizes results and posts a comment on the PR with the evaluation summary and a link to the workflow run

**What to change when forking or using in a new repo:**
- **Environment variables:** All `env:` variables are set from GitHub repository variables. You must set these in your repo’s GitHub Actions settings (Settings → Variables)
- **Secrets:** You must add `AZD_INITIAL_ENVIRONMENT_CONFIG`, `AZURE_SERVER_APP_SECRET`, and `AZURE_CLIENT_APP_SECRET` as GitHub secrets (Settings → Secrets and variables → Actions)
- **Evaluation scripts:** Make sure `evals/evaluate.py` and related scripts exist and are compatible with your repo
- **Server startup:** The workflow assumes your backend can be started with `python3 -m quart --app main:app run --port 50505`. Update this if your backend uses a different entrypoint or port
- **Artifact paths:** Update artifact upload paths if your evaluation or server logs are stored elsewhere
- **Permissions:** The workflow uses federated credentials for secretless login. Make sure your Azure subscription and tenant are configured for this
- **Node/Python versions:** Update `node-version` and `python-version` if your app requires different versions
- **PR comment triggers:** The workflow only runs for `/evaluate` comments on PRs. You can change this to use a different trigger or command

**Summary:**
This workflow enables automated, reproducible evaluation of PRs. You must set up all required variables, secrets, and ensure your evaluation scripts and server startup match your repo. After setup, collaborators can trigger evaluation by commenting `/evaluate` on a PR.

## 4. `.github/workflows/frontend.yaml`
**Purpose:** Lints and checks code formatting in the frontend using Prettier.

**Triggers:**
- On push or pull request to `main` branch, but only if files in the `app/frontend/` folder change

**Jobs:**
- **prettier**: Checks out code, installs frontend dependencies, runs Prettier to check formatting

**Step-by-step:**
- Checks out the repo
- Changes directory to `app/frontend`
- Installs npm dependencies
- Runs `npx prettier --check .` to check code formatting in the frontend

**What to change when forking or using in a new repo:**
- **File paths:** If your frontend code is in a different folder, update the `paths` triggers and the `cd` command in the workflow
- **Branch names:** If your main branch is not `main`, update the `branches` list under `push` and `pull_request`
- **Prettier config:** Make sure you have a Prettier configuration file (`.prettierrc`, `prettier.config.js`, etc.) in your frontend folder, or update the workflow to use your config location
- **Node version:** The workflow uses the default Node version. If your frontend requires a specific Node version, add a `setup-node` step
- **Dependencies:** Ensure your `package.json` includes Prettier as a dev dependency, or update the workflow to install it globally

**Summary:**
This workflow is safe to enable in your fork. Just update file paths, branch names, and Prettier configuration as needed for your repo structure and preferences.

### 5. `.github/workflows/lint-markdown.yml`
**Purpose:** Lints Markdown files in the repository using `markdownlint` to enforce style and formatting rules.

**Triggers:**
- On pull request to `main` branch, but only if any `.md` file changes

**Jobs:**
- **lint-markdown**: Checks out code, runs markdownlint on all Markdown files except those in the `data/` folder

**Step-by-step:**
- Checks out the repo
- Runs `markdownlint` using the configuration file `.github/workflows/markdownlint-config.json`
- Lints all Markdown files (`**/*.md`), ignoring files in the `data/` folder

**What to change when forking or using in a new repo:**
- **Branch names:** If your main branch is not `main`, update the `branches` list under `pull_request`
- **Markdownlint config:** Update the `config` path if you move or rename your markdownlint configuration file
- **File patterns:** Update the `files` and `ignore` patterns if your Markdown files are in different locations or you want to lint/exclude different files
- **Markdownlint rules:** Customize the rules in your markdownlint config file to match your preferred style

**Summary:**
This workflow is safe to enable in your fork. Just update branch names, config file path, and file patterns as needed for your repo structure and preferences.

## 6. `.github/workflows/validate-markdown.yml`
**Purpose:** Validates Markdown and Jupyter Notebook files for broken links, broken relative paths, and locale issues in URLs.

**Triggers:**
- On pull request to `main` branch, if any `.md` or `.ipynb` file changes (uses `pull_request_target` for security)

**Jobs:**
- **check-broken-paths**: Checks for broken relative paths in Markdown and notebook files
- **check-urls-locale**: Checks that URLs do not contain country/locale codes
- **check-broken-urls**: Checks for broken URLs in Markdown and notebook files

**Step-by-step:**
- Checks out the repo at the PR head commit
- Runs `action-check-markdown` to check for broken relative paths, using the repo root as the directory
- Runs `action-check-markdown` to check that URLs do not contain locale codes
- Runs `action-check-markdown` to check for broken URLs
- Uses a guide URL for contributors to fix issues (points to the original repo's CONTRIBUTING.md)

**What to change when forking or using in a new repo:**
- **Branch names:** If your main branch is not `main`, update the `branches` list under `pull_request_target`
- **Guide URL:** Update `guide-url` to point to your own repo's CONTRIBUTING.md or documentation
- **File patterns:** Update the `paths` list if you want to include/exclude different file types
- **GitHub token:** The workflow uses `${{ secrets.GITHUB_TOKEN }}` which is automatically provided by GitHub Actions
- **Action version:** The workflow uses `john0isaac/action-check-markdown@v1.1.0`. Update if a newer version is available or required

**Summary:**
This workflow is safe to enable in your fork. Just update branch names, guide URL, and file patterns as needed for your repo structure and preferences.

### 7. `.github/workflows/nightly-jobs.yaml`
**Purpose:** Runs scheduled jobs (nightly builds/tests) and allows manual triggering.

**Triggers:**
- Scheduled every night at midnight UTC (`cron: '0 0 * * *'`)
- Manual trigger via workflow dispatch

**Jobs:**
- **python-test:** Calls the `python-test.yaml` workflow to run Python tests and checks

**What to change when forking or using in a new repo:**
- **Schedule:** Update the `cron` expression if you want a different schedule
- **Job calls:** If you rename or move the test workflow, update the `uses:` path

**Summary:**
This workflow is safe to enable in your fork. Just update the schedule and job call path as needed.

---

### 8. `.github/workflows/python-test.yaml`
**Purpose:** Runs Python tests, linting, type checks, formatting, and E2E tests across multiple OS, Python, and Node versions.

**Triggers:**
- On push or pull request to `main` branch (ignores markdown, devcontainer, azdo, and GitHub config files)
- Can be called by other workflows (like `nightly-jobs.yaml`)

**Jobs:**
- **test_package:** Runs on Ubuntu and Windows, with a matrix of Python (3.9–3.13) and Node (20.14, 22) versions

**Step-by-step:**
- Checks out the repo
- Installs Python and Node dependencies
- Builds the frontend
- Installs backend dependencies
- Lints Python code with Ruff
- Checks types with Mypy (in `scripts/` and `app/backend/`)
- Checks formatting with Black
- Runs Python tests with pytest (with coverage, only on non-Windows runners)
- Runs E2E tests with Playwright (only on non-Windows runners)
- Uploads Playwright traces as artifacts if E2E tests fail

**What to change when forking or using in a new repo:**
- **Branch names:** If your main branch is not `main`, update the `branches` list
- **Paths:** Update `paths-ignore` if you want to include/exclude different files
- **Python/Node versions:** Update the matrix to match your supported versions
- **Test/lint/type check commands:** Update commands if your repo uses different tools or config files
- **Artifact paths:** Update if your test results are stored elsewhere
- **Playwright tests:** Make sure your E2E tests and Playwright setup match your repo

**Summary:**
This workflow is safe to enable in your fork. Just update branch names, matrix versions, test/lint/type check commands, and artifact paths as needed for your repo.

### 9. `.github/workflows/stale-bot.yml`
**Purpose:** Automatically marks and closes stale issues and pull requests to keep the repo clean.

**Triggers:**
- Scheduled to run daily at 1:30 AM UTC (`cron: '30 1 * * *'`)

**Jobs:**
- **stale:** Uses the `actions/stale` GitHub Action to mark issues/PRs as stale and close them after inactivity

**Step-by-step:**
- Runs the `actions/stale` action
- Marks issues and PRs as stale if they have been open for 60 days with no activity
- Posts a message when marking as stale
- Closes issues after 7 days of being marked stale (unless activity resumes)
- Closes PRs after 10 days of being marked stale (unless activity resumes)
- Posts a message when closing

**What to change when forking or using in a new repo:**
- **Schedule:** Update the `cron` expression if you want a different schedule
- **Stale/close messages:** Customize the messages to match your repo’s tone or instructions
- **Days before stale/close:** Adjust `days-before-issue-stale`, `days-before-pr-stale`, `days-before-issue-close`, and `days-before-pr-close` to fit your workflow (note: `-1` disables auto-closing)
- **Action version:** Update `actions/stale@v9` if a newer version is available

**Summary:**
This workflow is safe to enable in your fork. Just update the schedule, messages, and timing as needed for your repo’s issue/PR management preferences.
