import React from 'react';
import { TodaysPickList } from './components/TodaysPick/TodaysPickList';
import { useTodaysPick } from './hooks/useTodaysPick';
import { formatDateForInput } from '../../utils/dateFormatting';

export function TodaysPickPage() {
  const today = formatDateForInput(new Date());
  const { groupedOrders, isLoading, error } = useTodaysPick(today);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Today's Pick</h1>
      </div>

      <TodaysPickList
        groupedOrders={groupedOrders}
        selectedDate={today}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}