# GitHub Workflows

This directory contains GitHub Actions workflows for automating CI/CD processes.

## Workflows

### CI Workflow (`ci.yml`)

Runs on every push and pull request to `main` and `develop` branches.

**Jobs:**

1. **Lint** - Runs ESLint across all packages
2. **Type Check** - Validates TypeScript types
3. **Test** - Runs all unit and component tests
   - Uploads coverage reports to Codecov
4. **Build** - Builds all packages
5. **Status Check** - Aggregates all job results

**Requirements:**
- All lint checks must pass
- All tests must pass
- Type check and build are informational (allowed to fail temporarily)

## Running Checks Locally

Before pushing, you can run these checks locally:

```bash
# Run all checks
pnpm lint
pnpm test
pnpm build

# Generate Prisma client (required before tests/build)
pnpm db:generate
```

## Adding New Workflows

When adding new workflows:

1. Create a new `.yml` file in `.github/workflows/`
2. Follow the naming convention: `workflow-name.yml`
3. Document the workflow in this README
4. Test the workflow in a pull request before merging

## Secrets

The following secrets may be configured in GitHub repository settings:

- `CODECOV_TOKEN` - Token for Codecov integration (optional)
- Future: Database connection strings, API keys, etc.

## Monitoring

View workflow runs at: `https://github.com/josens83/preptap-monorepo/actions`
