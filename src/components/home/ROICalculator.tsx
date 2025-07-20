import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

interface ROICalculatorProps {
  isDarkMode: boolean;
}

const ROICalculator: React.FC<ROICalculatorProps> = ({ isDarkMode }) => {
  // Input states
  const [workingCalls, setWorkingCalls] = useState<string>('');
  const [afterHoursCalls, setAfterHoursCalls] = useState<string>('');
  const [conversionRate, setConversionRate] = useState<string>('');
  const [missedRate, setMissedRate] = useState<string>('');
  const [averageOrderValue, setAverageOrderValue] = useState<string>('');
  const [callDuration, setCallDuration] = useState<string>('3');
  const [showTooltip, setShowTooltip] = useState(false);

  // Constants
  const REVENUE_GROWTH = 0.20;
  const COST_PER_MINUTE = 0.35;
  const MONTHLY_SOFTWARE_FEE = 150;

  // Calculate values
  const getNumericValue = (value: string, placeholder: number = 0) => {
    const num = parseFloat(value);
    return isNaN(num) || value === '' ? placeholder : num;
  };

  const workingCallsNum = getNumericValue(workingCalls, 30);
  const afterHoursCallsNum = getNumericValue(afterHoursCalls, 2);
  const conversionRateNum = getNumericValue(conversionRate, 30);
  const missedRateNum = getNumericValue(missedRate, 20);
  const averageOrderValueNum = getNumericValue(averageOrderValue, 100);
  const callDurationNum = getNumericValue(callDuration, 3);

  // Core calculations
  const totalCalls = workingCallsNum + afterHoursCallsNum;
  const potentialCustomers = totalCalls * (conversionRateNum / 100);
  const lostCustomers = potentialCustomers * (missedRateNum / 100);

  // Revenue loss
  const dailyLoss = lostCustomers * averageOrderValueNum * (1 + REVENUE_GROWTH);
  const monthlyLoss = dailyLoss * 30;
  const yearlyLoss = dailyLoss * 365;

  // Service cost
  const totalMinutesDaily = totalCalls * callDurationNum;
  const totalMinutesMonthly = totalMinutesDaily * 30;
  const monthlyMinutesCost = totalMinutesMonthly * COST_PER_MINUTE;
  const totalMonthlyCost = monthlyMinutesCost + MONTHLY_SOFTWARE_FEE;

  // Format numbers
  const formatNumber = (num: number, decimals: number = 0) => {
    if (decimals > 0 && num % 1 === 0) {
      // If it's a whole number, don't show decimal places
      return num.toLocaleString('en-US', { 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 0 
      });
    }
    return num.toLocaleString('en-US', { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: decimals 
    });
  };

  const formatCurrency = (num: number) => {
    return `$${formatNumber(num)}`;
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <motion.section 
      className="py-12 bg-[#f5f5f7]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            
            {/* Left Section - Inputs */}
            <motion.div variants={itemVariants} className="space-y-4">
              {/* Header */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-2">
                  How many calls do you get?
                </h2>
                <p className="text-gray-600">
                  Let's calculate your missed revenue opportunity
                </p>
              </div>

              {/* Calls Input Block */}
              <div className={`${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'} rounded-xl p-4 border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2 uppercase tracking-wide`}>
                      Working Hours
                    </label>
                    <input
                      type="number"
                      value={workingCalls}
                      onChange={(e) => setWorkingCalls(e.target.value)}
                      placeholder="30"
                      className={`w-20 h-12 text-xl font-bold text-center ${isDarkMode ? 'bg-[#252525] text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'} border-2 rounded-lg focus:outline-none focus:border-gray-500 mx-auto block`}
                      style={{ 
                        MozAppearance: 'textfield',
                        WebkitAppearance: 'none'
                      }}
                    />
                    <style jsx>{`
                      input[type=number]::-webkit-outer-spin-button,
                      input[type=number]::-webkit-inner-spin-button {
                        -webkit-appearance: none;
                        margin: 0;
                      }
                    `}</style>
                  </div>
                  <div>
                    <label className={`block text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2 uppercase tracking-wide`}>
                      After Hours
                    </label>
                    <input
                      type="number"
                      value={afterHoursCalls}
                      onChange={(e) => setAfterHoursCalls(e.target.value)}
                      placeholder="2"
                      className={`w-20 h-12 text-xl font-bold text-center ${isDarkMode ? 'bg-[#252525] text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'} border-2 rounded-lg focus:outline-none focus:border-gray-500 mx-auto block`}
                      style={{ 
                        MozAppearance: 'textfield',
                        WebkitAppearance: 'none'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Parameters */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className={`text-base font-medium ${isDarkMode ? 'text-white' : 'text-[#1a1a1a]'}`}>
                    Booking Conversion Rate
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={conversionRate}
                      onChange={(e) => setConversionRate(e.target.value)}
                      placeholder="30"
                      max="100"
                      className={`w-16 h-8 text-center ${isDarkMode ? 'bg-[#252525] text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'} border rounded focus:outline-none focus:border-gray-500`}
                    />
                    <span className={`ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className={`text-base font-medium ${isDarkMode ? 'text-white' : 'text-[#1a1a1a]'}`}>
                    Missed Call Rate
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={missedRate}
                      onChange={(e) => setMissedRate(e.target.value)}
                      placeholder="20"
                      max="100"
                      className={`w-16 h-8 text-center ${isDarkMode ? 'bg-[#252525] text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'} border rounded focus:outline-none focus:border-gray-500`}
                    />
                    <span className={`ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className={`text-base font-medium ${isDarkMode ? 'text-white' : 'text-[#1a1a1a]'}`}>
                    Average Order Value
                  </label>
                  <div className="flex items-center">
                    <span className={`mr-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>$</span>
                    <input
                      type="number"
                      value={averageOrderValue}
                      onChange={(e) => setAverageOrderValue(e.target.value)}
                      placeholder="100"
                      className={`w-16 h-8 text-center ${isDarkMode ? 'bg-[#252525] text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'} border rounded focus:outline-none focus:border-gray-500`}
                    />
                  </div>
                </div>

                <div className={`flex items-center justify-between pt-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <label className={`text-base font-medium ${isDarkMode ? 'text-white' : 'text-[#1a1a1a]'}`}>
                    Avg call:
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={callDuration}
                      onChange={(e) => setCallDuration(e.target.value)}
                      min="1"
                      max="30"
                      className={`w-16 h-8 text-center ${isDarkMode ? 'bg-[#252525] text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'} border rounded focus:outline-none focus:border-gray-500`}
                    />
                    <span className={`ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>min</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Section - Results */}
            <motion.div variants={itemVariants} className="space-y-4">
              
              {/* Current Situation */}
              <div className={`${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'} rounded-xl p-4 relative border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-[#1a1a1a]'} uppercase tracking-wide`}>
                    Current Situation
                  </h3>
                  <button
                    onClick={() => setShowTooltip(!showTooltip)}
                    className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors"
                  >
                    <HelpCircle className="w-3 h-3 text-white" />
                  </button>
                </div>

                {showTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-12 right-0 bg-gray-900 text-white p-3 rounded-lg shadow-lg z-10 max-w-xs"
                  >
                    <p className="text-xs">
                      Based on your inputs: From {formatNumber(totalCalls)} daily calls, {formatNumber(conversionRateNum)}% want to book ({formatNumber(potentialCustomers, 1)} customers). But {formatNumber(missedRateNum)}% of these are lost due to missed calls ({formatNumber(lostCustomers, 1)} customers × ${formatNumber(averageOrderValueNum)} = lost revenue).
                    </p>
                  </motion.div>
                )}

                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#1a1a1a]'} mb-1`}>
                      {formatNumber(totalCalls)}
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>calls daily</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#1a1a1a]'} mb-1`}>
                      {formatNumber(potentialCustomers, 1)}
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>bookings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 mb-1">
                      {formatNumber(lostCustomers, 1)}
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>customers lost</div>
                  </div>
                </div>
              </div>

              {/* Voice AI Agent Service */}
              <div className={`${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'} rounded-xl p-4 border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-[#1a1a1a]'} uppercase tracking-wide mb-3`}>
                  Voice AI Agent Service
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-[#1a1a1a]'}`}>
                      {formatNumber(totalMinutesDaily)}
                    </span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>minutes daily</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-[#1a1a1a]'}`}>
                      {formatNumber(totalMinutesMonthly)}
                    </span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>minutes monthly</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Software fee:</span>
                    <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-[#1a1a1a]'}`}>{formatCurrency(MONTHLY_SOFTWARE_FEE)}</span>
                  </div>
                  <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} pt-2`}>
                    <div className="flex justify-between items-center">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total monthly cost</span>
                      <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-[#1a1a1a]'}`}>
                        {formatCurrency(totalMonthlyCost)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Revenue Recovery */}
              <div className="bg-green-500 rounded-xl p-4 text-white text-center">
                <h3 className="text-sm font-bold uppercase tracking-wide mb-3 text-green-100">
                  Your Revenue Recovery
                </h3>
                <div className="text-3xl md:text-4xl font-bold mb-4">
                  {formatCurrency(monthlyLoss)}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-lg font-bold">
                      {formatCurrency(dailyLoss)}
                    </div>
                    <div className="text-xs text-green-100">saved daily</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">
                      {formatCurrency(yearlyLoss)}
                    </div>
                    <div className="text-xs text-green-100">saved yearly</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ROICalculator;