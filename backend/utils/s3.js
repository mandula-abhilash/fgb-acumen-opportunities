import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Bucket name from environment variables
const bucketName = process.env.AWS_S3_BUCKET_NAME;

/**
 * Generate a presigned URL for uploading a file to S3
 * @param {string} fileType - MIME type of the file
 * @param {string} folder - Folder path in S3 bucket
 * @param {string} userId - User ID for organizing files
 * @returns {Object} - Object containing upload URL and file key
 */
export const generateUploadURL = async (
  fileType,
  folder = "uploads",
  userId
) => {
  try {
    if (!bucketName) {
      throw new Error("AWS S3 bucket name not configured");
    }

    if (!userId) {
      throw new Error("User ID is required for file organization");
    }

    const fileId = uuidv4();
    const fileExtension = fileType.split("/")[1] || "";

    // Structure: users/{userId}/{folder}/{fileId}.{extension}
    const key = `users/${userId}/${folder}/${fileId}.${fileExtension}`;

    const putObjectParams = {
      Bucket: bucketName,
      Key: key,
      ContentType: fileType,
    };

    const command = new PutObjectCommand(putObjectParams);
    const uploadURL = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    return {
      uploadURL,
      key,
      fileUrl: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
      fileId, // Return the fileId for reference
    };
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw error;
  }
};

/**
 * Generate a presigned URL for downloading a file from S3
 * @param {string} key - S3 object key
 * @returns {string} - Presigned URL for downloading
 */
export const generateDownloadURL = async (key) => {
  try {
    if (!bucketName) {
      throw new Error("AWS S3 bucket name not configured");
    }

    const getObjectParams = {
      Bucket: bucketName,
      Key: key,
    };

    const command = new GetObjectCommand(getObjectParams);
    const downloadURL = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    return downloadURL;
  } catch (error) {
    console.error("Error generating download URL:", error);
    throw error;
  }
};

/**
 * Get the public URL for a file in S3
 * @param {string} key - S3 object key
 * @returns {string} - Public URL
 */
export const getPublicUrl = (key) => {
  if (!bucketName) {
    throw new Error("AWS S3 bucket name not configured");
  }
  return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};
