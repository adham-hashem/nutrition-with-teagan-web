import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string, publicId?: string) => void;
  onPublicIdChange?: (publicId: string | null) => void;
  folder?: string;
  className?: string;
  aspectRatio?: 'square' | 'landscape' | 'portrait';
  maxSizeMB?: number;
}

interface UploadedImage {
  url: string;
  publicId: string;
}

export default function ImageUploader({
  value,
  onChange,
  onPublicIdChange,
  folder = 'nutrition-teagan',
  className = '',
  aspectRatio = 'landscape',
  maxSizeMB = 5,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectClasses = {
    square: 'aspect-square',
    landscape: 'aspect-video',
    portrait: 'aspect-[3/4]',
  };

  const getFilePathFromUrl = (url: string): string | null => {
    const parts = url.split('/storage/v1/object/public/images/');
    if (parts.length === 2) {
      return decodeURIComponent(parts[1]);
    }
    return null;
  };

  const handleFile = useCallback(async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      // Create local preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Clean up old image if it exists in storage
      if (previewImage) {
        const oldPath = getFilePathFromUrl(previewImage);
        if (oldPath) {
          try {
            await supabase.storage.from('images').remove([oldPath]);
            await supabase.from('image_uploads').delete().eq('public_id', oldPath);
          } catch (err) {
            console.error('Failed to clean up old image:', err);
          }
        }
      }

      // Generate unique file path
      const fileExt = file.name.split('.').pop() || '';
      const cleanFileName = file.name
        .replace(/[^a-zA-Z0-9]/g, '_')
        .replace(/_{2,}/g, '_')
        .toLowerCase();
      const fileName = `${Date.now()}_${cleanFileName}`;
      const filePath = `${folder}/${fileName}`.replace(/\/+/g, '/');

      // Upload directly to Supabase storage 'images' bucket
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      // Store in image_uploads table
      await supabase.from('image_uploads').insert({
        public_id: filePath,
        secure_url: publicUrl,
        original_filename: file.name,
        bytes: file.size,
        format: fileExt,
        resource_type: 'image',
      });

      onChange(publicUrl, filePath);
      onPublicIdChange?.(filePath);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
      setPreviewImage(null);
    } finally {
      setIsUploading(false);
    }
  }, [folder, maxSizeMB, previewImage, onChange, onPublicIdChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleRemove = useCallback(async () => {
    if (previewImage) {
      const filePath = getFilePathFromUrl(previewImage);
      if (filePath) {
        try {
          await supabase.storage.from('images').remove([filePath]);
          await supabase.from('image_uploads').delete().eq('public_id', filePath);
        } catch (err) {
          console.error('Failed to remove file from storage:', err);
        }
      }
    }
    setPreviewImage(null);
    onChange('', undefined);
    onPublicIdChange?.(null);
    setError(null);
  }, [previewImage, onChange, onPublicIdChange]);

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {!previewImage ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-2xl cursor-pointer
            transition-all duration-300 overflow-hidden
            ${isDragging
              ? 'border-sage-dark bg-sage-dark/10'
              : 'border-sage/30 hover:border-sage-dark hover:bg-sage-dark/5'
            }
            ${aspectClasses[aspectRatio]}
          `}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
            {isUploading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-10 h-10 text-sage-dark animate-spin" />
                <p className="font-montserrat text-sm text-text-body">Uploading...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-sage/15 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-sage-dark" />
                </div>
                <div className="text-center">
                  <p className="font-montserrat text-sm font-medium text-text-heading mb-1">
                    Drop image here or click to upload
                  </p>
                  <p className="font-montserrat text-xs text-text-small">
                    PNG, JPG, WebP up to {maxSizeMB}MB
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={`relative rounded-2xl overflow-hidden ${aspectClasses[aspectRatio]} group`}>
          <img
            src={previewImage}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
              title="Replace image"
            >
              <ImageIcon className="w-5 h-5 text-text-heading" />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-red-50 transition-colors"
              title="Remove image"
            >
              <X className="w-5 h-5 text-red-500" />
            </button>
          </div>
          {isUploading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-sage-dark animate-spin" />
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-500 font-montserrat">{error}</p>
      )}
    </div>
  );
}
