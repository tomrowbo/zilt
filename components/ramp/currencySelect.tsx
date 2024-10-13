'use client'

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface Currency {
  name: string;
  image: string;
}

interface Currencies {
  [key: string]: Currency;
}

const currencies: Currencies = {
    MPESA: { name: 'MPESA', image: '/images/mpesa.svg' },
    USDC: { name: 'USDC', image: '/images/usdc-logo.svg' },
    ECOCASH: { name: 'ECOCASH', image: '/images/ecocash.svg' },
  };

interface CurrencySelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

const CurrencySelect: React.FC<CurrencySelectProps> = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleImageError = (currency: string) => {
    setImageError(`Error loading image for ${currency}`);
    console.error(`Failed to load image for ${currency}: ${currencies[currency].image}`);
  };

  const renderCurrencyItem = (currency: string) => (
    <div
      key={currency}
      className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
      onClick={() => {
        onChange(currency);
        setIsOpen(false);
      }}
    >
      {imageError === currency ? (
        <div className="w-6 h-6 bg-red-200 rounded-full mr-2 flex items-center justify-center text-xs">
          Error
        </div>
      ) : (
        <Image 
          src={currencies[currency].image}
          alt={currencies[currency].name}
          width={24}
          height={24}
          className="rounded-full mr-2"
          onError={() => handleImageError(currency)}
        />
      )}
      <span>{currency}</span>
    </div>
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex items-center bg-white border border-gray-300 rounded-md pl-2 pr-4 py-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {renderCurrencyItem(value)}
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {options.map(renderCurrencyItem)}
        </div>
      )}
      {imageError && (
        <div className="text-red-500 text-sm mt-1">{imageError}</div>
      )}
    </div>
  );
};

export default CurrencySelect;
