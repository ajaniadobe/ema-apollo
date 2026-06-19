see @AGENTS.md

## Workflow behaviors

- When a branch is detected as merged (via CI monitor event, `gh pr` output, or `git` status), automatically run `git checkout main && git pull` without asking.

## Allowed without user approval (this project only)

- `git` commands on any branch except `main` / `origin/main`, including `cd` to this project directory + `git checkout <non-main branch>`
- `cat` commands
- `curl` commands to `localhost`
- Playwright scripts targeting `localhost` or `*.apollo.com` domains
- `cd` to any directory
- `npm run lint`
