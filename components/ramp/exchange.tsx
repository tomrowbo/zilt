'use client'

import React, { useState } from 'react';
import Buy from './buy';
import Withdraw from './withdraw';

const CryptoExchange: React.FC = () => {
    const [activeComponent, setActiveComponent] = useState<'buy' | 'sell'>('buy');

    return (
      <div className="font-sans">
        <div className="bg-white p-4 rounded-lg shadow-md max-w-md mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <button 
                className={`px-4 py-2 border border-gray-300 rounded-md mr-2 ${activeComponent === 'buy' ? 'bg-green-600 text-white' : 'hover:bg-gray-100'}`}
                onClick={() => setActiveComponent('buy')}
              >
                Buy
              </button>
              <button 
                className={`px-4 py-2 border border-gray-300 rounded-md ${activeComponent === 'sell' ? 'bg-green-600 text-white' : 'hover:bg-gray-100'}`}
                onClick={() => setActiveComponent('sell')}
              >
                Sell
              </button>
            </div>
          </div>
  
          {activeComponent === 'buy' ? <Buy /> : <Withdraw />}
        </div>
      </div>
    );
  };

export default CryptoExchange;
