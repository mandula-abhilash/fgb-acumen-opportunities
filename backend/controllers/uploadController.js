import asyncHandler from "express-async-handler";
import { generateUploadURL } from "../utils/s3.js";

// @desc    Generate presigned URL for file upload
// @route   POST /api/upload/presigned-url
// @access  Private
export const getPresignedUrl = asyncHandler(async (req, res) => {
  const { fileType, folder, parentId, fileCategory } = req.body;
  const userId = req.user.userId;

  if (!fileType) {
    res.status(400);
    throw new Error("File type is required");
  }

  try {
    const {
      uploadURL,
      key,
      fileUrl,
      fileId,
      parentId: generatedParentId,
    } = await generateUploadURL(fileType, folder, userId, {
      parentId,
      fileCategory,
    });

    res.status(200).json({
      success: true,
      data: {
        uploadURL,
        key,
        fileUrl,
        fileId,
        parentId: generatedParentId,
      },
    });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    res.status(500);
    throw new Error("Failed to generate upload URL: " + error.message);
  }
});
