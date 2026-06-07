
import React, { useState, useCallback } from 'react';
import { PhotoIcon } from './icons/PhotoIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface ImageUploaderProps {
  onImagesChange: (files: File[]) => void;
  imagePreviews: string[];
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesChange, imagePreviews }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [currentFiles, setCurrentFiles] = useState<File[]>([]);

  const handleFiles = (newFiles: File[]) => {
    const allFiles = [...currentFiles, ...newFiles];
    setCurrentFiles(allFiles);
    onImagesChange(allFiles);
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      handleFiles(Array.from(event.target.files));
    }
  };
  
  const handleRemoveImage = (indexToRemove: number) => {
    const updatedFiles = currentFiles.filter((_, index) => index !== indexToRemove);
    setCurrentFiles(updatedFiles);
    onImagesChange(updatedFiles);
  };

  const handleDragEvents = useCallback((e: React.DragEvent<HTMLLabelElement>, dragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    handleDragEvents(e, false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(Array.from(e.dataTransfer.files));
    }
  }, [handleDragEvents]);
  
  const previews = imagePreviews.length > 0 ? imagePreviews : currentFiles.map(f => URL.createObjectURL(f));

  return (
    <div>
        <label
            htmlFor="file-upload"
            className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 group
            ${isDragging 
                ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/10' 
                : 'border-slate-300 dark:border-slate-700/80 bg-gray-50 dark:bg-slate-900/50 hover:border-violet-500'}`}
            onDragEnter={(e) => handleDragEvents(e, true)}
            onDragLeave={(e) => handleDragEvents(e, false)}
            onDragOver={(e) => handleDragEvents(e, true)}
            onDrop={handleDrop}
        >
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center transition-transform duration-300 group-hover:scale-105">
                <PhotoIcon className="w-10 h-10 mb-4 text-slate-400 dark:text-slate-500 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors" />
                <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-violet-600 dark:text-violet-400">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">PNG, JPG, or WEBP. Upload one or more.</p>
            </div>
            <input id="file-upload" type="file" multiple className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
        </label>
        {previews.length > 0 && (
            <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {previews.map((preview, index) => (
                    <div key={index} className="relative aspect-square group">
                        <img src={preview} alt={`Damage preview ${index + 1}`} className="object-cover w-full h-full rounded-lg" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                        <button 
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-2 -right-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-700 dark:text-white/70 hover:text-red-600 dark:hover:text-red-500 hover:bg-red-200 dark:hover:bg-red-500/20 transition-all transform scale-0 group-hover:scale-100"
                          aria-label="Remove image"
                        >
                            <XCircleIcon className="w-7 h-7"/>
                        </button>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
};
