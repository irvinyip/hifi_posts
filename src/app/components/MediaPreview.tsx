'use client'

import { useState, useEffect } from 'react';

interface MediaPreviewProps {
  url: string;
  contentType: string | null;
}

export default function MediaPreview({ url, contentType: initialContentType }: MediaPreviewProps) {
  const [mediaType, setMediaType] = useState<string | null>(initialContentType);

  useEffect(() => {
    if (initialContentType) {
      setMediaType(initialContentType);
      return;
    }

    const fetchContentType = async () => {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok) {
          const contentTypeHeader = response.headers.get('Content-Type');
          setMediaType(contentTypeHeader);
        }
      } catch (error) {
        console.error('Error fetching content type:', error);
      }
    };

    fetchContentType();
  }, [url, initialContentType]);

  if (!mediaType) {
    return <div>Loading...</div>;
  }

  if (mediaType.startsWith('image/')) {
    return <img src={url} alt="Post media" className="rounded-md mb-4 max-h-96 w-full object-contain" />;
  }

  if (mediaType.startsWith('audio/')) {
    return (
      <audio controls src={url} className="w-full">
        Your browser does not support the audio element.
      </audio>
    );
  }

  return <div>Unsupported media type</div>;
}