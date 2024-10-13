'use client'

import React, { useState, useEffect } from 'react';
import CurrencySelect from './currencySelect';
import Image from 'next/image';

const Buy: React.FC = () => {
  const [buyAmount, setBuyAmount] = useState();
  const [buyCurrency, setBuyCurrency] = useState('TZS');
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [receiveAmount, setReceiveAmount] = useState();
  const [receiveCurrency, setReceiveCurrency] = useState('USDC');
  const [mobileNumber, setMobileNumber] = useState('');

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
    let convertedAmount = 0;
    if (buyCurrency === 'TZS') {
      convertedAmount = buyAmount / 2300;
    } else if (buyCurrency === 'KES') {
      convertedAmount = buyAmount / 140;
    }
    if (buyCurrency === 'USD'){
        convertedAmount = receiveAmount 
    }
    setReceiveAmount(Number(convertedAmount.toFixed(2)));
  }, [buyAmount, buyCurrency]);

  const handleBuyAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setBuyAmount(isNaN(value) ? 0 : value);
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

      < div className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="text-sm text-gray-500 mb-2">YOU SELL </div>
        <div className="flex justify-between items-center">
          <input
            type="number"
            value={buyAmount}
            onChange={handleBuyAmountChange}
            className="text-2xl font-semibold w-1/2 bg-transparent focus:outline-none"
          />
          <CurrencySelect 
            value={buyCurrency}
            onChange={setBuyCurrency}
            options={['TZS', 'KES']}
          />
        </div>
      </div>


      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="text-sm text-gray-500 mb-2">YOU RECIEVE</div>
        <div className="flex justify-between items-center">
          <input
            type="number"
            value={receiveAmount}
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
      >
        Connect Wallet
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
