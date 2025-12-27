# 🔒 Security Scanning & CodeQL Guide

## Overview

Your enhanced CodeQL workflow performs comprehensive security analysis covering:

✅ **Security Vulnerabilities** - SQL injection, XSS, CSRF, command injection
✅ **Code Quality Issues** - Unreachable code, unused variables, logic errors
✅ **Best Practices** - Secure coding patterns, performance issues
✅ **Dependency Vulnerabilities** - npm audit for known vulnerabilities
✅ **Secret Detection** - Trivy scanner for exposed secrets
✅ **Type Safety** - TypeScript strict checking
✅ **Linting** - ESLint code quality checks

---

## What Gets Scanned 🔍

### 1. **CodeQL Security Analysis**
Detects:
- Cross-site Scripting (XSS)
- SQL Injection
- Command Injection
- Path Traversal
- CSRF Attacks
- Unsafe regular expressions
- Insecure authentication
- Cryptographic weaknesses
- Hardcoded secrets
- Buffer overflows
- Race conditions

### 2. **Code Quality Analysis**
Detects:
- Dead code (unreachable)
- Unused variables
- Logic errors
- Inconsistent naming
- Duplicate code
- Overly complex functions
- Missing error handling

### 3. **Dependency Vulnerabilities**
- npm audit scan
- Known CVEs in dependencies
- Transitive dependency issues

### 4. **Secret Detection**
- API keys exposure
- Passwords in code
- Private credentials
- Database connection strings

### 5. **Type Safety**
- TypeScript compilation errors
- Type mismatches
- Unsafe type assertions

### 6. **Code Linting**
- ESLint violations
- Unused imports
- Inconsistent formatting

---

## How to Check Security Reports 📊

### Method 1: GitHub Security Tab (Easiest) ✅

**Step-by-Step:**

1. Go to your repository: https://github.com/kuhandran/kuhan_website

2. Click **Security** tab (top navigation)
   ```
   Code | Issues | Pull requests | Discussions | Security | Insights
   ```

3. Click **Code scanning** (left sidebar)
   ```
   Security overview
   → Code scanning alerts
   → Secret scanning
   → Dependabot alerts
   ```

4. View alerts by:
   - **Severity**: Critical, High, Medium, Low
   - **Status**: Open, Closed, Fixed
   - **Type**: Different vulnerability categories

5. Click any alert to see:
   - 📍 Affected file location
   - 🔢 Line number
   - 📝 Detailed description
   - 💡 Suggested fix
   - 🔗 Related documentation

**Direct Links:**
```
Code Scanning: https://github.com/kuhandran/kuhan_website/security/code-scanning
All Alerts: https://github.com/kuhandran/kuhan_website/security
```

### Method 2: GitHub Actions Workflow Results 🤖

**Step-by-Step:**

1. Go to **Actions** tab
   ```
   https://github.com/kuhandran/kuhan_website/actions
   ```

2. Click **CodeQL Advanced Security Analysis** workflow

3. Click latest run (top of list)

4. Expand job names to see:
   - ✅ CodeQL Analysis results
   - 🔒 Security checks
   - ⚙️ Quality gates
   - 📋 Report summary

5. Click **Artifacts** to download:
   - `codeql-sarif-report` (detailed SARIF file)
   - `trivy-security-report` (dependency scan)

**Direct Links:**
```
All Runs: https://github.com/kuhandran/kuhan_website/actions/workflows/codeql.yml
Latest Run: Click the most recent one
```

### Method 3: Pull Request Security Review 🔄

**When you open a Pull Request:**

1. Go to your PR
2. Scroll to **Checks** section
3. See CodeQL results automatically
4. Fix issues before merging

### Method 4: Download SARIF Report (Advanced) 📥

**SARIF = Static Analysis Results Format**

1. Go to Actions → Latest run
2. Click **Artifacts**
3. Download `codeql-sarif-report.zip`
4. Extract and view in SARIF viewer:
   ```
   https://github.com/microsoft/sarif-web-component
   ```

