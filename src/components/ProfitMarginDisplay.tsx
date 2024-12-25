import React from 'react';
import { calculateProfitMargin, formatProfitMargin } from '../utils/priceCalculations';

interface ProfitMarginDisplayProps {
  ekPrice: number;
  vkPrice: number;
  mwst: 'A' | 'B';
}

export function ProfitMarginDisplay({ ekPrice, vkPrice, mwst }: ProfitMarginDisplayProps) {
  const margin = calculateProfitMargin(ekPrice, vkPrice, mwst);
  
  const getColorClass = (margin: number) => {
    if (margin > 20) return 'text-green-600';
    if (margin > 0) return 'text-green-500';
    if (margin < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div 
      className={`font-medium ${getColorClass(margin)}`}
      title={`Profit margin calculation:\n((Selling Price excl. VAT - Purchase Price) / Purchase Price) × 100`}
    >
      {formatProfitMargin(margin)}
    </div>
  );
}