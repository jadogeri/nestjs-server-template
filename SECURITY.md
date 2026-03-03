# Security Policy

## 1. Supported Versions
We actively provide security updates for the following versions of this template:


| Version | Supported          |
| ------- | ------------------ |
| 2.x.x   | ✅ Yes             |
| 1.x.x   | ❌ No (End of Life) |

Please ensure you are running the latest major version to receive the most recent security patches. 

## 2. Reporting a Vulnerability
If you discover a potential security vulnerability, please **do not open a public issue.** Instead, follow these steps:

*   **Email:** Send a detailed report to **security@yourdomain.com**.
*   **What to include:**
    *   A description of the vulnerability.
    *   Step-by-step instructions to reproduce the issue.
    *   The potential impact (e.g., data leak, RCE).
*   **Our Promise:** We will acknowledge your report within **48 hours** and provide a timeline for a fix. 

## 3. Disclosure Policy
We follow the principle of **Coordinated Vulnerability Disclosure**:
*   **Confidentiality:** We ask that you keep details of the vulnerability private until we have released a patch.
*   **Public Credit:** We value the community's help. With your permission, we will credit you in our `CHANGELOG.md` or a dedicated "Hall of Fame" for your contribution once the fix is live. 

## 4. Security Configuration (Best Practices)
As this is a template, the security of the final application depends on your deployment configuration. Please follow these baseline standards:

*   **Environment Variables:** **NEVER** commit `.env` files to version control. Use `.env.example` as a template and use a secrets manager in production.
*   **Security Headers:** Use [Helmet](https://github.com) in your `main.ts` to set secure HTTP headers automatically.
*   **Secrets:** Regularly rotate API keys and use secret scanning tools to prevent accidental leaks of credentials. 

---
*Pro Tip: If you host on GitHub, you can use the **Security Policy Setup Tool** under the "Security" tab of your repo to generate a basic template automatically.* 
