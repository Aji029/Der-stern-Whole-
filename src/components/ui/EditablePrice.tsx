import React, { useState, useEffect, useRef } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from './Button';
import { formatPrice } from '../../utils/priceCalculations';

interface EditablePriceProps {
  value: number | undefined;
  onChange: (value: number) => void;
  onCancel?: () => void;
  label?: string;
}

export function EditablePrice({ value = 0, onChange, onCancel, label }: EditablePriceProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value?.toString() || '0');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTempValue(value?.toString() || '0');
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    const newValue = parseFloat(tempValue);
    if (!isNaN(newValue) && newValue >= 0) {
      onChange(newValue);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTempValue(value?.toString() || '0');
    setIsEditing(false);
    onCancel?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isEditing) {
    return (
      <div
        className="cursor-pointer hover:bg-gray-50 p-2 rounded"
        onClick={() => setIsEditing(true)}
        title={`Click to edit ${label || 'price'}`}
      >
        {formatPrice(value || 0)}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <input
        ref={inputRef}
        type="number"
        step="0.01"
        min="0"
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-24 px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500"
      />
      <div className="flex space-x-1">
        <Button
          size="sm"
          onClick={handleSave}
          className="p-1"
          title="Save"
        >
          <Check className="h-4 w-4 text-green-600" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCancel}
          className="p-1"
          title="Cancel"
        >
          <X className="h-4 w-4 text-red-600" />
        </Button>
      </div>
    </div>
  );
}