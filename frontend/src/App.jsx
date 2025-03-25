import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import BudgetBuddy from "./BudgetBuddy";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<BudgetBuddy />} />
      </Routes>
    </Router>
  );
}

export default App;
