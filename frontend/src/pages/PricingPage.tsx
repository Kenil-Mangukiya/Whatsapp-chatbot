import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import Navbar from '../components/Navbar';

const PricingPage = () => {
  const [isYearly, setIsYearly] = useState(false);

  const pricingTiers = [
    {
      name: 'Starter',
      monthlyPrice: 2000,
      description: 'Perfect for getting started',
      features: [
        { name: 'Phone Number', included: true },
        { name: 'Call Minutes', value: '200 minutes', included: true },
        { name: 'WhatsApp Followup', included: true },
        { name: 'Get Google Review', included: false },
        { name: 'Concurrent Calls', value: '1 call', included: true },
        { name: 'Generate New Leads (Pincode Based)', included: false },
      ],
      highlighted: false,
    },
    {
      name: 'Professional',
      monthlyPrice: 7500,
      description: 'For growing businesses',
      features: [
        { name: 'Phone Number', included: true },
        { name: 'Call Minutes', value: '1000 minutes', included: true },
        { name: 'WhatsApp Followup', included: true },
        { name: 'Get Google Review', included: true },
        { name: 'Concurrent Calls', value: '5 calls', included: true },
        { name: 'Generate New Leads (Pincode Based)', included: true },
      ],
      highlighted: true,
    },
    {
      name: 'Enterprise',
      monthlyPrice: 35000,
      description: 'For large-scale operations',
      features: [
        { name: 'Phone Number', included: true },
        { name: 'Call Minutes', value: '5000 minutes', included: true },
        { name: 'WhatsApp Followup', included: true },
        { name: 'Get Google Review', included: true },
        { name: 'Concurrent Calls', value: '10 calls', included: true },
        { name: 'Generate New Leads (Pincode Based)', included: true },
      ],
      highlighted: false,
    },
  ];

  const getPrice = (monthlyPrice: number) => {
    return isYearly ? monthlyPrice * 11 : monthlyPrice;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Navbar />
      
      {/* Header Section */}
      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent <span className="text-red-600">Pricing</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Choose the perfect plan for your business needs
          </p>

          {/* Toggle Switch */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-lg font-semibold ${!isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors ${
                isYearly ? 'bg-red-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-lg transition-transform ${
                  isYearly ? 'translate-x-10' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-lg font-semibold ${isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly
            </span>
            {isYearly && (
              <span className="ml-4 inline-block bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold">
                Save 8% with yearly billing
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto pt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 lg:gap-6 items-stretch">
            {pricingTiers.map((tier, index) => (
              <div
                key={index}
                className={`relative rounded-2xl transition-all duration-300 ${
                  tier.highlighted
                    ? 'md:scale-105 md:z-10 bg-gradient-to-br from-red-500 to-red-600 text-white shadow-2xl'
                    : 'bg-white border-2 border-gray-200 text-gray-900 hover:border-red-300 hover:shadow-xl'
                } p-6 md:p-8 flex flex-col overflow-visible`}
              >
                {/* Badge for highlighted tier */}
                {tier.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <span className="bg-yellow-400 text-red-900 px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Tier Name */}
                <h3 className={`text-2xl font-bold mb-1 ${tier.highlighted ? 'text-white' : 'text-gray-900'}`}>
                  {tier.name}
                </h3>
                <p className={`mb-6 text-sm ${tier.highlighted ? 'text-red-100' : 'text-gray-600'}`}>
                  {tier.description}
                </p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl md:text-4xl font-bold">₹{getPrice(tier.monthlyPrice).toLocaleString('en-IN')}</span>
                    <span className={`text-xs md:text-sm ${tier.highlighted ? 'text-red-100' : 'text-gray-600'}`}>
                      /{isYearly ? 'year' : 'month'}
                    </span>
                  </div>
                  {isYearly && (
                    <p className={`mt-2 text-xs ${tier.highlighted ? 'text-red-100' : 'text-gray-600'}`}>
                      ₹{Math.round(getPrice(tier.monthlyPrice) / 12).toLocaleString('en-IN')} per month billed annually
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  className={`w-full py-2.5 md:py-3 px-4 md:px-6 rounded-lg font-bold text-base md:text-lg transition-all duration-300 mb-6 ${
                    tier.highlighted
                      ? 'bg-white text-red-600 hover:bg-red-50 shadow-lg hover:shadow-xl'
                      : 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg'
                  }`}
                >
                  Get Started
                </button>

                {/* Features List */}
                <div className="space-y-3 flex-grow">
                  {tier.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {feature.included ? (
                          <Check
                            size={18}
                            className={tier.highlighted ? 'text-green-300' : 'text-green-500'}
                          />
                        ) : (
                          <X
                            size={18}
                            className={tier.highlighted ? 'text-red-300' : 'text-gray-400'}
                          />
                        )}
                      </div>
                      <div className="flex-grow">
                        <p className={`font-medium text-sm md:text-base ${tier.highlighted ? 'text-white' : 'text-gray-900'}`}>
                          {feature.name}
                        </p>
                        {feature.value && (
                          <p className={`text-xs md:text-sm ${tier.highlighted ? 'text-red-100' : 'text-gray-600'}`}>
                            {feature.value}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Our Plans Section */}
      <section className="bg-gray-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Plans?</h2>
            <p className="text-lg text-gray-600">Get the most out of your investment</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Block 1: 24/7 Intelligent Call Handling */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">24/7 Intelligent Call Handling</h3>
              <p className="text-gray-600">Handle unlimited customer calls automatically, anytime with our AI voice agents. Never miss a call again</p>
            </div>

            {/* Block 2: Call History & Customer Details */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Call History & Customer Details</h3>
              <p className="text-gray-600">Complete call logs, customer information tracking, and interaction history. Access all customer details in one place for better service</p>
            </div>

            {/* Block 3: Grow Your Business */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Grow Your Business</h3>
              <p className="text-gray-600">Increase customer satisfaction and business revenue with AI-powered insights. Scale your roadside assistance operations efficiently</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
