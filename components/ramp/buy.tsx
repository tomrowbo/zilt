'use client'

import React, { useState, useEffect } from 'react';
import { openWalletModal } from "@/app/lib/stellarWalletsKey";
import CurrencySelect from './currencySelect';
import Image from 'next/image';

const Buy: React.FC = () => {
  const [buyAmount, setBuyAmount] = useState(0);
  const [buyCurrency, setBuyCurrency] = useState('USDC');
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [receiveAmount, setReceiveAmount] = useState(0);
  const [receiveCurrency, setReceiveCurrency] = useState('MPESA');
  const [mobileNumber, setMobileNumber] = useState('');
  const [stellarAddress, setStellarAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    TZ: { name: 'TZ', image: '/images/tz.svg' },
    ZW: { name: 'ZW', image: '/images/ecocash.svg' },
    KE: { name: 'KE', image: '/images/ke.svg' },
  };

  return (
    <>
      {/* Add your buy form here, similar to the sell form in the original component */}
      {/* Use the state variables and functions defined above */}
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
        <div className="text-sm text-gray-500 mb-2">YOU SELL</div>
        <div className="flex justify-between items-center">
          <input
            type="number"
            value={buyAmount}
            onChange={(e) => setBuyAmount(parseFloat(e.target.value))}
            className="text-2xl font-semibold w-1/2 bg-transparent focus:outline-none"
          />
          <CurrencySelect 
            value={buyCurrency}
            onChange={setBuyCurrency}
            options={['USDC']}
          />
        </div>
      </div>

      < div className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="text-sm text-gray-500 mb-2">YOU RECEIVE </div>
        <div className="flex justify-between items-center">
          <input
            type="number"
            value={receiveAmount}
            onChange={(e) => setReceiveAmount(parseFloat(e.target.value))}
            className="text-2xl font-semibold w-1/2 bg-transparent focus:outline-none"
          />
          <CurrencySelect 
            value={receiveCurrency}
            onChange={setReceiveCurrency}
            options={['MPESA', 'ECOCASH']}
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
    </>
    </>
  );
};

export default Buy;
