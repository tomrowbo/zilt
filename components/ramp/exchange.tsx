'use client'

import React, { useState } from 'react';
import CurrencySelect from './currencySelect';

const CryptoExchange = () => {
    const [sellAmount, setSellAmount] = useState(0.165);
    const [receiveAmount, setReceiveAmount] = useState(300);
    const [sellCurrency, setSellCurrency] = useState('usdc');
    const [receiveCurrency, setReceiveCurrency] = useState('mpesa');
    const [mobileNumber, setMobileNumber] = useState('');
  
    return (
      <div className="font-sans">
        <div className="bg-white p-4 rounded-lg shadow-md max-w-md mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            <div>
              <button className="px-4 py-2 border border-gray-300 rounded-md mr-2 hover:bg-gray-100">Buy</button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Sell</button>
            </div>
          </div>
  
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="text-sm text-gray-500 mb-2">YOU SELL</div>
            <div className="flex justify-between items-center">
              <input
                type="number"
                value={sellAmount}
                onChange={(e) => setSellAmount(parseFloat(e.target.value))}
                className="text-2xl font-semibold w-1/2 bg-transparent focus:outline-none"
              />
              <CurrencySelect 
              value={sellCurrency}
              onChange={setSellCurrency}
              options={['usdc']}
            />
            </div>
          </div>
  
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="text-sm text-gray-500 mb-2">YOU RECEIVE (ESTIMATE)</div>
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
              options={['mpesa', 'ecocash']}
            />
            </div>
          </div>
  
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
  
          <div className="text-sm text-gray-500 mb-4">1 ETH ≈ 1894.9 GBP</div>
          <div className="flex justify-between items-center text-sm">
            <span>300 GBP is what you'll receive, after fees</span>
            <button className="text-blue-600 hover:underline">Details</button>
          </div>
        </div>
      </div>
    );
  };
  

export default CryptoExchange;