5. Or open in VS Code:
   ```bash
   # Install SARIF extension
   code --install-extension MS-SarifVSCode.sarif-viewer
   
   # Open SARIF file
   code results.sarif
   ```

### Method 5: Local Analysis (Your Machine) 💻

**Run CodeQL locally:**

```bash
# 1. Install CodeQL CLI
brew install codeql  # macOS
# or download from https://github.com/github/codeql-cli-releases

# 2. Create analysis database
codeql database create my_database \
  --language=javascript-typescript \
  --source-root=.

# 3. Run analysis
codeql database analyze my_database \
  codeql/javascript-typescript-queries \
  --format=sarif-latest \
  --output=results.sarif

# 4. View results (requires VS Code extension)
```

---

## When Scans Run ⏰

Your workflow runs automatically on:

| Event | When | Frequency |
|-------|------|-----------|
| **Push** | Every commit to main/develop | Instant |
| **Pull Request** | Every PR to main/develop | Instant |
| **Schedule** | Sunday 2 AM UTC | Weekly |
| **Manual** | Run from Actions tab | On-demand |

### View Scan History

```
Actions → CodeQL Advanced Security Analysis → See all runs
```

---

## Understanding Severity Levels ⚠️

| Level | Risk | Action |
|-------|------|--------|
| 🔴 **Critical** | Immediate security risk | Fix immediately before deployment |
| 🟠 **High** | Serious vulnerability | Fix within 24-48 hours |
| 🟡 **Medium** | Moderate risk | Fix within sprint |
| 🟢 **Low** | Minor issue | Fix when possible |

---

## Common Alerts & Fixes 🛠️

### 1. **Cross-site Scripting (XSS)**
**Problem:**
```javascript
// ❌ Dangerous - User input directly in HTML
const html = `<div>${userInput}</div>`;
```

**Fix:**
```javascript
// ✅ Safe - React escapes by default
const element = <div>{userInput}</div>;
```

### 2. **Unused Variable**
**Problem:**
```javascript
const unused = getValue();
return null;
```

**Fix:**
```javascript
// Either use it or remove it
const used = getValue();
return used;
```

### 3. **Missing Error Handling**
**Problem:**
```javascript
const result = await fetch(url);
const data = await result.json(); // Could fail
```

**Fix:**
```javascript
try {
  const result = await fetch(url);
  if (!result.ok) throw new Error('Fetch failed');
  const data = await result.json();
  return data;
} catch (error) {
  console.error('Error:', error);
  return null;
}
```

### 4. **Hardcoded Secrets**
**Problem:**
```javascript
const apiKey = "sk-1234567890"; // ❌ Bad!
```

**Fix:**
```javascript
const apiKey = process.env.API_KEY; // ✅ Good!
```

---

## Interpreting the Report 📈

### GitHub Security Tab View

```
Code Scanning
├── Active Alerts (X found)
│   ├── Critical (0)
│   ├── High (0)
│   ├── Medium (2)
│   └── Low (5)
│
└── Alert Details
    ├── Alert: Cross-site Scripting
    │   ├── Location: src/components/Hero.tsx:45
    │   ├── Severity: High
    │   ├── Description: User input may be unescaped
    │   ├── Fix: Use .textContent instead of .innerHTML
    │   └── Docs: [Learn more]
    │
    └── Alert: Unused Variable
        ├── Location: src/lib/utils.ts:12
        ├── Severity: Low
        ├── Description: Variable 'unused' is never read
        ├── Fix: Remove or use the variable
        └── Docs: [Learn more]
```

### Action Items
1. **Click each alert** for detailed fix instructions
2. **Implement fixes** in your code
3. **Commit changes** to trigger re-scan
4. **Verify** alert is marked as fixed

---

## Best Practices 🎯

### 1. **Fix Immediately**
```bash
# After fixing, commit and push
git add .
git commit -m "fix: Resolve CodeQL security alert [issue-id]"
git push origin main
```

