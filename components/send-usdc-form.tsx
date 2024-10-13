"use client";

import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const storedAddress = localStorage.getItem('stellarAddress');
    if (storedAddress) {
      setDestinationId(storedAddress);
    }
  }, []);

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
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Send USDC</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
            Stellar Address
          </label>
          <input
            type="text"
            id="destination"
            value={destinationId}
            onChange={(e) => setDestinationId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount (USDC)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Send USDC
        </button>
        {error && <p className="mt-4 text-red-600">{error}</p>}
        {success && <p className="mt-4 text-green-600">{success}</p>}
      </form>
    </div>
  );
};

export default SendUsdcForm;