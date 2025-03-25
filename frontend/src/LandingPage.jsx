import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <header className="text-center py-20 bg-blue-600">
        <h1 className="text-4xl font-bold">Welcome to BudgetBuddy</h1>
        <p className="mt-2 text-lg">Your personal expense tracker.</p>
        <Link
          to="/dashboard"
          className="mt-4 inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold"
        >
          Get Started
        </Link>
      </header>

      {/* Info Cards Section */}
      <div className="container mx-auto px-6 py-10 grid md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <h2 className="text-xl font-bold">Track Expenses</h2>
          <p className="mt-2">Monitor your daily spending in one place.</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <h2 className="text-xl font-bold">Set Budgets</h2>
          <p className="mt-2">Stay within limits and save smarter.</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <h2 className="text-xl font-bold">Visualize Data</h2>
          <p className="mt-2">See insights with interactive charts.</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 bg-gray-800 mt-10">
        <p>© 2024-25 BudgetBuddy. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
