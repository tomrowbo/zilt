'use client'

import React, { useState } from 'react';
import CurrencySelect from './currencySelect';
import Image from 'next/image';

const Withdraw: React.FC = () => {
  const [sellAmount, setSellAmount] = useState(0.165);
  const [receiveAmount, setReceiveAmount] = useState(300);
  const [sellCurrency, setSellCurrency] = useState('USDC');
  const [receiveCurrency, setReceiveCurrency] = useState('MPESA');
  const [mobileNumber, setMobileNumber] = useState('');
  const [selectedWithdrawalMethod, setSelectedWithdrawalMethod] = useState<string>('mpesa');

  const withdrawalMethods = {
    mpesa: { name: 'MPESA', image: '/images/mpesa.svg' },
    ecocash: { name: 'ECOCASH', image: '/images/ecocash.svg' },
  };

  return (
    <>
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
            options={['USDC']}
          />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="text-sm text-gray-500 mb-2">Withdrawal Method</div>
        <div className="flex space-x-2">
          {Object.entries(withdrawalMethods).map(([id, method]) => (
            <button
              key={id}
              onClick={() => setSelectedWithdrawalMethod(id)}
              className={`flex items-center space-x-2 p-2 rounded-md border ${
                selectedWithdrawalMethod === id
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

      <button
        className="w-full p-2 mb-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 ease-in-out"
      >
        Connect Wallet
      </button>

    </>
  );
};

export default Withdraw;
