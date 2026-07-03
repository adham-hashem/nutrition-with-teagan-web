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

      // Upload to Cloudinary via edge function
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cloudinary-upload?action=upload`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();

      if (result.success && result.data) {
        onChange(result.data.secure_url, result.data.public_id);
        onPublicIdChange?.(result.data.public_id);

        // Store in image_uploads table
        await supabase.from('image_uploads').insert({
          public_id: result.data.public_id,
          secure_url: result.data.secure_url,
          original_filename: result.data.original_filename,
          bytes: result.data.bytes,
          width: result.data.width,
          height: result.data.height,
          format: result.data.format,
          resource_type: result.data.resource_type,
        });
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
      setPreviewImage(null);
    } finally {
      setIsUploading(false);
    }
  }, [folder, maxSizeMB, onChange, onPublicIdChange]);

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
    setPreviewImage(null);
    onChange('', undefined);
    onPublicIdChange?.(null);
    setError(null);
  }, [onChange, onPublicIdChange]);

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
