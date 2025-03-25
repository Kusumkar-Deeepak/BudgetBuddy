import { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddIcon from "@mui/icons-material/Add";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CategoryIcon from "@mui/icons-material/Category";

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("Salary");
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // Fetch stored user and transactions on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      fetchTransactions(storedUser.email);
    } else {
      setShowPopup(true);
    }
  }, []);

  // Fetch transactions from API
  const fetchTransactions = async (email) => {
    try {
      const res = await axios.get(
        `https://budgetbuddy-bqtx.onrender.com/api/transactions/${email}`
      );
      setTransactions(res.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // Handle user submission
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    const newUser = { name: e.target.name.value, email: e.target.email.value };

    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
    setShowPopup(false);

    try {
      await axios.post(
        "https://budgetbuddy-bqtx.onrender.com/api/user",
        newUser,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      fetchTransactions(newUser.email);
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  // Add a new transaction
  const addTransaction = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      return alert("Enter a valid amount!");
    }

    const newTransaction = {
      type,
      category,
      amount: Number(amount),
      userEmail: user.email,
      date: new Date().toISOString(),
    };

    try {
      await axios.post(
        "https://budgetbuddy-bqtx.onrender.com/api/transaction",
        newTransaction,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setTransactions([...transactions, newTransaction]);
      setAmount("");
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  // Calculate income and expenses
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Prepare expense data for Pie chart
  const expenseCategories = transactions.filter((t) => t.type === "expense");

  const expenseData = expenseCategories.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(expenseData),
    datasets: [
      {
        data: Object.values(expenseData),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4CAF50",
          "#9966FF",
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* User Registration Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-75">
          <form
            onSubmit={handleUserSubmit}
            className="bg-white text-black p-6 rounded shadow-lg"
          >
            <h2 className="text-xl font-bold mb-4">Enter Your Details</h2>
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="block p-2 border my-2 w-full"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="block p-2 border my-2 w-full"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 px-4 py-2 text-white w-full"
            >
              Submit
            </button>
          </form>
        </div>
      )}
      <h1 className="text-2xl font-bold text-center">Welcome to BudgetBuddy</h1>
      {/* User Dashboard */}
      {user && (
        <div>
          {/* User Info */}
          <div className="flex items-center space-x-4">
            <AccountCircleIcon className="text-5xl" />
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p>{user.email}</p>
            </div>
          </div>

          {/* Balance Summary */}
          <div className="mt-6 bg-gray-800 p-4 rounded shadow-md">
            <h2 className="text-lg font-bold">
              Balance: ₹{totalIncome - totalExpense}
            </h2>
            <p className="text-green-400">Income: ₹{totalIncome}</p>
            <p className="text-red-400">Expenses: ₹{totalExpense}</p>
          </div>

          {/* Add Transaction */}
          <div className="mt-6 bg-gray-800 p-4 rounded shadow-md">
            <h2 className="text-lg font-bold mb-2">Add Transaction</h2>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="p-2 border rounded w-1/4 text-black"
              />
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="p-2 border rounded w-1/4 text-black"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="p-2 border rounded w-1/4 text-black"
              >
                <option value="Salary">Salary</option>
                <option value="Food">Food</option>
                <option value="Rent">Rent</option>
                <option value="Shopping">Shopping</option>
                <option value="Entertainment">Entertainment</option>
              </select>
              <button
                onClick={addTransaction}
                className="bg-blue-600 px-4 py-2 text-white rounded"
              >
                <AddIcon />
              </button>
            </div>
          </div>

          {/* Expense Pie Chart */}
          {expenseCategories.length > 0 && (
            <div className="mt-6 flex justify-center">
              <div className="w-60 h-60">
                {" "}
                {/* Adjust width and height */}
                <h2 className="text-xl font-bold mb-2 text-center">
                  Expense Breakdown
                </h2>
                <Pie
                  data={chartData}
                  options={{ maintainAspectRatio: false }}
                />
              </div>
            </div>
          )}

          {/* Transactions List */}
          <div className="mt-6">
            <h2 className="text-xl font-bold">Transactions</h2>
            {transactions.map((t, index) => (
              <div
                key={index}
                className={`p-2 my-2 flex items-center space-x-2 rounded ${
                  t.type === "income" ? "bg-green-600" : "bg-red-600"
                }`}
              >
                <CategoryIcon />
                <span>
                  {t.category}: ₹{t.amount}
                </span>
                <span className="ml-auto text-sm">
                  {new Date(t.date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
