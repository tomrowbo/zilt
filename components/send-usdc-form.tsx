"use client";

import React, { useState } from "react";
import { kit } from '@/app/lib/stellarWalletsKey';
import { TransactionBuilder, Networks } from 'stellar-sdk';

const signTransaction = async (xdr: string) => {
  try {
    const transaction = TransactionBuilder.fromXDR(xdr, Networks.TESTNET);
    const transactionXDR = transaction.toXDR();
    const signedTransaction = await kit.signTransaction(transactionXDR);
    return signedTransaction;
  } catch (error) {
    console.error('Error signing transaction:', error);
    return null;
  }
};

const submitTransaction = async (signedXdr: string) => {
  try {
    const response = await fetch('/api/submitTransaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ signedXdr }),
    });
    return response;
  } catch (error) {
    console.error('Error submitting transaction:', error);
    return null;
  }
};

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
      if (data.requiresTrust) {
        // Handle the case where a trust line needs to be added
        const signedTransaction = await signTransaction(data.transactionXDR);
        if (signedTransaction) {
          // Submit the signed transaction
          const trustResponse = await submitTransaction(signedTransaction.signedTxXdr);
          if (trustResponse && trustResponse.ok) {
            // Trust line added successfully, now send the payment
            const paymentResponse = await fetch("/api/sendUsdc", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                destinationId,
                amount,
              }),
            });
            const paymentData = await paymentResponse.json();
            if (paymentResponse.ok) {
              setSuccess("Transaction successful! Transaction ID: " + paymentData.result);
            } else {
              setError(paymentData.error || "Payment failed after adding trust line");
            }
          } else {
            setError("Failed to add trust line");
          }
        } else {
          setError("User declined to add trust line");
        }
      } else {
        setSuccess("Transaction successful! Transaction ID: " + data.result);
      }
    } else {
      setError(data.error || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Stellar Address"
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
