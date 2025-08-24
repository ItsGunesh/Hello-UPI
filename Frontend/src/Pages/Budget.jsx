import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Budget() {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");

  const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFD93D", "#6A4C93"];

  const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const savings = income - totalExpenses;

  const chartData = [
    ...expenses.map((exp) => ({ name: exp.name, value: exp.amount })),
    { name: "Savings", value: savings > 0 ? savings : 0 },
  ];

  const handleAddExpense = () => {
    if (!expenseName || !expenseAmount) return;
    setExpenses([
      ...expenses,
      { name: expenseName, amount: parseFloat(expenseAmount) },
    ]);
    setExpenseName("");
    setExpenseAmount("");
  };

  const handleReset = () => {
    setIncome(0);
    setExpenses([]);
  };

  return (
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        💰 Budget Analyzer
      </h1>

      {/* Income Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
          gap: "20px",
        }}
      >
        <div
          style={{
            flex: 1,
            padding: "20px",
            background: "#f1f5f9",
            borderRadius: "12px",
            boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Set Income</h3>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(parseFloat(e.target.value))}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {/* Add Expense */}
        <div
          style={{
            flex: 2,
            padding: "20px",
            background: "#f1f5f9",
            borderRadius: "12px",
            boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Add Expense</h3>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder="Expense Name"
              value={expenseName}
              onChange={(e) => setExpenseName(e.target.value)}
              style={{
                flex: 2,
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="number"
              placeholder="Amount"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <button
              onClick={handleAddExpense}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                background: "#2563eb",
                color: "white",
                fontWeight: "bold",
              }}
            >
              ➕ Add
            </button>
          </div>
        </div>
      </div>

      {/* Summary + Chart */}
      <div style={{ display: "flex", gap: "20px", marginTop: "30px" }}>
        {/* Summary Card */}
        <div
          style={{
            flex: 1,
            padding: "20px",
            background: "#fef9c3",
            borderRadius: "12px",
            boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h3>📊 Summary</h3>
          <p><strong>Total Income:</strong> ₹{income}</p>
          <p><strong>Total Expenses:</strong> ₹{totalExpenses}</p>
          <p><strong>Savings:</strong> ₹{savings}</p>

          <button
            onClick={handleReset}
            style={{
              marginTop: "15px",
              padding: "8px 15px",
              borderRadius: "8px",
              border: "none",
              background: "#ef4444",
              color: "white",
              fontWeight: "bold",
            }}
          >
            🔄 Reset
          </button>
        </div>

        {/* Chart Card */}
        <div
          style={{
            flex: 2,
            padding: "20px",
            background: "#f1f5f9",
            borderRadius: "12px",
            boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h3>📈 Expense Breakdown</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                      stroke="white"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Expense List */}
      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          background: "#f9fafb",
          borderRadius: "12px",
          boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h3>📒 Expense List</h3>
        {expenses.length === 0 ? (
          <p>No expenses added yet.</p>
        ) : (
          <ul>
            {expenses.map((exp, index) => (
              <li key={index}>
                {exp.name} - ₹{exp.amount}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
