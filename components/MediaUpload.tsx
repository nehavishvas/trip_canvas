'use client';

import React, { useState, useRef } from 'react';
import { api } from '@/lib/api';
import { UploadCloud, X, Film, Image as ImageIcon, Loader2 } from 'lucide-react';

interface UploadedMedia {
  file_url: string;
  file_type: 'image' | 'video';
  file_name: string;
}

interface MediaUploadProps {
  value: UploadedMedia[];
  onChange: (media: UploadedMedia[]) => void;
}

export default function MediaUpload({ value = [], onChange }: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    if (files.length === 0) return;

    setUploading(true);
    try {
      const fileList = Array.from(files);
      const res = await api.uploadMedia(fileList);
      
      if (res && res.files) {
        const newMediaList = [...value, ...res.files];
        onChange(newMediaList);
      }
    } catch (err) {
      console.error('Failed to upload files:', err);
      alert('Upload failed. Please check file sizes or formats.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeMedia = (indexToRemove: number) => {
    const updated = value.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Upload Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
          dragActive
            ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/10'
            : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100/50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-900'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept="image/*,video/*"
          className="hidden"
          disabled={uploading}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Uploading media files...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full bg-white p-3 shadow-sm dark:bg-zinc-800">
              <UploadCloud className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
            </div>
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Click to upload or drag & drop files
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Supports JPG, PNG, WEBP, and MP4 (Images/Videos)
            </p>
          </div>
        )}
      </div>

      {/* Uploaded Files Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {value.map((item, index) => (
            <div
              key={item.file_url + index}
              className="group relative aspect-video overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
            >
              {item.file_type === 'video' ? (
                <div className="flex h-full w-full items-center justify-center bg-zinc-950">
                  <Film className="h-8 w-8 text-zinc-500" />
                  <span className="absolute bottom-2 left-2 truncate text-[10px] text-zinc-400 max-w-[80%] px-1 bg-black/40 rounded">
                    {item.file_name}
                  </span>
                </div>
              ) : (
                <img
                  src={item.file_url}
                  alt={item.file_name}
                  className="h-full w-full object-cover"
                />
              )}

              {/* Remove button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeMedia(index);
                }}
                className="absolute top-1.5 right-1.5 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              {/* Badge */}
              <span className="absolute bottom-1.5 right-1.5 rounded bg-black/60 px-1 py-0.5 text-[9px] font-medium text-white">
                {item.file_type}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
