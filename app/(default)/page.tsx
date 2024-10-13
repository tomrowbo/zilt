'use client'

import { useState } from 'react'
import Hero from '@/components/hero-home'
import FeaturesBlocks from '@/components/features-blocks'
import SendUsdcForm from '@/components/send-usdc-form'
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
      <Cta />
    </>
  )
}
