import React from 'react';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  imagePreview: string;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ImageUpload({ imagePreview, onImageChange }: ImageUploadProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="space-y-4 w-full">
        <div className="flex justify-center">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Product preview"
              className="max-w-xs h-auto rounded-lg shadow"
            />
          ) : (
            <div className="w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-1 text-sm text-gray-500">Upload product image</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-center">
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={onImageChange}
            />
            <span className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Choose Image
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}