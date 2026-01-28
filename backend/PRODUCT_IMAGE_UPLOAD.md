# Product Image Upload

## Overview

This document describes the product image upload functionality implemented in the booking backend. Products can have images uploaded via a dedicated REST API endpoint with file validation, storage, and serving capabilities.

## 🎯 Key Features

- **Single Image Upload**: Upload one image per product to the `imageSrc` field
- **File Validation**: Supports JPEG, PNG, GIF, and WebP formats (max 5MB)
- **Disk Storage**: Images stored locally with unique, timestamped filenames
- **Static Serving**: Images accessible via public URL paths
- **Security**: JWT authentication + RBAC permission checks
- **API Documentation**: Full Swagger/OpenAPI integration

## 📂 File Structure

```
backend/
├── src/modules/product/
│   ├── dto/
│   │   └── upload-image.dto.ts          # Upload request DTO
│   ├── utils/
│   │   └── file-upload.utils.ts         # Multer configuration
│   ├── product.controller.ts            # Upload endpoint
│   └── product.service.ts               # Update logic
├── uploads/
│   └── products/                        # Image storage directory
│       └── .gitkeep                     # Git directory tracking
└── src/app.module.ts                    # Static file serving config
```

## 🔧 Implementation Details

### File Upload Configuration

**Location**: `src/modules/product/utils/file-upload.utils.ts`

```typescript
// Multer disk storage with unique filenames
// Supported formats: JPEG, PNG, GIF, WebP
// Max size: 5MB
// Naming: imageSrc-{timestamp}-{random}.ext
```

### Upload Endpoint

**Location**: `src/modules/product/product.controller.ts`

```
POST /api/products/:id/upload-image
```

- **Authentication**: JWT Bearer token required
- **Authorization**: `products:update` permission
- **Content-Type**: `multipart/form-data`
- **Field Name**: `imageSrc`

### Service Method

**Location**: `src/modules/product/product.service.ts`

The `updateProductImage()` method:

- Updates the product's `imageSrc` field with file path
- Populates category reference in response
- Throws `NotFoundException` if product doesn't exist

### Static File Serving

**Location**: `src/app.module.ts`

Configured to serve uploaded files at `/uploads` path, making images publicly accessible.

## 📡 API Reference

### Upload Product Image

#### Request

```http
POST /api/products/{productId}/upload-image
Authorization: Bearer {jwt-token}
Content-Type: multipart/form-data

imageSrc: {binary-file}
```

#### Success Response (200 OK)

```json
{
  "message": "Image uploaded successfully",
  "imagePath": "/uploads/products/imageSrc-1234567890-abc123.jpg",
  "product": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Product Name",
    "imageSrc": "/uploads/products/imageSrc-1234567890-abc123.jpg",
    "category": {
      "_id": "...",
      "name": "Category Name"
    }
  }
}
```

#### Error Responses

| Status Code | Description                           |
| ----------- | ------------------------------------- |
| 400         | Invalid file type or no file provided |
| 401         | Missing or invalid JWT token          |
| 403         | Insufficient permissions              |
| 404         | Product not found                     |
| 413         | File size exceeds 5MB limit           |

## 💻 Usage Examples

### cURL

```bash
curl -X POST "http://localhost:5000/api/products/507f1f77bcf86cd799439011/upload-image" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "imageSrc=@/path/to/image.jpg"
```

### JavaScript (Fetch API)

```javascript
const productId = '507f1f77bcf86cd799439011';
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];

const formData = new FormData();
formData.append('imageSrc', file);

const response = await fetch(`/api/products/${productId}/upload-image`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${jwtToken}`,
  },
  body: formData,
});

const result = await response.json();
console.log('Image URL:', result.imagePath);
```

### Axios (React/Vue/Angular)

```javascript
import axios from 'axios';

