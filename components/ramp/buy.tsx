'use client'

import React, { useState, useEffect } from 'react';
import { openWalletModal } from "@/app/lib/stellarWalletsKey";
import CurrencySelect from './currencySelect';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Modal from '../modal';
import { signTransaction, submitTransaction } from '@/components/send-usdc-form';

const Buy: React.FC = () => {
  const [buyAmount, setBuyAmount] = useState<number | undefined>(undefined);
  const [buyCurrency, setBuyCurrency] = useState('TZS');
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [receiveAmount, setReceiveAmount] = useState<number | undefined>(undefined);
  const [receiveCurrency, setReceiveCurrency] = useState('USDC');
  const [mobileNumber, setMobileNumber] = useState('');
  const [stellarAddress, setStellarAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedAddress = localStorage.getItem('stellarAddress');
    if (savedAddress) {
      setStellarAddress(savedAddress);
    }
  }, []);

  const handleStellarLogin = async () => {
    setIsLoading(true);
    try {
      const address = await openWalletModal();
      if (address) {
        setStellarAddress(address);
        localStorage.setItem('stellarAddress', address);
      }
    } catch {
      alert("Failed to connect with Stellar wallet.");
    } finally {
      setIsLoading(false);
    }
  };

  const paymentMethods = {
    mpesa: { name: 'MPESA', image: '/images/mpesa.svg' },
    ecocash: { name: 'ECOCASH', image: '/images/ecocash.svg' },
  };

  const currencies = {
    TZS: { name: 'TZS', image: '/images/tz.svg' },
    USD: { name: 'USD', image: '/images/zw.svg' },
    KES: { name: 'KES', image: '/images/ke.svg' },
  };

  useEffect(() => {
    if (buyAmount === undefined) return;

    let convertedAmount = 0;
    if (buyCurrency === 'TZS') {
      convertedAmount = buyAmount / 2300;
    } else if (buyCurrency === 'KES') {
      convertedAmount = buyAmount / 140;
    } else if (buyCurrency === 'USD') {
      convertedAmount = buyAmount;
    }
    setReceiveAmount(Number(convertedAmount.toFixed(2)));
  }, [buyAmount, buyCurrency]);

  const handleBuyAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setBuyAmount(isNaN(value) ? undefined : value);
  };

  const initiatePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/initiatePayment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobileNumber,
          amount: buyAmount,
          currency: buyCurrency,
        }),
      });

      const data = await response.json();
      console.log('Payment initiation response:', data);
      
      if (response.ok) {
        // Payment successful, now send USDC to the user's wallet
        const sendUsdcResponse = await fetch("/api/sendUsdc", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            destinationId: stellarAddress,
            amount: receiveAmount?.toString(),
          }),
        });

        const sendUsdcData = await sendUsdcResponse.json();

        if (sendUsdcResponse.ok) {
          if (sendUsdcData.requiresTrust) {
            // Handle the case where a trust line needs to be added
            const signedTransaction = await signTransaction(sendUsdcData.transactionXDR);
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
                    destinationId: stellarAddress,
                    amount: receiveAmount?.toString(),
                  }),
                });
                const paymentData = await paymentResponse.json();
                if (paymentResponse.ok) {
                  setModalTitle('Transaction Successful');
                  setModalMessage(`Your payment has been processed and ${receiveAmount} USDC has been sent to your wallet.`);
                  setIsSuccess(true);
                } else {
                  setModalTitle('USDC Transfer Failed');
                  setModalMessage(paymentData.error || "Failed to send USDC after adding trust line");
                  setIsSuccess(false);
                }
              } else {
                setModalTitle('Trust Line Addition Failed');
                setModalMessage("Failed to add trust line for USDC");
                setIsSuccess(false);
              }
            } else {
              setModalTitle('Trust Line Declined');
              setModalMessage("You declined to add the USDC trust line");
              setIsSuccess(false);
            }
          } else {
            setModalTitle('Transaction Successful');
            setModalMessage(`Your payment has been processed and ${receiveAmount} USDC has been sent to your wallet.`);
            setIsSuccess(true);
          }
        } else {
          setModalTitle('USDC Transfer Failed');
          setModalMessage(sendUsdcData.error || "Failed to send USDC");
          setIsSuccess(false);
        }
      } else {
        setModalTitle('Payment Failed');
        setModalMessage('There was an error processing your payment. Please try again.');
        setIsSuccess(false);
      }
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error initiating payment:', error);
      setModalTitle('Error');
      setModalMessage('An unexpected error occurred. Please try again later.');
      setIsSuccess(false);
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="text-sm text-gray-500 mb-2">Payment Method</div>
        <div className="flex space-x-2">
          {Object.entries(paymentMethods).map(([id, method]) => (
            <button
              key={id}
              onClick={() => setPaymentMethod(id)}
              className={`flex items-center space-x-2 p-2 rounded-md border ${
                paymentMethod === id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Image src={method.image} alt={method.name} width={24} height={24} />
              <span>{method.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="text-sm text-gray-500 mb-2">YOU SELL </div>
        <div className="flex justify-between items-center">
          <input
            type="number"
            value={buyAmount === undefined ? '' : buyAmount}
            onChange={handleBuyAmountChange}
            className="text-2xl font-semibold w-1/2 bg-transparent focus:outline-none"
          />
          <CurrencySelect 
            value={buyCurrency}
            onChange={setBuyCurrency}
            options={['TZS', 'KES', 'USD']}
          />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="text-sm text-gray-500 mb-2">YOU RECEIVE</div>
        <div className="flex justify-between items-center">
          <input
            type="number"
            value={receiveAmount === undefined ? '' : receiveAmount}
            readOnly
            className="text-2xl font-semibold w-1/2 bg-transparent focus:outline-none"
          />
          <CurrencySelect 
            value={receiveCurrency}
            onChange={setReceiveCurrency}
            options={['USDC']}
          />
        </div>
      </div>



      <button
        className="w-full p-2 mb-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 ease-in-out"
        onClick={handleStellarLogin}
        disabled={isLoading}
      >
        {stellarAddress
          ? `Connected: ${stellarAddress.slice(0, 6)}...${stellarAddress.slice(-4)}`
          : isLoading
          ? "Connecting..."
          : "Connect Wallet"}
      </button>

      {stellarAddress && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="text-sm text-gray-500 mb-2">YOUR MOBILE NUMBER</div>
          <input
            type="tel"
            placeholder="Enter your mobile number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {stellarAddress && mobileNumber && (
        <div>
          <button
            className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 ease-in-out"
            onClick={initiatePayment}
            disabled={loading}
          >
            {loading ? 'Waiting for payment...' : 'Checkout'}
          </button>
        </div>
      )}
      <Modal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          if (isSuccess) {
            router.push('/');
          }
        }}
        title={modalTitle}
        message={modalMessage}
        isSuccess={isSuccess}
      />
  
    </>
  );
};

export default Buy;
