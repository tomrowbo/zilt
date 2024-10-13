import { useState, useEffect } from 'react';

export default function SendUsdcForm() {
  const [destinationAddress, setDestinationAddress] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const storedAddress = localStorage.getItem('stellarAddress');
    if (storedAddress) {
      setDestinationAddress(storedAddress);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle the USDC sending logic here
    console.log('Sending', amount, 'USDC to', destinationAddress);
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
            value={destinationAddress}
            onChange={(e) => setDestinationAddress(e.target.value)}
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
      </form>
    </div>
  );
}

