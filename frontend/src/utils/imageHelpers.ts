import type React from 'react';

/**
 * onError handler for <img> elements.
 * When a local image 404s, swaps src to the data-fallback attribute.
 * Usage: <img src={localSrc} data-fallback={remoteUrl} onError={handleImageError} />
 */
export function handleImageError(e: React.SyntheticEvent<HTMLImageElement>): void {
  const img = e.currentTarget;
  const fallback = img.getAttribute('data-fallback');
  if (fallback && img.src !== fallback) {
    img.src = fallback;
  }
}
