'use client'

import { useState } from 'react'
import Hero from '@/components/hero-home'
import FeaturesBlocks from '@/components/features-blocks'
import Features from '@/components/features-home'
import Features02 from '@/components/features-home-02'
import Features03 from '@/components/features-home-03'
import Target from '@/components/target'
import PricingSection from '@/components/pricing'
import Cta from '@/components/cta'

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const initiatePayment = async () => {
    setLoading(true);
    setSuccessMessage('');
    try {
      const response = await fetch('/api/initiatePayment', {
        method: 'POST',
      });

      const data = await response.json();
      console.log('Payment initiation response:', data);
      
      if (response.ok) {
        setSuccessMessage('Payment successful!');
      } else {
        setSuccessMessage('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      setSuccessMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Hero />
      <FeaturesBlocks />
      {/* <Features /> */}
      {/* <Features02 /> */}
      {/* <Features03 /> */}
      {/* <Target /> */}
      {/* <PricingSection /> */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h2 className="h3 mb-4 text-center">Test M-Pesa Payment</h2>
        <div className="text-center">
          <button 
            onClick={initiatePayment} 
            disabled={loading}
            className="btn text-white bg-blue-600 hover:bg-blue-700 w-full sm:w-auto sm:ml-4"
          >
            {loading ? 'Processing...' : 'Initiate Payment'}
          </button>
          {successMessage && (
            <p className={`mt-4 text-lg ${successMessage.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
              {successMessage}
            </p>
          )}
        </div>
      </div>
      <Cta />
    </>
  )
}
