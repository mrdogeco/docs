import type { LegalData } from "@/components/legal/legal-page"

// Ported from old_mrdoge-co's (landing)/privacy/page.tsx. Corrections made
// against the actual stack (mrdoge-api's CLAUDE.md + a grep for what's
// really wired up), since the original draft named vendors that were
// either aspirational or wrong:
//  - Auth is homegrown (NextAuth + our own RS256 JWTs via mrdoge-api),
//    not Clerk/Auth0 — those were never integrated.
//  - Email is Resend (confirmed in mrdoge-api/services/EmailService.ts),
//    not SendGrid/AWS SES.
//  - AI inference runs on OpenAI (mrdoge-ai depends on @ai-sdk/openai);
//    Anthropic was never wired in, dropped.
//  - Cloud hosting: no specific provider named — the old draft's
//    "AWS, Google Cloud" wasn't verifiable against any actual infra
//    config in the repos, so this stays generic rather than asserting
//    something that might be wrong.
// Also updated: pricing/billing data now reflects Stripe subscriptions
// (not the old pay-as-you-go credit system), and the dashboard is at
// dashboard.mrdoge.co (its own subdomain, not a path under mrdoge.ai).
export const privacyData: LegalData = {
  title: "Privacy Policy",
  lastUpdated: "August 8, 2026",
  noticeTitle: "🔒 Your Privacy Matters",
  noticeText:
    "We are committed to protecting your personal information and being transparent about how we collect, use, and share your data. This policy explains your rights and our responsibilities regarding your privacy.",
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      content:
        'Mr. Doge ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our sports odds data API platform and services. By using our Service, you consent to the data practices described in this policy.',
    },
    {
      id: "information-collected",
      title: "Information We Collect",
      subsections: [
        {
          id: "account-information",
          title: "Account Information",
          content: "When you create an account, we collect:",
          items: [
            "Email address",
            "Name or display name, and profile picture if you sign in with Google",
            "Password (encrypted and hashed), if you register with email/password instead of Google",
            "Payment information (processed securely through Stripe — we never see or store your card number)",
            "Company name and business details (for enterprise accounts)",
            "Authentication tokens and session data",
          ],
        },
        {
          id: "usage-data",
          title: "API Usage and Activity Data",
          content: "We automatically collect information about your API usage:",
          items: [
            "API requests and responses (endpoint, parameters, timestamps)",
            "Subscription tier, billing history, and invoice records",
            "API keys created and their usage patterns",
            "Dashboard interactions and feature usage",
            "Error logs and debugging information",
            "Performance metrics and latency data",
          ],
        },
        {
          id: "technical-data",
          title: "Technical and Log Data",
          content: "We collect technical information for service operation and security:",
          items: [
            "IP address (used for rate limiting, fraud prevention, and analytics)",
            "Browser type, version, and device information",
            "Operating system and screen resolution",
            "Referring URLs and navigation patterns",
            "Date and time stamps of all requests",
            "Geolocation data (country/region level, not precise location)",
            "Error logs, crash reports, and diagnostic data",
          ],
        },
        {
          id: "cookies",
          title: "Cookies and Tracking Technologies",
          content: "We use cookies and similar technologies to:",
          items: [
            "Maintain your logged-in session and authentication state",
            "Remember your preferences and settings (e.g. light/dark theme)",
            "Analyze platform usage and improve performance",
            "Prevent fraud, abuse, and security threats",
            "Provide personalized dashboard experience",
          ],
          note: "You can control cookie preferences through your browser settings. Disabling cookies may limit functionality, including staying signed in.",
        },
      ],
    },
    {
      id: "how-we-use",
      title: "How We Use Your Information",
      content: "We use collected information for the following purposes:",
      items: [
        "**Service Delivery**: Provide API access, process requests, and deliver odds data and predictions",
        "**Account Management**: Create and manage accounts, authenticate users, and maintain security",
        "**Billing**: Process subscription payments through Stripe, manage plan changes, and generate invoices",
        "**Communication**: Send service updates, security alerts, billing notifications, and support responses",
        "**Analytics**: Understand usage patterns, optimize API performance, and measure service health",
        "**Product Improvement**: Develop new features, improve AI models, and enhance user experience",
        "**Fraud Prevention**: Detect and prevent abuse, unauthorized access, and fraudulent activity",
        "**Legal Compliance**: Meet regulatory requirements, respond to legal requests, and enforce our Terms",
        "**Research**: Conduct internal research on API usage trends (using aggregated, anonymized data)",
      ],
    },
    {
      id: "data-sharing",
      title: "How We Share Your Information",
      subsections: [
        {
          id: "no-selling",
          title: "We Do Not Sell Your Data",
          content: "We do not sell, rent, or trade your personal information to third parties for marketing purposes. Your data is yours.",
        },
        {
          id: "service-providers",
          title: "Service Providers and Infrastructure Partners",
          content: "We share data with trusted third-party service providers who help us operate the platform:",
          items: [
            "**Cloud hosting and infrastructure providers**: For application hosting, data storage, and delivery",
            "**Stripe**: For secure payment processing and subscription billing",
            "**Resend**: For transactional emails (magic links, receipts, notifications)",
            "**Sentry**: For error monitoring and debugging",
            "**OpenAI**: For AI-generated predictions and recommendations",
          ],
          note: "All third-party providers are contractually obligated to protect your data and use it only for specified purposes. They cannot use your data for their own purposes.",
        },
        {
          id: "odds-providers",
          title: "Sports Data and Odds Providers",
          content:
            "We integrate with third-party sports data and odds providers to deliver our service. We do not share your personal information or API usage patterns with these providers. We only receive aggregated odds data from them.",
        },
        {
          id: "aggregated-data",
          title: "Aggregated and Anonymized Data",
          content: "We may share aggregated, anonymized statistics that cannot identify individual users:",
          items: [
            "Overall API usage trends and endpoint popularity",
            "Popular sports, leagues, and betting markets",
            "General performance metrics and service health",
            "Industry benchmarks and research insights",
          ],
        },
        {
          id: "legal-disclosure",
          title: "Legal Requirements and Protection",
          content: "We may disclose your information if required by law or if we believe disclosure is necessary to:",
          items: [
            "Comply with legal processes (subpoenas, court orders, warrants)",
            "Enforce our Terms of Service and other agreements",
            "Protect our rights, property, or safety",
            "Investigate fraud, security issues, or Terms violations",
            "Respond to government, regulatory, or law enforcement requests",
            "Prevent harm to users or the public",
          ],
        },
        {
          id: "business-transfers",
          title: "Business Transfers",
          content:
            "If Mr. Doge is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction. We will notify you via email and/or prominent notice on our platform before your information is transferred and becomes subject to a different privacy policy.",
        },
      ],
    },
    {
      id: "data-retention",
      title: "Data Retention",
      content: "We retain your information for as long as necessary to provide our Service and comply with legal obligations:",
      items: [
        "**Account Data**: Retained while your account is active, plus up to 90 days after deletion for backup and recovery",
        "**API Logs**: Retained for 90 days for debugging, analytics, and billing reconciliation",
        "**Billing Records**: Retained for 7 years to comply with tax and accounting regulations",
        "**Usage Analytics**: Aggregated data may be retained indefinitely in anonymized form",
        "**Security Logs**: Retained for 1 year for fraud prevention and security investigations",
        "**Legal Compliance Data**: Retained as required by applicable laws and regulations",
      ],
      note: "You can request deletion of your data at any time by contacting support@mrdoge.co. Some data may be retained in anonymized form for analytics or as required by law.",
    },
    {
      id: "data-security",
      title: "Data Security",
      content: "We implement industry-standard security measures to protect your information:",
      items: [
        "**Encryption**: All data is encrypted in transit (HTTPS/TLS) and at rest",
        "**Access Controls**: Strict employee access policies with role-based permissions and audit logs",
        "**Authentication**: Secure password hashing using bcrypt with high cost factors; RS256-signed JWTs for API sessions",
        "**API Security**: API keys with configurable permissions and rate limiting",
        "**Monitoring**: Continuous security monitoring, threat detection, and error tracking via Sentry",
        "**Regular Audits**: Periodic security assessments and vulnerability testing",
      ],
      note: "While we implement strong security measures, no method of transmission over the internet is 100% secure. You are responsible for maintaining the confidentiality of your account credentials and API keys.",
    },
    {
      id: "your-rights",
      title: "Your Privacy Rights",
      content: "Depending on your location (particularly EU/EEA under GDPR and California under CCPA), you may have the following rights:",
      items: [
        "**Access**: Request a copy of the personal data we hold about you",
        "**Correction**: Update or correct inaccurate information in your account",
        "**Deletion**: Request deletion of your personal data (subject to legal retention requirements)",
        "**Portability**: Receive your data in a structured, machine-readable format (JSON/CSV)",
        "**Objection**: Object to certain data processing activities",
        "**Restriction**: Request we limit how we use your data",
        "**Withdrawal of Consent**: Revoke consent for data processing where applicable",
        "**Opt-Out**: Unsubscribe from marketing emails (transactional emails cannot be disabled)",
      ],
      note: "To exercise these rights, contact us at privacy@mrdoge.co or support@mrdoge.co. We will respond within 30 days. You may need to verify your identity for security purposes.",
    },
    {
      id: "international",
      title: "International Data Transfers",
      content:
        "Mr. Doge operates globally, and your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place when transferring data internationally:",
      items: [
        "Standard Contractual Clauses (SCCs) approved by the European Commission",
        "Data Processing Agreements (DPAs) with all third-party processors",
        "Compliance with GDPR, CCPA, and other applicable privacy regulations",
      ],
      note: "By using our Service, you consent to the transfer of your information to countries that may have different data protection laws than your country of residence.",
    },
    {
      id: "children",
      title: "Children's Privacy",
      content:
        "Mr. Doge is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that a child under 18 has provided us with personal data, we will take immediate steps to delete such information and terminate the account.",
    },
    {
      id: "third-party-links",
      title: "Third-Party Links and Integrations",
      content:
        "Our Service may contain links to third-party websites, services, or bookmakers. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information. This Privacy Policy applies only to information collected by Mr. Doge.",
    },
    {
      id: "california-rights",
      title: "California Privacy Rights (CCPA)",
      content: "If you are a California resident, you have additional rights under the California Consumer Privacy Act:",
      items: [
        "Right to know what personal information is collected, used, and shared",
        "Right to delete personal information (with certain exceptions)",
        "Right to opt-out of the sale of personal information (we do not sell data)",
        "Right to non-discrimination for exercising your privacy rights",
        "Right to correct inaccurate personal information",
      ],
      note: 'To exercise your CCPA rights, email us at privacy@mrdoge.co with "CCPA Request" in the subject line.',
    },
    {
      id: "gdpr-rights",
      title: "European Privacy Rights (GDPR)",
      content: "If you are located in the EU/EEA, you have rights under the General Data Protection Regulation:",
      items: [
        "Legal basis for processing: Consent, contract performance, legitimate interests, or legal obligation",
        "Right to lodge a complaint with your local data protection authority",
        "Right to data portability in a machine-readable format",
        "Right to object to automated decision-making and profiling",
        "Right to withdraw consent at any time without affecting lawfulness of prior processing",
      ],
      note: "For GDPR-related inquiries, contact us at privacy@mrdoge.co.",
    },
    {
      id: "do-not-track",
      title: "Do Not Track Signals",
      content:
        'Some browsers support a "Do Not Track" (DNT) feature. Currently, there is no industry standard for how to respond to DNT signals. Our Service does not respond to DNT browser signals, but you can control tracking through your cookie preferences and browser settings.',
    },
    {
      id: "updates",
      title: "Changes to This Privacy Policy",
      content:
        "We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other operational needs. We will notify you of material changes by:",
      items: [
        'Posting the updated policy on this page with a new "Last Updated" date',
        "Sending an email notification to your registered email address",
        "Displaying a prominent notice on your dashboard",
      ],
      note: "Your continued use of the Service after changes constitutes acceptance of the updated Privacy Policy. We encourage you to review this policy periodically.",
    },
    {
      id: "legal-entity",
      title: "Legal Entity Information",
      content:
        "Mr. Doge is the trade name (nome fantasia) of the following Brazilian legal entity, which acts as the data controller for personal information processed through our Service:",
      items: ["**Company name (razão social)**: RECHRON PAYMENT SOLUTIONS LTDA", "**CNPJ**: 61.130.743/0001-70"],
      note: 'All references to "Mr. Doge," "we," "us," or "our" in this Privacy Policy refer to RECHRON PAYMENT SOLUTIONS LTDA.',
    },
    {
      id: "contact",
      title: "Contact Us",
      content: "If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:",
      contact: {
        email: "privacy@mrdoge.co",
        support: "support@mrdoge.co",
        website: "https://mrdoge.co",
      },
      note: "For specific privacy or data protection inquiries, please use privacy@mrdoge.co. For general support, use support@mrdoge.co.",
    },
  ],
}
