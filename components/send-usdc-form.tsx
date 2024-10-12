"use client";

import React, { useState } from "react";

const SendUsdcForm = () => {
  const [destinationId, setDestinationId] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const response = await fetch("/api/sendUsdc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        destinationId,
        amount,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setSuccess("Transaction successful! Transaction ID: " + data.result);
    } else {
      setError(data.error || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Destination Stellar ID"
        value={destinationId}
        onChange={(e) => setDestinationId(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Amount (USDC)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <button type="submit">Send USDC</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </form>
  );
};

export default SendUsdcForm;
