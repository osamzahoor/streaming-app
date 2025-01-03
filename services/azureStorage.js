/**
 * Azure Storage Middleware
 * This middleware provides utilities for handling file uploads and interacting with Azure Blob Storage.
 * 
 * Features:
 * - Video upload middleware with validation for size and format
 * - Metadata retrieval for uploaded videos
 * - General file upload middleware for non-video files
 * 
 * Security:
 * - Uses connection strings stored in environment variables for secure configuration.
 * - Supports setting metadata and content settings for better organization and cache control.
 * 
 * Dependencies:
 * - `@azure/storage-blob` for interacting with Azure Blob Storage
 * - `multer` for handling multipart form-data (file uploads)
 * - `dotenv` for environment variable management
 */
const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');
require('dotenv').config();

// Azure Storage Middleware Class
class AzureStorageMiddleware {
    constructor() {
         // Load Azure Storage connection details from environment variables
        this.connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
        this.containerName = process.env.CONTAINER_NAME;

        // Configure Multer with file size limits (500MB for videos by default)
        this.upload = multer({
            limits: {
                fileSize: 524288000, // 500MB default limit for videos
            }
        });

     // List of allowed video formats for validation
        this.allowedVideoFormats = [
            'video/mp4',
            'video/mpeg',
            'video/quicktime',
            'video/x-msvideo',
            'video/x-ms-wmv',
            'video/webm'
        ];

        if (!this.connectionString || !this.containerName) {
            throw new Error('Azure Storage configuration missing');
        }

        // Initialize Blob Service and Container Client

        this.blobServiceClient = BlobServiceClient.fromConnectionString(this.connectionString);
        this.containerClient = this.blobServiceClient.getContainerClient(this.containerName);
    }

    /**
     * Video Upload Middleware
     * Handles video uploads, validates file format and size, and stores the file in Azure Blob Storage.
     * 
     * @param {string} [fieldName='video'] - The name of the field in the multipart form-data
     * @returns {Function} Middleware function for handling video uploads
     */
    uploadVideo(fieldName = 'video') {
        return async (req, res, next) => {
            try {
                this.upload.single(fieldName)(req, res, async (err) => {
                     // Handle Multer errors
                    if (err instanceof multer.MulterError) {
                        if (err.code === 'LIMIT_FILE_SIZE') {
                            return res.status(400).json({ error: 'File size exceeds limit (500MB)' });
                        }
                        return res.status(400).json({ error: err.message });
                    }

                    if (!req.file) {
                        return res.status(400).json({ error: 'No video file uploaded' });
                    }

                    // Validate video format
                    if (!this.allowedVideoFormats.includes(req.file.mimetype)) {
                        return res.status(400).json({ 
                            error: 'Invalid video format. Allowed formats: MP4, MPEG, MOV, AVI, WMV, WebM' 
                        });
                    }

                    try {
                        const blobName = `videos/${Date.now()}-${req.file.originalname}`;
                        const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);

                        // Set content settings for video
                        const options = {
                            blobHTTPHeaders: {
                                blobContentType: req.file.mimetype,
                                blobCacheControl: 'public, max-age=31536000'
                            }
                        };

                        // Upload to Azure Blob Storage with metadata
                        await blockBlobClient.upload(req.file.buffer, req.file.size, options);

                        // Add video metadata
                        await blockBlobClient.setMetadata({
                            originalName: req.file.originalname,
                            contentType: req.file.mimetype,
                            uploadDate: new Date().toISOString()
                        });

                        // Attach file details to the request object for further use
                        req.fileDetails = {
                            url: blockBlobClient.url,
                            blobName: blobName,
                            originalName: req.file.originalname,
                            size: req.file.size,
                            contentType: req.file.mimetype,
                            uploadDate: new Date().toISOString()
                        };

                        next();
                    } catch (error) {
                        next(error);
                    }
                });
            } catch (error) {
                next(error);
            }
        };
    }

     /**
     * Get Video Metadata Middleware
     * Retrieves metadata and properties for a specific video stored in Azure Blob Storage.
     * 
     * @returns {Function} Middleware function for fetching video metadata
     */
    getVideoMetadata() {
        return async (req, res, next) => {
            try {
                const { blobName } = req.params;
                const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
                
                const properties = await blockBlobClient.getProperties();
                const metadata = properties.metadata;
                
                req.videoMetadata = {
                    ...metadata,
                    contentLength: properties.contentLength,
                    contentType: properties.contentType,
                    lastModified: properties.lastModified
                };
                
                next();
            } catch (error) {
                next(error);
            }
        };
    }

   /**
     * File Upload Middleware
     * Handles uploads for general files (non-video files) and stores them in Azure Blob Storage.
     * 
     * @param {string} [fieldName='file'] - The name of the field in the multipart form-data
     * @returns {Function} Middleware function for handling file uploads
     */
    uploadFile(fieldName = 'file') {
        return async (req, res, next) => {
            try {
                this.upload.single(fieldName)(req, res, async (err) => {
                    if (err) {
                        return res.status(400).json({ error: err.message });
                    }
                    if (!req.file) {
                        return res.status(400).json({ error: 'No file uploaded' });
                    }

                    const blobName = `files/${Date.now()}-${req.file.originalname}`;
                    const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);

                    await blockBlobClient.upload(req.file.buffer, req.file.size);

                    req.fileDetails = {
                        url: blockBlobClient.url,
                        blobName: blobName,
                        originalName: req.file.originalname,
                        size: req.file.size,
                        contentType: req.file.mimetype
                    };

                    next();
                });
            } catch (error) {
                next(error);
            }
        };
    }
}

module.exports = new AzureStorageMiddleware();