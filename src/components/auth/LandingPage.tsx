import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#292524] text-gray-100 font-sans">
      {/* Header */}
      <header className="px-6 py-6 md:px-12 max-w-6xl mx-auto">
        <div className="text-4xl md:text-5xl font-special font-bold tracking-tight text-[#fbbf24]">
          Wayfare
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col-reverse md:flex-row items-center justify-between gap-12 px-6 md:px-12 max-w-6xl mx-auto py-12">
        {/* Left: Text content */}
        <div className="flex-1 flex flex-col gap-6 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white">
            Discover. Journal. Share Your Journey.
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Wayfare is your personal map-based journal. Capture your experiences
            and pin your posts to the places that shaped them.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-4">
            <Link
              to="/register"
              className="bg-teal-400 text-[#121212] px-6 py-3 rounded-full font-medium text-sm sm:text-base hover:bg-teal-500 transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="border border-gray-500 text-gray-300 px-6 py-3 rounded-full font-medium text-sm sm:text-base hover:border-teal-400 hover:text-teal-400 transition-colors"
            >
              I already have an account
            </Link>
          </div>
        </div>

        {/* Right: Hero Image placeholder */}
        <div className="flex-1 flex justify-center md:justify-end">
            <img className="home-logo" src="/src/assets/park-jon.svg" alt="Bash Stash Hero">
            </img>
          </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Wayfare. All rights reserved.
      </footer>
    </div>
  );
}
