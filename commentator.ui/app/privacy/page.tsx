import { LegalLayout } from "@/components/ui/legal-layout";

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <p className="text-gray-400 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
        <p>When you use Commentator.AI, we collect:</p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li>Information from your Google account (email, profile picture)</li>
          <li>YouTube video data and comments through the YouTube API</li>
          <li>Usage data to improve our services</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li>Provide and improve our AI-powered comment generation service</li>
          <li>Analyze and enhance user experience</li>
          <li>Communicate important updates</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Data Security</h2>
        <p>We implement security measures to protect your information, including:</p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li>Encryption of sensitive data</li>
          <li>Regular security audits</li>
          <li>Secure data storage practices</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Your Rights</h2>
        <p>You have the right to:</p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li>Access your personal data</li>
          <li>Request data deletion</li>
          <li>Opt-out of data collection</li>
        </ul>
      </section>
    </LegalLayout>
  );
}
