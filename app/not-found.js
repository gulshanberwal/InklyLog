import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-blue-600">404</h1>
        <p className="mt-4 text-xl font-semibold text-gray-800 dark:text-white">Page Not Found</p>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-flex items-center mt-6 text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>
    </main>

  );
}
