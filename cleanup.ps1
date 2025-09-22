# Remove empty or duplicate directories
Remove-Item -Path "logs" -Recurse -Force
Remove-Item -Path "har" -Recurse -Force

# Remove unnecessary log files
Remove-Item -Path "local.log" -Force
Remove-Item -Path "log/sdk-cli.log" -Force
Remove-Item -Path "log/usage.log" -Force

# Clean generated directories
Remove-Item -Path "test-results" -Recurse -Force
Remove-Item -Path "playwright-report" -Recurse -Force
Remove-Item -Path "screenshots" -Recurse -Force
Remove-Item -Path "storage" -Recurse -Force

# Remove redundant config
Remove-Item -Path "browserstack.yml" -Force
Remove-Item -Path ".hintrc" -Force

# Create gitignore if it doesn't exist
$gitignore = @"
# Logs
logs/
*.log

# Test artifacts
test-results/
playwright-report/
screenshots/
storage/
har/

# Environment
.env

# Dependencies
node_modules/
package-lock.json

# IDE
.vscode/
*.code-workspace
"@

Set-Content -Path ".gitignore" -Value $gitignore