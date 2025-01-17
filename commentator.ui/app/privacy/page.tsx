export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose prose-invert">
        {/* Add your privacy policy content here */}
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <h2>Information We Collect</h2>
        <p>When you use Commentator, we collect:</p>
        <ul>
          <li>Your Google account email</li>
          <li>Access to your YouTube data for comment management</li>
        </ul>
        {/* Add more sections as needed */}
      </div>
    </div>
  );
}
