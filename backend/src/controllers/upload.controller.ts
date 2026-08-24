import { Request, Response } from 'express';

export function handleUpload(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const localPath = `/product_images/${req.file.filename}`;

    res.json({
      success: true,
      url: localPath,
      path: localPath,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
}
