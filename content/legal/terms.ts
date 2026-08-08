import type { LegalData } from "@/components/legal/legal-page"

// Ported from old_mrdoge-co's (landing)/terms/page.tsx. The entity info,
// eligibility, acceptable use, IP, liability, and governing-law sections
// are still accurate as written. What changed since: the SDK moved off
// pay-as-you-go credits onto the current Starter/Growth/Business
// subscription tiers (Stripe recurring billing, 7-day trial), so the
// "Credits and Pricing" section was rewritten as "Subscriptions and
// Billing" to match. Dashboard URL updated to dashboard.mrdoge.co (the
// dashboard now owns its own subdomain, not a /dashboard path under
// mrdoge.ai or mrdoge.co).
export const termsData: LegalData = {
  title: "Terms of Service",
  lastUpdated: "August 8, 2026",
  noticeTitle: "Important Notice",
  noticeText:
    "Mr. Doge provides sports odds data and API services for informational and development purposes. You are responsible for ensuring your use of our API complies with all applicable laws in your jurisdiction.",
  sections: [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      content:
        'By accessing or using the Mr. Doge API and services ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service. We reserve the right to modify these terms at any time, and your continued use of the Service constitutes acceptance of any changes.',
    },
    {
      id: "service",
      title: "Description of Service",
      content: "Mr. Doge is a sports odds data API platform that provides developers and businesses with:",
      items: [
        "Real-time sports odds data from bookmakers",
        "AI-powered predictions and betting insights",
        "Event, team, and competition data across multiple sports",
        "HTTP and WebSocket API access with comprehensive documentation",
        "Usage analytics and monitoring dashboard",
        "API key management and access controls",
      ],
      note: "The Service is provided as a data and software platform. We do not operate as a bookmaker, accept wagers, or facilitate gambling transactions.",
    },
    {
      id: "eligibility",
      title: "Eligibility Requirements",
      content: "To use Mr. Doge, you must:",
      items: [
        "Be at least 18 years old or the age of majority in your jurisdiction",
        "Have the legal capacity to enter into binding contracts",
        "Provide accurate and complete registration information",
        "Comply with all applicable laws regarding use of sports data and gambling information",
        "Not be located in a jurisdiction where access to gambling-related data is prohibited",
      ],
      note: "We reserve the right to verify your eligibility and may suspend or terminate access if you do not meet these requirements.",
    },
    {
      id: "account",
      title: "Account Registration and Security",
      subsections: [
        {
          id: "registration",
          title: "Account Creation",
          content: "When creating an account, you agree to:",
          items: [
            "Provide accurate, current, and complete information",
            "Maintain and update your information to keep it accurate",
            "Maintain the security and confidentiality of your account credentials",
            "Notify us immediately of any unauthorized access or security breach",
            "Be responsible for all activities that occur under your account",
          ],
        },
        {
          id: "api-keys",
          title: "API Keys",
          content: "API keys are used to authenticate your requests. You must:",
          items: [
            "Keep your API keys confidential and secure",
            "Not share API keys with unauthorized parties",
            "Rotate keys regularly for security",
            "Delete compromised keys immediately",
            "Use separate keys for different applications or environments",
          ],
          note: "You are responsible for any usage that occurs with your API keys, even if used by unauthorized parties due to inadequate security practices.",
        },
      ],
    },
    {
      id: "subscriptions",
      title: "Subscriptions and Billing",
      subsections: [
        {
          id: "tiers",
          title: "Subscription Tiers",
          content: "Mr. Doge SDK access is sold on three subscription tiers: Starter, Growth, and Business. Key points:",
          items: [
            "Each tier unlocks a different set of API methods, request-rate limits, and WebSocket subscription caps",
            "Subscriptions are billed monthly or annually, in advance, through Stripe",
            "Every plan includes a 7-day free trial; your card is charged at the advertised price when the trial ends unless you cancel first",
            "One free trial is available per account, regardless of which tier you start on",
            "You can start a subscription, view your current plan, and manage payment methods from your developer dashboard at https://dashboard.mrdoge.co",
          ],
        },
        {
          id: "cancellation",
          title: "Cancellation and Renewal",
          content: "Regarding cancellation:",
          items: [
            "You may cancel your subscription at any time from the dashboard; cancellation takes effect at the end of your current billing period, and you keep access until then",
            "You can reactivate a canceled subscription any time before the period ends",
            "Subscriptions renew automatically at the end of each billing period unless canceled beforehand",
          ],
        },
        {
          id: "billing-general",
          title: "Billing",
          content: "Regarding payments generally:",
          items: [
            "All purchases are processed securely through Stripe; we do not store your card details",
            "You are responsible for all charges incurred under your account",
            "We reserve the right to change pricing with 30 days notice to existing subscribers",
            "Enterprise customers may have custom pricing and billing terms, negotiated separately",
          ],
        },
      ],
    },
    {
      id: "acceptable-use",
      title: "Acceptable Use Policy",
      content: "You agree NOT to:",
      items: [
        "Use the Service for any illegal purpose or in violation of any laws",
        "Attempt to reverse engineer, decompile, or discover source code of the Service",
        "Use the Service to create a competing product or service",
        "Exceed rate limits or attempt to bypass usage restrictions",
        "Share your API keys or account access with unauthorized parties",
        "Use automated tools to create fake accounts or abuse trial offers",
        "Resell, redistribute, or sublicense API data without authorization (see Section 9 below for what does and doesn't require an Enterprise license)",
        "Attempt to overwhelm, disrupt, or compromise the Service infrastructure",
        "Use the Service to transmit malware, viruses, or malicious code",
        "Scrape, harvest, or collect user data from the Service",
      ],
      note: "Violation of this policy may result in immediate suspension or termination of your account without refund.",
    },
    {
      id: "api-usage",
      title: "API Usage and Limitations",
      content: "Your use of the Mr. Doge API is subject to the following terms:",
      items: [
        "**Rate Limits**: API requests are subject to rate limits based on your subscription tier",
        "**Fair Use**: You must use the API in accordance with fair use principles",
        "**Attribution**: When displaying odds data, you should provide appropriate attribution where reasonable",
        "**Caching**: You may cache API responses for reasonable periods but must respect data freshness requirements",
        "**No Guarantee**: While we strive for accuracy, we do not guarantee the correctness or completeness of data",
        "**Service Availability**: We target 99.9% uptime but do not guarantee uninterrupted access",
      ],
    },
    {
      id: "redistribution",
      title: "Data Use and Redistribution",
      content:
        "The Mr. Doge SDK is licensed for direct integration with your own applications. The following uses require a separate Enterprise license, which is sales-led and negotiated case-by-case:",
      items: [
        "Operating a proxy, relay, or fan-out service that redistributes Mr. Doge data to third-party end-users (whether or not you charge for it)",
        "Reselling the data stream, in whole or in part, to other developers or organizations",
        "Bulk-archiving the data for redistribution, white-label, or aggregator products",
        "Embedding the SDK in a software product where the data is the primary value proposition for that product's customers",
      ],
      note: "Routine consumption inside a single application you operate (for example, powering an app, website, or internal dashboard for your own end-users) does not require an Enterprise license. Contact support@mrdoge.co for Enterprise terms or if you are unsure whether your use case requires one.",
    },
    {
      id: "data-accuracy",
      title: "Data Accuracy and Disclaimers",
      subsections: [
        {
          id: "no-warranty",
          title: "No Warranty of Accuracy",
          content: "While we strive to provide accurate and up-to-date information:",
          items: [
            "Odds data may contain errors or be outdated",
            "AI predictions are probabilistic and not guaranteed to be accurate",
            "Event data and statistics are provided as-is from third-party sources",
            "We are not responsible for decisions made based on our data",
            "You should verify critical information with primary sources",
          ],
        },
        {
          id: "ai-predictions",
          title: "AI Predictions Disclaimer",
          content: "Regarding AI-powered features:",
          items: [
            "AI predictions are based on statistical models and historical data",
            "Past performance does not guarantee future results",
            "Predictions should be used as one input among many in decision-making",
            "We make no guarantees about prediction accuracy or profitability",
            "AI models are continuously updated and may produce different results over time",
          ],
        },
      ],
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property Rights",
      content:
        "All content, software, algorithms, designs, trademarks, and functionality of Mr. Doge are owned by us or our licensors and are protected by intellectual property laws. You may not:",
      items: [
        "Copy, reproduce, or redistribute our software or proprietary algorithms",
        "Use our trademarks, logos, or branding without written authorization",
        "Create derivative works based on our Service",
        "Remove or alter any copyright, trademark, or proprietary notices",
        "Claim ownership of any data, predictions, or analysis generated by our Service",
      ],
      note: "You retain ownership of any original applications or content you create using our API, subject to these Terms.",
    },
    {
      id: "third-party",
      title: "Third-Party Services and Data",
      content: "Mr. Doge integrates with third-party data providers and services. We are not responsible for:",
      items: [
        "The accuracy, completeness, or timeliness of third-party data",
        "Changes to third-party APIs or data availability",
        "The terms, policies, or practices of third-party providers",
        "Interruptions in service due to third-party issues",
      ],
      note: "When you use our Service to access third-party bookmakers or services, you are subject to their terms and conditions.",
    },
    {
      id: "limitation-liability",
      title: "Limitation of Liability",
      content: "To the fullest extent permitted by law, Mr. Doge and its operators shall not be liable for:",
      items: [
        "Any direct, indirect, incidental, or consequential damages",
        "Financial losses resulting from use of our data or predictions",
        "Service interruptions, errors, or data inaccuracies",
        "Loss of data, profits, or business opportunities",
        "Unauthorized access to your account due to inadequate security practices",
        "Any damages exceeding the amount you paid for the Service in the past 12 months",
      ],
      note: "THE SERVICE IS PROVIDED 'AS IS' AND 'AS AVAILABLE' WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.",
    },
    {
      id: "indemnification",
      title: "Indemnification",
      content:
        "You agree to indemnify, defend, and hold harmless Mr. Doge, its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including legal fees) arising from:",
      items: [
        "Your use or misuse of the Service",
        "Your violation of these Terms of Service",
        "Your violation of any laws or regulations",
        "Your violation of any third-party rights",
        "Content or applications you create using our API",
      ],
    },
    {
      id: "termination",
      title: "Termination and Suspension",
      content:
        "We reserve the right to suspend or terminate your access to Mr. Doge at any time, with or without cause or notice, including but not limited to:",
      items: [
        "Violation of these Terms of Service",
        "Fraudulent activity or payment disputes",
        "Abuse of the Service or excessive usage that impacts other users",
        "Extended periods of inactivity (180+ days)",
        "Legal or regulatory requirements",
      ],
      note: "Upon termination, your right to access the Service immediately ceases and any active subscription is canceled. We may retain certain data as required by law or for legitimate business purposes.",
    },
    {
      id: "changes",
      title: "Changes to Service and Terms",
      content: "We reserve the right to:",
      items: [
        "Modify, suspend, or discontinue the Service (or any part thereof) at any time",
        "Update these Terms of Service with or without prior notice",
        "Change pricing, tiers, or feature availability",
        "Impose new limitations on API usage or access",
      ],
      note: "Material changes will be communicated via email or dashboard notification. Continued use after changes constitutes acceptance of modified terms.",
    },
    {
      id: "governing-law",
      title: "Governing Law and Disputes",
      content:
        "These Terms of Service are governed by and construed in accordance with applicable laws. Any disputes arising from your use of Mr. Doge shall be resolved through:",
      items: [
        "Good faith negotiation between the parties",
        "Binding arbitration if negotiation fails (except where prohibited by law)",
        "Applicable courts only for matters not subject to arbitration",
      ],
      note: "You waive any right to participate in class-action lawsuits or class-wide arbitration against Mr. Doge.",
    },
    {
      id: "general",
      title: "General Provisions",
      content: "Additional terms:",
      items: [
        "**Entire Agreement**: These Terms constitute the entire agreement between you and Mr. Doge",
        "**Severability**: If any provision is found invalid, the remaining provisions remain in effect",
        "**No Waiver**: Our failure to enforce any right or provision does not constitute a waiver",
        "**Assignment**: You may not assign these Terms without our consent; we may assign without restriction",
        "**Force Majeure**: We are not liable for delays or failures due to circumstances beyond our control",
      ],
    },
    {
      id: "legal-entity",
      title: "Legal Entity Information",
      content: "Mr. Doge is the trade name (nome fantasia) of the following Brazilian legal entity:",
      items: ["**Company name (razão social)**: RECHRON PAYMENT SOLUTIONS LTDA", "**CNPJ**: 61.130.743/0001-70"],
      note: 'All references to "Mr. Doge," "we," "us," or "our" in this document refer to RECHRON PAYMENT SOLUTIONS LTDA.',
    },
    {
      id: "contact",
      title: "Contact Information",
      content: "For questions, concerns, or support regarding these Terms of Service, please contact us at:",
      contact: {
        email: "support@mrdoge.co",
        website: "https://mrdoge.co",
      },
    },
  ],
}