const uploadProductImage = async (productId, imageFile) => {
  const formData = new FormData();
  formData.append('imageSrc', imageFile);

  try {
    const { data } = await axios.post(
      `/api/products/${productId}/upload-image`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return data.imagePath;
  } catch (error) {
    console.error('Upload failed:', error.response?.data);
    throw error;
  }
};
```

### HTML Form

```html
<form
  action="/api/products/507f1f77bcf86cd799439011/upload-image"
  method="POST"
  enctype="multipart/form-data"
>
  <input type="file" name="imageSrc" accept="image/*" required />
  <button type="submit">Upload Image</button>
</form>
```

## 🗂️ Storage Details

### Directory Structure

```
uploads/
└── products/
    ├── .gitkeep
    ├── imageSrc-1609459200000-abc123.jpg
    ├── imageSrc-1609459300000-def456.png
    └── imageSrc-1609459400000-ghi789.webp
```

### File Naming Convention

```
{fieldname}-{timestamp}-{random}.{extension}
```

- **fieldname**: Always "imageSrc"
- **timestamp**: Unix timestamp in milliseconds
- **random**: Random number for uniqueness
- **extension**: Original file extension

**Example**: `imageSrc-1609459200000-123456789.jpg`

### Public Access

Images are accessible at:

```
http://localhost:5000/uploads/products/imageSrc-xxx.ext
```

### Git Configuration

The `.gitignore` file excludes uploaded images but preserves directory structure:

```gitignore
# Ignore uploaded files but keep directory structure
uploads/**/*
!uploads/**/.gitkeep
```

## ⚙️ Configuration

### File Validation Rules

| Rule            | Value                                        |
| --------------- | -------------------------------------------- |
| Max File Size   | 5MB (5242880 bytes)                          |
| Allowed Formats | JPEG, JPG, PNG, GIF, WebP                    |
| MIME Types      | image/jpeg, image/png, image/gif, image/webp |
| Field Name      | imageSrc                                     |

### Multer Configuration

```typescript
// Located in: src/modules/product/utils/file-upload.utils.ts
export const multerConfig = {
  storage: diskStorage({
    destination: './uploads/products',
    filename: (req, file, cb) => {
      const uniqueName = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const extension = extname(file.originalname);
      cb(null, `${uniqueName}${extension}`);
    },
  }),
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
};
```

## 🔒 Security Considerations

1. **Authentication**: JWT token required for all upload requests
2. **Authorization**: CASL guard checks `products:update` permission
3. **File Validation**: Only allowed image types accepted
4. **Size Limits**: 5MB max to prevent abuse
5. **Filename Sanitization**: Auto-generated names prevent path traversal
6. **Public Access**: Uploaded images are publicly accessible

## 🚀 Future Enhancements

### Planned Features

- [ ] **Multiple Images**: Support for uploading to `images` array field
- [ ] **Image Optimization**: Automatic compression and resizing
- [ ] **Old Image Cleanup**: Delete previous image when uploading new one
- [ ] **Cloud Storage**: Integration with AWS S3, Cloudinary, or Azure Blob
- [ ] **Thumbnails**: Auto-generate thumbnails for different sizes
- [ ] **Metadata Extraction**: Capture and store image dimensions, format info
- [ ] **CDN Integration**: Serve images via CDN for better performance
- [ ] **Crop/Edit**: In-browser image editing before upload
- [ ] **Validation Enhancement**: Check image dimensions, aspect ratio
- [ ] **Bulk Upload**: Upload multiple products' images at once

### Potential Improvements

- Add image preview in Swagger UI
- Implement image versioning
- Add watermarking capability
- Support for progressive JPEG
- WebP conversion for better compression
- Alt text and caption fields
- Image moderation/scanning

## 🐛 Troubleshooting

### Common Issues

**Upload fails with 400 Bad Request**

- Verify file format is one of: JPEG, PNG, GIF, WebP
- Check file size is under 5MB
- Ensure field name is exactly `imageSrc`

**403 Forbidden error**

- Verify user has `products:update` permission
- Check JWT token is valid and not expired

**Image not accessible after upload**

- Ensure `ServeStaticModule` is properly configured in `app.module.ts`
- Check uploads directory exists and has proper permissions
- Verify path in response matches static file route

**Images not persisting after restart**

- Check `.gitignore` rules if using version control
- Ensure uploads directory is not being cleared
- Verify deployment process includes uploads directory

## 📝 Testing

### Manual Testing via Swagger

1. Navigate to `http://localhost:5000/api/docs`
2. Locate `Products` section
3. Find `POST /api/products/{id}/upload-image`
4. Click "Try it out"
5. Enter product ID
6. Click "Choose File" and select an image
7. Add Bearer token in Authorization
8. Execute request

### Automated Testing

```typescript
// Example Jest test
describe('Product Image Upload', () => {
  it('should upload product image', async () => {
    const response = await request(app.getHttpServer())
      .post(`/api/products/${productId}/upload-image`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .attach('imageSrc', './test/fixtures/sample-image.jpg')
      .expect(200);

    expect(response.body.imagePath).toContain('/uploads/products/');
    expect(response.body.product.imageSrc).toBeDefined();
  });
});
```

## 📚 Related Documentation

- [NestJS File Upload Documentation](https://docs.nestjs.com/techniques/file-upload)
- [Multer Middleware](https://github.com/expressjs/multer)
- [Product Module README](./src/modules/product/README.md)
- [API Documentation](http://localhost:5000/api/docs)

---

**Last Updated**: [Current Date]  
**Version**: 1.0.0  
**Maintainer**: Development Team
