import { LegalLayout } from "@/components/ui/legal-layout";

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service">
      <p className="text-gray-400 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
        <p>
          By accessing and using Commentator.AI, you agree to be bound by these Terms of Service and all applicable laws and regulations.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Service Description</h2>
        <p>
          Commentator.AI provides AI-powered comment generation and management for social media platforms. We use artificial intelligence to
          help users engage with their audience more effectively.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li>You must provide accurate information when using our service</li>
          <li>You are responsible for maintaining the security of your account</li>
          <li>You agree not to use the service for any illegal or unauthorized purpose</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
        <p>
          All content and functionality on Commentator.AI, including but not limited to text, graphics, logos, and software, is the property
          of Commentator.AI and is protected by intellectual property laws.
        </p>
      </section>
    </LegalLayout>
  );
}
