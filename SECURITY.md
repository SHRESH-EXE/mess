# Security Policy & Defensive Posture

## Supported Versions

We provide security updates and defensive hardening for the following releases:

| Version | Supported          | Security Level |
| ------- | ------------------ | -------------- |
| 1.x.x   | :white_check_mark: | OWASP Level 2  |
| < 1.0   | :x:                | Deprecated     |

---

## 20-Pillar Enterprise Open-Source Security Architecture

This application adheres strictly to the 20 industry-standard security pillars:

1. **HTTPS / Transport Security**: Enforced HSTS (`max-age=31536000; includeSubDomains; preload`) and automated HTTP-to-HTTPS redirect.
2. **Content Security Policy (CSP)**: Pinned resource origins for scripts, styles, images, fonts, and WebSockets; disallows unauthorized framing.
3. **OWASP Defensive Headers**: Integrated via **Helmet** (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`).
4. **JavaScript Security & No-Eval**: Absolute zero use of `eval()` or `new Function()`; all user strings sanitized with **Cure53 DOMPurify**.
5. **Dependency Security & Subresource Integrity (SRI)**: SHA-384 cryptographic integrity hashes pinned on all CDN dependencies (`jsQR`).
6. **Zero-Leak Secrets**: Strict environment variable isolation; zero client bundle exposure; secrets redacted in server audit logs.
7. **GitHub Repository Security**: Secret scanning, push protection, branch protection rules, and minimal CI/CD token permissions.
8. **Contact & Feedback Form Anti-Abuse**: Invisible **Honeypot** spam traps, submission rate-limiting, and DOMPurify sanitization.
9. **Cryptographic Authentication**: HMAC-SHA256 session token signatures, cryptographic nonces, and 5-attempt brute-force lockouts.
10. **Multi-Layer XSS Defense**: Dual-defense strategy combining strict CSP directives with runtime DOMPurify HTML stripping.
11. **Anti-CSRF Defense**: Enforces custom request header verification (`X-Defense-CSRF`, `X-Requested-With`) and strict JSON content typing on mutating endpoints.
12. **Anti-Clickjacking Frame Defense**: CSP `frame-ancestors 'self'` and `X-Frame-Options: SAMEORIGIN` prevent unauthorized iframe wrapping.
13. **CORS Origin Whitelisting**: Zero wildcard `*` allowed on state mutations; strictly checked against approved frontend origins.
14. **Sliding-Window Rate Limiting**: In-memory IP tracking with standard HTTP 429 status and `Retry-After` headers.
15. **File Upload Safety**: Strict MIME type whitelisting (JPEG/PNG/WebP/SVG), 2MB hard size limit, and path traversal protection (`../` sanitization).
16. **Database Security (Firestore Rules)**: Declarative least-privilege role separation (`superadmin`, `restaurant_admin`, `foodcourt_admin`) with schema and timestamp validation.
17. **Scrubbed Audit Logging**: Real-time security telemetry stream with automated credential masking and risk scoring.
18. **Supply Chain Security**: Automated weekly vulnerability monitoring via **Dependabot**.
19. **Automated CI/CD Security Workflows**: Continuous SAST, secret leak detection, and dependency audits using **GitHub CodeQL**, **Semgrep OSS**, and **TruffleHog OSS**.
20. **Regular Security Audits**: Continuous verification using `npm run security:audit` and in-app Security Defense Center telemetry.

---

## Reporting a Vulnerability

If you discover a security vulnerability within this repository, please do **NOT** open a public issue.

Instead, please send an encrypted report to:
- **Security Contact**: `security-team@lovelyprofessionaluniversity.edu` or repository maintainer
- **Preferred Disclosure**: Coordinated Vulnerability Disclosure (CVD)

Please include:
1. Type of issue (e.g., XSS, CSRF, IDOR, SSRF, Information Disclosure)
2. Exact steps to reproduce or Proof-of-Concept (PoC) payload
3. Affected components or API routes
4. Any potential mitigations

We will acknowledge receipt within 24 hours and issue a CVE/patch within 72 hours for critical findings.
