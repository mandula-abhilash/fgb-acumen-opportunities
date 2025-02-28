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
 * @returns {Object} - Object containing upload URL and file key
 */
export const generateUploadURL = async (fileType, folder = "uploads") => {
  const fileExtension = fileType.split("/")[1];
  const fileName = `${uuidv4()}.${fileExtension}`;
  const key = `${folder}/${fileName}`;

  const putObjectParams = {
    Bucket: bucketName,
    Key: key,
    ContentType: fileType,
  };

  const command = new PutObjectCommand(putObjectParams);
  const uploadURL = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  return {
    uploadURL,
    key,
    fileUrl: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
  };
};

/**
 * Generate a presigned URL for downloading a file from S3
 * @param {string} key - S3 object key
 * @returns {string} - Presigned URL for downloading
 */
export const generateDownloadURL = async (key) => {
  const getObjectParams = {
    Bucket: bucketName,
    Key: key,
  };

  const command = new GetObjectCommand(getObjectParams);
  const downloadURL = await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  });

  return downloadURL;
};

/**
 * Get the public URL for a file in S3
 * @param {string} key - S3 object key
 * @returns {string} - Public URL
 */
export const getPublicUrl = (key) => {
  return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};
