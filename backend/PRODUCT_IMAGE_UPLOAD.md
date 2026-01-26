# Product Image Upload Implementation Summary

## Overview

Implemented disk storage-based image upload functionality for the product module in the NestJS booking backend. Users can now upload product images to the `imageSrc` field via a dedicated API endpoint.

## Files Created/Modified

### New Files Created:

1. **[src/modules/product/utils/file-upload.utils.ts](src/modules/product/utils/file-upload.utils.ts)**
   - Multer disk storage configuration for product images
   - File filter for image validation (JPEG, PNG, GIF, WebP)
   - Max file size limit: 5MB
   - Auto-generated filenames with timestamps

2. **[src/modules/product/dto/upload-image.dto.ts](src/modules/product/dto/upload-image.dto.ts)**
   - DTO for image upload request validation
   - Swagger documentation support

3. **uploads/products/.gitkeep**
   - Directory for storing uploaded product images
   - Tracked in git for directory structure preservation

### Modified Files:

1. **[src/modules/product/product.controller.ts](src/modules/product/product.controller.ts)**
   - Added imports for file handling (`FileInterceptor`, `UploadedFile`, `UseInterceptors`)
   - Added imports for Swagger multipart support (`ApiConsumes`)
   - Implemented new endpoint: `POST /api/products/:id/upload-image`
   - Full Swagger documentation for the upload endpoint

2. **[src/modules/product/product.service.ts](src/modules/product/product.service.ts)**
   - Added `updateProductImage()` method to update product's `imageSrc` field
   - Properly returns updated product with populated category reference

3. **[src/app.module.ts](src/app.module.ts)**
   - Added second `ServeStaticModule.forRoot()` configuration to serve uploaded files
   - Routes `/uploads` path to the uploads directory

4. **[.gitignore](.gitignore)**
   - Added rules to ignore uploaded files while preserving directory structure with `.gitkeep`

## API Endpoint Details

### Upload Product Image

**Endpoint:** `POST /api/products/:id/upload-image`

**Authentication:** Required (JWT)
**Authorization:** Requires 'products:update' permission

**Request:**

- **Content-Type:** `multipart/form-data`
- **Parameter:** `id` (Product ID in URL path)
- **File Field:** `imageSrc` (Binary image file)
- **Supported Formats:** JPEG, PNG, GIF, WebP
- **Max Size:** 5MB

**Response (200 OK):**

```json
{
  "message": "Image uploaded successfully",
  "imagePath": "/uploads/products/imageSrc-1234567890-123456789.jpg",
  "product": {
    "_id": "...",
    "name": "...",
    "imageSrc": "/uploads/products/imageSrc-1234567890-123456789.jpg",
    "...": "..."
  }
}
```

**Error Responses:**

- **400 Bad Request:** Invalid file type or no file provided
- **404 Not Found:** Product with specified ID not found
- **413 Payload Too Large:** File exceeds 5MB limit

## Storage Configuration

**Upload Directory:** `./uploads/products/`
**File Naming:** `[fieldname]-[timestamp]-[random].extension`

- Example: `imageSrc-1609459200000-123456789.jpg`
- Prevents filename conflicts with auto-generated unique names

**Served At:** `http://localhost:3000/uploads/products/imageSrc-xxx.jpg`

- Images are publicly accessible via static file serving

## Usage Example

**Using cURL:**

```bash
curl -X POST http://localhost:3000/api/products/507f1f77bcf86cd799439011/upload-image \
  -H "Authorization: Bearer <your-jwt-token>" \
  -F "imageSrc=@/path/to/image.jpg"
```

**Using FormData (JavaScript/Frontend):**

```javascript
const formData = new FormData();
formData.append('imageSrc', fileInput.files[0]);

const response = await fetch(`/api/products/${productId}/upload-image`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});

const result = await response.json();
console.log(result.imagePath); // e.g., "/uploads/products/imageSrc-xxx.jpg"
```

## Features

✅ Single image upload per product
✅ Disk storage with automatic unique filenames
✅ Image format validation (JPEG, PNG, GIF, WebP)
✅ File size limit enforcement (5MB)
✅ Static file serving for uploaded images
✅ Full Swagger/OpenAPI documentation
✅ CASL authorization integration
✅ Proper error handling and validation
✅ Git-friendly with .gitkeep for directory preservation

## Future Enhancements

- Add multiple image upload support (populate `images` array field)
- Image optimization/compression before storage
- Delete old image when uploading new one
- Support for cloud storage (AWS S3, Cloudinary)
- Image metadata extraction (dimensions, format, etc.)
- Thumbnail generation
