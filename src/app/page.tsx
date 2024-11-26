import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Proofread & Tone Customizer</h1>
        <p className="mb-6 text-xl text-gray-600">
          Enhance your writing with AI-powered proofreading
        </p>
        <Link
          href="/proofread"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Start Proofreading
        </Link>
      </div>
    </div>
  )
}
