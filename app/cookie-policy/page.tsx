import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cookie Policy | Sikatrix Business Accountants",
  description: "Cookie Policy for sikatrix.com — how we use cookies and how to manage your preferences.",
  robots: { index: false, follow: false },
};

export default function CookiePolicyPage() {
  return (
    <>
      <PageHero
        label="Legal"
        title="Cookie Policy"
        subtitle="Last updated: January 2025"
        crumbs={[{ label: "Cookie Policy" }]}
        size="sm"
      />

      <section className="py-14">
        <div className="container-page max-w-3xl">
          <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-brand">
            <h2>1. What Are Cookies?</h2>
            <p>
              Cookies are small text files stored on your device when you visit a website. They help websites remember preferences, analyse traffic, and provide a better user experience.
            </p>

            <h2>2. How We Use Cookies</h2>
            <p>sikatrix.com uses cookies for the following purposes:</p>

            <h3>2.1 Strictly Necessary Cookies</h3>
            <p>
              These cookies are required for the website to function and cannot be disabled. They include session cookies that manage your interaction with forms and navigation.
            </p>

            <h3>2.2 Analytics Cookies</h3>
            <p>
              We use anonymised analytics tools to understand how visitors interact with our website — which pages are visited most, how long visitors stay, and how they found us. This helps us improve our content and user experience.
            </p>

            <h3>2.3 Functional Cookies</h3>
            <p>
              These cookies remember your preferences — such as your cookie consent choice — to improve your experience on repeat visits.
            </p>

            <h3>2.4 Marketing Cookies</h3>
            <p>
              We may use third-party cookies to track the effectiveness of any advertising campaigns. These are only set with your consent.
            </p>

            <h2>3. Cookie Consent</h2>
            <p>
              When you first visit our website, you will see a cookie consent banner. You may accept all cookies, or decline non-essential cookies. Your preference is stored locally and respected on subsequent visits.
            </p>
            <p>
              You can change your cookie preferences at any time by clearing your browser's local storage or cookies and revisiting the site.
            </p>

            <h2>4. Managing Cookies in Your Browser</h2>
            <p>
              Most browsers allow you to control cookies through their settings. You can typically:
            </p>
            <ul>
              <li>Block all cookies</li>
              <li>Block third-party cookies only</li>
              <li>Clear cookies when you close your browser</li>
              <li>Receive notifications when a cookie is being set</li>
            </ul>
            <p>
              Note that blocking cookies may affect the functionality of our website and other websites you visit.
            </p>

            <h2>5. Third-Party Cookies</h2>
            <p>
              Our website may include content from third-party services (such as Google Maps or analytics providers) that set their own cookies. We do not control these cookies. Please refer to the relevant third-party privacy policies for details.
            </p>

            <h2>6. Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy periodically. We recommend checking this page occasionally to stay informed.
            </p>

            <h2>7. Contact</h2>
            <p>
              Questions about our cookie usage: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
