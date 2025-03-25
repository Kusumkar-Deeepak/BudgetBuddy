require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "https://budgetbudddy.onrender.com", // Allow only your frontend
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.options("*", cors()); // Handle preflight requests
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Schema for Transactions
const TransactionSchema = new mongoose.Schema({
  type: String, // "income" or "expense"
  category: String,
  amount: Number,
  date: { type: Date, default: Date.now },
  userEmail: String, // Store transactions per user
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

// Schema for Users
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model("User", UserSchema);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  secure: true, // Force secure connection
});

// 🟢 API to Add Transactions
app.post("/api/transaction", async (req, res) => {
  const newTransaction = new Transaction(req.body);
  await newTransaction.save();
  res.json({ message: "Transaction Added!" });
});

// 🔵 API to Get All Transactions for a User
app.get("/api/transactions/:email", async (req, res) => {
  const transactions = await Transaction.find({ userEmail: req.params.email });
  res.json(transactions);
});

// 🟠 API to Update Transactions
app.put("/api/transaction/:id", async (req, res) => {
  await Transaction.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Transaction Updated!" });
});

// 🟣 API to Get User Info
app.get("/api/user/:email", async (req, res) => {
  const user = await User.findOne({ email: req.params.email });
  res.json(user);
});

// 🟡 API to Register User
app.post("/api/user", async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) return res.json({ message: "User already exists" });

  const newUser = new User(req.body);
  await newUser.save();
  res.json({ message: "User Registered" });
});

// 🟢 API to Delete a Transaction
app.delete("/api/transaction/:id", async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Transaction Deleted!" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting transaction" });
  }
});

// Function to send low balance email
const sendLowBalanceEmail = async (email, balance) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "⚠️ Low Balance Alert",
    text: `Your BudgetBuddy balance is low: ₹${balance}. Please review your transactions!`,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Low balance email sent successfully:", result);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

// Check balance after transaction addition
const checkAndSendLowBalanceEmail = async (userEmail) => {
  console.log(`🔍 Checking balance for user: ${userEmail}`);

  const transactions = await Transaction.find({ userEmail });

  console.log(
    `📊 Found ${transactions.length} transactions for user ${userEmail}`
  );

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  console.log(`💰 Balance calculated: ₹${balance}`);

  if (balance < 500) {
    console.log("⚠️ Balance is low, sending email...");
    sendLowBalanceEmail(userEmail, balance);
  } else {
    console.log("✅ Balance is sufficient, no email needed.");
  }
};

// Modify the add transaction API to check balance
app.post("/api/transaction", async (req, res) => {
  try {
    const newTransaction = new Transaction(req.body);
    await newTransaction.save();
    res.json({ message: "Transaction Added!" });

    // Check balance after adding transaction
    checkAndSendLowBalanceEmail(req.body.userEmail);
  } catch (error) {
    res.status(500).json({ error: "Error adding transaction" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
