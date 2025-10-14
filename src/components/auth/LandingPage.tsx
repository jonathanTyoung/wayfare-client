import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="h-screen flex flex-col bg-[#292524] text-gray-100 font-sans overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 md:px-12 max-w-6xl mx-auto w-full">
        <div className="text-3xl md:text-4xl lg:text-5xl font-special font-bold tracking-tight text-[#fbbf24]">
          Wayfare
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col-reverse lg:flex-row items-center justify-between gap-8 px-6 md:px-12 max-w-6xl mx-auto min-h-0">
        {/* Left: Text content */}
        <div className="flex-1 flex flex-col gap-4 text-center lg:text-left">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white">
            Discover. Journal. Share Your Journey.
          </h1>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            Wayfare is your personal map-based journal. Capture your experiences
            and pin your posts to the places that shaped them.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-6">
            <Link
              to="/register"
              className="bg-teal-400 text-[#121212] px-6 py-3 rounded-full font-semibold text-base hover:bg-teal-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="border border-gray-400 text-gray-300 px-6 py-3 rounded-full font-medium text-base hover:border-teal-400 hover:text-teal-400 transition-all duration-300"
            >
              I already have an account
            </Link>
          </div>
        </div>

        {/* Right: Hero Image placeholder */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <img className="w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 object-contain" src="/src/assets/park-jon.svg" alt="Wayfare Hero Illustration" />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-3 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Wayfare. All rights reserved.
      </footer>
    </div>
  );
}