# Deployment policy

- Do not push commits to any remote, trigger a hosted deployment, or change remote deployment configuration unless the user gives explicit approval in the current request. When approved, direct pushes to the deployment branch (`main`) are allowed; do not require a separate feature branch or pull request.
- Default to running and validating the site locally. Provide the local URL for review before requesting permission to publish.
