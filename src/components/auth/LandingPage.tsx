import { Link } from "react-router-dom"
// import heroImage from "../assets/landing-illustration.svg"
// import logo from "../assets/wayfare-logo.svg"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans px-6 py-12 sm:px-12 grid grid-rows-[auto_1fr_auto]">
      {/* Header */}
      <header className="flex justify-between items-center max-w-6xl mx-auto mb-12">
        {/* Uncomment and update logo path if you want a logo */}
        {/* <div className="flex items-center gap-3">
          <img src={logo} alt="Wayfare Logo" className="w-8 h-8" />
          <span className="text-xl font-semibold tracking-tight">Wayfare</span>
        </div> */}
        <nav className="flex gap-4">
          <Link
            to="/login"
            className="inline-block px-6 py-2 rounded-full border-2 border-teal-600 text-teal-600 font-semibold hover:bg-teal-50 transition-colors text-base"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="inline-block px-6 py-2 rounded-full bg-teal-600 text-white font-semibold shadow-md hover:bg-teal-700 transition-colors text-base"
          >
            Register
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col sm:flex-row gap-16 items-center justify-center max-w-6xl mx-auto text-center sm:text-left">
        {/* Left: Text content */}
        <div className="flex-1 flex flex-col gap-6">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            Discover. Journal. Share Your Journey.
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
            Wayfare is your personal map-based journal. Capture your experiences and pin your stories to the places that shaped them.
          </p>
          <div className="flex gap-4 flex-col sm:flex-row justify-center sm:justify-start">
            <Link
              to="/register"
              className="bg-[var(--color-accent-teal)] text-[var(--color-bg)] hover:bg-[var(--color-accent-yellow-dark)] px-6 py-3 rounded-full font-medium text-sm sm:text-base transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="border border-[var(--color-text-secondary)] text-[var(--color-text)] hover:border-[var(--color-accent-teal)] hover:text-[var(--color-accent-teal)] px-6 py-3 rounded-full font-medium text-sm sm:text-base transition-colors"
            >
              I already have an account
            </Link>
          </div>
        </div>
        {/* Right: Hero Image (uncomment and update path if you want an image) */}
        {/* <div className="flex-1">
          <img
            src={heroImage}
            alt="Map-based journaling illustration"
            className="w-full h-auto max-w-md mx-auto"
          />
        </div> */}
      </main>

      {/* Footer */}
      <footer className="mt-20 text-center text-sm text-[var(--color-muted)]">
        &copy; {new Date().getFullYear()} Wayfare. All rights reserved.
      </footer>
    </div>
  )
}