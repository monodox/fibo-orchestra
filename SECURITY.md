# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it by emailing security@fibo-orchestra.com or opening a private security advisory on GitHub.

**Please do not report security vulnerabilities through public GitHub issues.**

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if available)

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Varies based on severity

## Security Best Practices

### For Contributors

- **Never commit API keys, tokens, or credentials**
- Always use `.env` files for sensitive data (never commit `.env`)
- Use `.env.example` as template with placeholder values
- Review code for hardcoded secrets before committing
- Enable 2FA on all accounts (GitHub, npm, PyPI)
- Keep dependencies up to date
- Run security audits: `npm audit` and `pip-audit`

### For Users

- **Never share your API keys publicly**
- Store API keys in `.env` file (not tracked by git)
- Use environment-specific keys (dev/staging/prod)
- Rotate API keys regularly
- Use read-only keys when possible
- Monitor API usage for anomalies
- Keep the application and dependencies updated

## API Key Management

This project requires API keys for:
- Replicate API (`REPLICATE_API_TOKEN`)
- FAL.ai API (`FAL_API_KEY`)
- Bria API (`BRIA_API_KEY`)
- AWS S3 or MinIO (`S3_ACCESS_KEY`, `S3_SECRET_KEY`)

**Important:**
1. Copy `.env.example` to `.env`
2. Add your actual keys to `.env`
3. Never commit `.env` to version control
4. Use separate keys for development and production

## Disclosure Policy

We follow responsible disclosure practices and will coordinate with you on timing of public disclosure.

## Security Updates

Security updates will be released as patch versions and announced via:
- GitHub Security Advisories
- Release notes
- Project README

## Acknowledgments

We appreciate security researchers who responsibly disclose vulnerabilities to help keep our users safe.
