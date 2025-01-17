import { LegalLayout } from "@/components/ui/legal-layout";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <LegalLayout title="Contact Us">
      <div className="max-w-2xl">
        <p className="text-gray-400 mb-8">
          Have questions or need assistance? We&apos;re here to help. Choose the best way to reach us below.
        </p>

        <div className="space-y-8">
          <section className="bg-secondary/30 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Email Support</h2>
            <p className="text-gray-400 mb-4">For general inquiries and support:</p>
            <Button variant="outline" className="w-full sm:w-auto">
              <a href="mailto:support@commentator.ai">support@commentator.ai</a>
            </Button>
          </section>

          <section className="bg-secondary/30 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Business Inquiries</h2>
            <p className="text-gray-400 mb-4">For partnerships and business opportunities:</p>
            <Button variant="outline" className="w-full sm:w-auto">
              <a href="mailto:business@commentator.ai">business@commentator.ai</a>
            </Button>
          </section>

          <section className="bg-secondary/30 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Follow Us</h2>
            <p className="text-gray-400 mb-4">Stay updated with our latest news and features:</p>
            <div className="flex gap-4">
              <Button variant="outline" className="w-full sm:w-auto">
                <a href="https://twitter.com/commentator_ai" target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
              </Button>
              <Button variant="outline" className="w-full sm:w-auto">
                <a href="https://linkedin.com/company/commentator-ai" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </LegalLayout>
  );
}
