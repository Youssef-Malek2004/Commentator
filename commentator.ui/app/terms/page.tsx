export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="prose prose-invert">
        {/* Add your terms of service content here */}
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <h2>1. Terms</h2>
        <p>By accessing Commentator, you agree to these terms of service.</p>
        {/* Add more sections as needed */}
      </div>
    </div>
  );
}
