"use client";

import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/ui/logo";
import PageBG from "@/public/images/sign-in-bg.jpg";
import CustomerAvatar from "@/public/images/customer-avatar-05.jpg";
import { openWalletModal } from "@/app/lib/stellarWalletsKey";
import { useState } from "react";

export default function SignIn() {
  const [stellarAddress, setStellarAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle Stellar Wallet login
  const handleStellarLogin = async () => {
    setIsLoading(true);
    try {
      const address = await openWalletModal();
      if (address) {
        setStellarAddress(address);
      }
    } catch {
      alert("Failed to connect with Stellar wallet.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Content */}
      <div className="w-full md:w-1/2">
        <div className="min-h-screen h-full flex flex-col justify-center">
          <div className="px-5 sm:px-6 py-8">
            <div className="w-full max-w-md mx-auto">
              {/* Site branding */}
              <div className="mb-6">
                <Logo />
              </div>

              <h1 className="h2 font-playfair-display text-slate-800 mb-12">
                Sign in to Zilt
              </h1>

              {/* Social login */}
              <div className="space-y-3">
                <button className="btn-sm p-0 text-white bg-rose-500 hover:bg-rose-600 w-full relative flex items-stretch">
                  <div className="flex items-center bg-rose-600 mr-4">
                    <svg
                      className="w-4 h-4 fill-current text-rose-100 shrink-0 mx-3"
                      viewBox="0 0 16 16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M7.9 7v2.4H12c-.2 1-1.2 3-4 3-2.4 0-4.3-2-4.3-4.4 0-2.4 2-4.4 4.3-4.4 1.4 0 2.3.6 2.8 1.1l1.9-1.8C11.5 1.7 9.9 1 8 1 4.1 1 1 4.1 1 8s3.1 7 7 7c4 0 6.7-2.8 6.7-6.8 0-.5 0-.8-.1-1.2H7.9z" />
                    </svg>
                  </div>
                  <span className="flex-auto text-rose-50 text-sm py-2 pl-14 pr-8 -ml-14">
                    Login with Google
                  </span>
                </button>
                <button className="btn-sm p-0 text-white bg-blue-600 hover:bg-blue-700 w-full relative flex items-stretch">
                  <div className="flex items-center bg-blue-700 mr-4">
                    <svg
                      className="w-4 h-4 fill-current text-blue-100 shrink-0 mx-3"
                      viewBox="0 0 16 16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M6.023 16 6 9H3V6h3V4c0-2.7 1.672-4 4.08-4 1.153 0 2.144.086 2.433.124v2.821h-1.67c-1.31 0-1.563.623-1.563 1.536V6H13l-1 3H9.28v7H6.023Z" />
                    </svg>
                  </div>
                  <span className="flex-auto text-blue-50 text-sm py-2 pl-14 pr-8 -ml-14">
                    Login with Facebook
                  </span>
                </button>
                <button
                  className="btn-sm p-0 text-white bg-purple-600 hover:bg-purple-700 w-full relative flex items-stretch"
                  onClick={handleStellarLogin}
                  disabled={isLoading}
                >
                  <div className="flex items-center bg-purple-700 mr-4">
                    <svg
                      className="w-4 h-4 fill-current text-purple-100 shrink-0 mx-3"
                      viewBox="0 0 250 250"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="Layer_1-2" data-name="Layer 1">
                        <path d="M203,26.16l-28.46,14.5-137.43,70a82.49,82.49,0,0,1-.7-10.69A81.87,81.87,0,0,1,158.2,28.6l16.29-8.3,2.43-1.24A100,100,0,0,0,18.18,100q0,3.82.29,7.61a18.19,18.19,0,0,1-9.88,17.58L0,129.57V150l25.29-12.89,0,0,8.19-4.18,8.07-4.11v0L186.43,55l16.28-8.29,33.65-17.15V9.14Z" />
                        <path d="M236.36,50,49.78,145,33.5,153.31,0,170.38v20.41l33.27-16.95,28.46-14.5L199.3,89.24A83.45,83.45,0,0,1,200,100,81.87,81.87,0,0,1,78.09,171.36l-1,.53-17.66,9A100,100,0,0,0,218.18,100c0-2.57-.1-5.14-.29-7.68a18.2,18.2,0,0,1,9.87-17.58l8.6-4.38Z" />
                      </g>
                    </svg>
                  </div>
                  <span className="flex-auto text-purple-50 text-sm py-2 pl-14 pr-8 -ml-14">
                    {isLoading ? "Connecting..." : "Login with Stellar"}
                  </span>
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center my-6">
                <div
                  className="border-t border-slate-200 grow mr-3"
                  aria-hidden="true"
                ></div>
                <div className="text-sm text-slate-500 italic">or</div>
                <div
                  className="border-t border-slate-200 grow ml-3"
                  aria-hidden="true"
                ></div>
              </div>

              {/* Form */}
              <form>
                <div className="space-y-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="email"
                    >
                      Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="email"
                      className="form-input py-2 w-full"
                      type="email"
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="password"
                    >
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="password"
                      className="form-input py-2 w-full"
                      type="password"
                      autoComplete="on"
                      required
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <button className="btn-sm w-full text-sm text-white bg-blue-600 hover:bg-blue-700 group">
                    Sign In{" "}
                    <span className="tracking-normal text-blue-300 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">
                      -&gt;
                    </span>
                  </button>
                </div>
                <div className="text-center mt-5">
                  <Link
                    className="text-blue-600 hover:underline"
                    href="/reset-password"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div
        className="relative hidden md:block md:w-1/2 bg-slate-900"
        aria-hidden="true"
      >
        {/* Bg image */}
        <div className="absolute inset-0" data-aos="fade">
          <Image
            className="opacity-10 w-full h-full object-cover"
            src={PageBG}
            width={760}
            height={900}
            priority
            alt="Background"
          />
        </div>

        {/* Quote */}
        <div className="min-h-screen h-full flex flex-col justify-center">
          <div className="px-5 sm:px-6">
            <div className="w-full max-w-lg mx-auto">
              <h2 className="h3 md:text-4xl font-playfair-display text-slate-100 mb-4">
                Zilt
              </h2>
              <div className="space-y-3">
                <svg
                  className="fill-blue-600"
                  width="20"
                  height="16"
                  viewBox="0 0 20 16"
                >
                  <path d="M2.76 16c2.577 0 5.154-3.219 5.154-5.996 0-1.357-.613-2.272-1.748-2.272s-2.27.726-3.283 1.64C3.16 6.439 5.613 3.346 9.571.885L9.233 0C3.466 2.903 0 7.732 0 12.213 0 14.517.828 16 2.76 16Zm10.43 0c2.577 0 5.154-3.219 5.154-5.996 0-1.357-.614-2.272-1.749-2.272-1.135 0-2.27.726-3.282 1.64.276-2.934 2.73-6.027 6.687-8.488L19.663 0c-5.767 2.903-9.234 7.732-9.234 12.213 0 2.304.829 3.787 2.761 3.787Z" />
                </svg>
                <blockquote className="text-slate-400 italic">
                  Zilt bridges the gap between M-Pesa and the world of
                  cryptocurrency, enabling seamless transactions and unlocking
                  the potential of Stellar for everyone.
                </blockquote>
              </div>
              <div className="flex items-center mt-4">
                <a href="#0">
                  <Image
                    className="rounded-full shrink-0 mr-3"
                    src={CustomerAvatar}
                    width={32}
                    height={32}
                    alt="Customer Avatar"
                  />
                </a>
                <div className="font-medium">
                  <span className="text-slate-200">Michael Crob</span>
                  <span className="text-slate-600"> · </span>
                  <span className="text-slate-500">CEO, Zilt</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
