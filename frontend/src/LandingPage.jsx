import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Hero Section */}
      <header className="text-center py-20 bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
        <h1 className="text-5xl font-extrabold tracking-wide animate-fade-in">
          Welcome to <span className="text-yellow-300">BudgetBuddy</span>
        </h1>
        <p className="mt-4 text-lg font-light">
          Your personal expense tracker, made simple and powerful.
        </p>
        <Link
          to="/dashboard"
          className="mt-6 inline-block bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold text-lg shadow-md transition-transform transform hover:scale-105 hover:bg-yellow-500"
        >
          Get Started →
        </Link>
      </header>

      {/* Info Cards Section */}
      <div className="container mx-auto px-6 py-14 grid gap-8 md:grid-cols-3">
        <div className="bg-gray-800 p-8 rounded-lg text-center shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
          <h2 className="text-2xl font-semibold text-blue-300">
            📊 Track Expenses
          </h2>
          <p className="mt-3 text-gray-400">
            Monitor your daily spending in one place.
          </p>
        </div>

        <div className="bg-gray-800 p-8 rounded-lg text-center shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
          <h2 className="text-2xl font-semibold text-green-300">
            💰 Set Budgets
          </h2>
          <p className="mt-3 text-gray-400">
            Stay within limits and save smarter.
          </p>
        </div>

        <div className="bg-gray-800 p-8 rounded-lg text-center shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
          <h2 className="text-2xl font-semibold text-yellow-300">
            📈 Visualize Data
          </h2>
          <p className="mt-3 text-gray-400">
            See insights with interactive charts.
          </p>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="text-center py-14 bg-gray-800 rounded-lg mx-6 md:mx-20 shadow-lg animate-fade-in">
        <h2 className="text-3xl font-bold text-white">
          Take control of your finances today!
        </h2>
        <Link
          to="/dashboard"
          className="mt-6 inline-block bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-md transition-transform transform hover:scale-105 hover:bg-blue-600"
        >
          Start Tracking Now 🚀
        </Link>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 bg-gray-900 mt-12">
        <p className="text-gray-400">
          © 2024-25 BudgetBuddy. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;
