import asyncHandler from "express-async-handler";
import { generateUploadURL } from "../utils/s3.js";

// @desc    Generate presigned URL for file upload
// @route   POST /api/upload/presigned-url
// @access  Private
export const getPresignedUrl = asyncHandler(async (req, res) => {
  const { fileType, folder } = req.body;
  const userId = req.user.userId;

  if (!fileType) {
    res.status(400);
    throw new Error("File type is required");
  }

  try {
    const { uploadURL, key, fileUrl, fileId } = await generateUploadURL(
      fileType,
      folder,
      userId
    );

    res.status(200).json({
      success: true,
      data: {
        uploadURL,
        key,
        fileUrl,
        fileId,
      },
    });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    res.status(500);
    throw new Error("Failed to generate upload URL: " + error.message);
  }
});
