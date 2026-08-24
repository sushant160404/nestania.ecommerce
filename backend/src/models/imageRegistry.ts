/**
 * In-memory registry of product/category IDs that have a locally-uploaded image
 * living in backend/public/product_images/. This is backend-only state — the
 * frontend never needs to know which images are "local" vs remote, it just
 * receives a resolvable URL from the API responses.
 *
 * Naming convention:
 *   - Main product image:    /product_images/{productId}.jpg
 *   - Gallery image:         /product_images/{productId}-{index}.jpg  (0-based)
 *   - Category image:        /product_images/cat-{slug}.jpg
 */

export const LOCAL_PRODUCT_IMAGES = new Set<string>([
  // Example: 'nest-dw-01' would look for /product_images/nest-dw-01.jpg
]);

// key: "{productId}-{galleryIndex}" (0-based)
export const LOCAL_GALLERY_IMAGES = new Set<string>([
  // Example: 'nest-dw-01-0' would look for /product_images/nest-dw-01-0.jpg
]);

export const LOCAL_CATEGORY_IMAGES = new Set<string>([
  // Example: 'dinnerware' would look for /product_images/cat-dinnerware.jpg
]);
