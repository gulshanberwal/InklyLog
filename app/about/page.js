// app/about/page.js

export const metadata = {
  title: "About - InklyLog",
  description: "Learn more about InklyLog and the people behind it.",
};

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-20 text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-4 text-blue-600">About InklyLog</h1>
      <p className="mb-6 text-gray-700 dark:text-gray-300 text-lg">
        InklyLog is a blogging platform that empowers users to express themselves, share knowledge,
        and connect with others through powerful storytelling.
      </p>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">✨ Key Features</h2>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
          <li>Create and publish blogs with Markdown or Rich Text</li>
          <li>Follow other creators and grow your network</li>
          <li>Like and comment on posts</li>
          <li>Real-time chat and private messaging</li>
          <li>Customizable profiles</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">👨‍💻 Our Mission</h2>
        <p className="text-gray-700 dark:text-gray-300">
          We believe that everyone has a story worth telling. InklyLog is built to make sharing thoughts and ideas easy, fast,
          and enjoyable — for everyone, from casual writers to professional bloggers.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">👥 Meet the Creator</h2>
        <p className="text-gray-700 dark:text-gray-300">
          InklyLog is proudly created by a passionate developer who loves clean UI, scalable architecture, and meaningful content.
          This platform is constantly evolving to bring you the best blogging experience.
        </p>
      </section>
    </main>
  );
}
