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

app.listen(5000, () => console.log("Server running on port 5000"));
