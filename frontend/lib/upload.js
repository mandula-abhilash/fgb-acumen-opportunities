import axios from "axios";

/**
 * Get a presigned URL for uploading a file to S3
 * @param {string} fileType - MIME type of the file
 * @param {string} folder - Folder path in S3 bucket
 * @returns {Promise<Object>} - Object containing upload URL and file key
 */
export const getPresignedUrl = async (fileType, folder = "uploads") => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/upload/presigned-url`,
      { fileType, folder },
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error getting presigned URL:", error);
    throw new Error(
      error.response?.data?.message || "Failed to get upload URL"
    );
  }
};

/**
 * Upload a file to S3 using a presigned URL
 * @param {File} file - File to upload
 * @param {string} uploadURL - Presigned URL for uploading
 * @returns {Promise<void>}
 */
export const uploadFileToS3 = async (file, uploadURL) => {
  try {
    await axios.put(uploadURL, file, {
      headers: {
        "Content-Type": file.type,
      },
    });
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("Failed to upload file");
  }
};

/**
 * Upload a file to S3 (get presigned URL and upload)
 * @param {File} file - File to upload
 * @param {string} folder - Folder path in S3 bucket
 * @returns {Promise<Object>} - Object containing file URL and key
 */
export const uploadFile = async (file, folder = "uploads") => {
  try {
    // Get presigned URL
    const { uploadURL, key, fileUrl } = await getPresignedUrl(
      file.type,
      folder
    );

    // Upload file to S3
    await uploadFileToS3(file, uploadURL);

    return { key, fileUrl };
  } catch (error) {
    console.error("Error in uploadFile:", error);
    throw error;
  }
};
