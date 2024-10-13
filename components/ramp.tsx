'use client';

import { useState } from 'react';
import CryptoExchange from './exchange';
import { openWalletModal } from "@/app/lib/stellarWalletsKey";

export default function Ramp() {
  const [stellarAddress, setStellarAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <section className="relative">
      {/* Dark background */}
      <div className="absolute inset-0 bg-slate-900 pointer-events-none -z-10 h-1/3 lg:h-[48rem] [clip-path:polygon(0_0,_5760px_0,_5760px_calc(100%_-_352px),_0_100%)]" aria-hidden="true"></div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-32 md:pt-40">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12">
            <h1 className="h2 font-playfair-display text-slate-100 mb-4">Ramp</h1>
            <p className="text-xl text-slate-400">Connect your wallet to start exchanging</p>
          </div>

          {/* Connect Wallet Button */}
          {!stellarAddress ? (
            <div className="text-center mb-8">
              <button
                className="btn-sm p-0 text-white bg-purple-600 hover:bg-purple-700 w-full sm:w-auto relative flex items-center"
                onClick={handleStellarLogin}
                disabled={isLoading}
              >
                <span className="flex-auto text-purple-50 text-sm py-2 px-8">
                  {isLoading ? "Connecting..." : "Connect Stellar Wallet"}
                </span>
              </button>
            </div>
          ) : (
            <div className="text-center mb-8">
              <p className="text-slate-300">Connected: {stellarAddress}</p>
            </div>
          )}

          <CryptoExchange />
        </div>
      </div>
    </section>
  )
}