### 2. **Review Every Alert**
- Not all alerts require fixing
- Some may be false positives
- Mark them appropriately in GitHub

### 3. **Prevent Issues**
```bash
# Run locally before pushing
npm run build     # Catches TypeScript errors
npm run lint      # Catches code quality issues
npm audit         # Checks dependencies
```

### 4. **Keep Dependencies Updated**
```bash
npm update
npm audit fix
```

### 5. **Enable Branch Protection**
Go to Settings → Branches → Add rule:
- Require CodeQL checks to pass
- Require status checks before merge

---

## Troubleshooting 🔧

### Issue: "Code scanning is not enabled"

**Solution:**
1. Go to Settings → Code security and analysis
2. Click "Enable" next to CodeQL
3. Or make repository Public (if private)

### Issue: Scan takes too long

**Solution:**
- Check if dependencies are cached
- Review large node_modules folders
- Exclude unnecessary paths

### Issue: False positive alerts

**Solution:**
1. Click alert → "Dismiss"
2. Select reason (False positive, etc.)
3. GitHub will suppress in future scans

### Issue: Can't see SARIF report

**Solution:**
```bash
# Check artifacts exist
ls -la results/
# Download from Actions tab
# Open with SARIF viewer
```

---

## Advanced Configuration 🚀

### Customize Queries

Edit `.github/workflows/codeql.yml`:

```yaml
- name: Initialize CodeQL
  uses: github/codeql-action/init@v4
  with:
    languages: javascript-typescript
    queries: |
      security-and-quality
      security-extended
      custom-queries  # Add custom queries
```

### Add Custom Query Pack

```yaml
- name: Initialize CodeQL
  uses: github/codeql-action/init@v4
  with:
    packs: +owner/repo/pack-name
```

### Exclude Files

Create `.github/codeql/codeql-config.yml`:

```yaml
paths-ignore:
  - node_modules
  - .next
  - dist
  - coverage
  - "**/*.test.ts"
  - "**/*.spec.ts"
```

---

## Reports & Metrics 📊

### Monthly Security Report

Create `.github/workflows/security-report.yml`:

```yaml
name: Monthly Security Report
on:
  schedule:
    - cron: '0 0 1 * *'  # First day of month

jobs:
  report:
    runs-on: ubuntu-latest
    steps:
      - name: Generate Report
        run: |
          curl https://api.github.com/repos/kuhandran/kuhan_website/code-scanning/alerts \
            -H "Authorization: token ${{ secrets.GITHUB_TOKEN }}" \
            > security-report.json
      
      - name: Upload Report
        uses: actions/upload-artifact@v4
        with:
          name: monthly-security-report
          path: security-report.json
```

---

## Key Metrics to Monitor 📈

Track these over time:

1. **Total Alerts**: Should decrease
2. **Critical Issues**: Must be zero in production
3. **Time to Fix**: Reduce average time
4. **Scan Coverage**: Aim for 100%
5. **New Alerts**: Monitor trends

---

## Integration with Notifications 🔔

### Email Alerts
GitHub automatically notifies you when:
- New critical/high severity alerts found
- Status changes on existing alerts

### Slack Integration
```yaml
- name: Notify Slack on Critical Alert
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## Documentation Links 📚

- [CodeQL Documentation](https://codeql.github.com/docs/)
- [GitHub Security Overview](https://docs.github.com/en/code-security)
- [SARIF Format](https://sarifweb.azurewebsites.net/)
- [CodeQL Queries](https://github.com/github/codeql)

---

## Quick Start Checklist ✅

- [ ] Make repo public (or enable GHAS)
- [ ] Wait for first scan to complete
- [ ] Go to Security tab → Code scanning
- [ ] Review all alerts
- [ ] Fix critical/high severity issues
- [ ] Enable branch protection
- [ ] Set up Slack/email notifications
- [ ] Monitor weekly scan results

---

**Questions?** Check the GitHub Security tab for detailed documentation on each alert type.
