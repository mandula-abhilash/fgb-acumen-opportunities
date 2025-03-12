import api from "@/visdak-auth/src/api/axiosInstance";

/**
 * Get a presigned URL for uploading a file to S3
 * @param {string} fileType - MIME type of the file
 * @param {string} folder - Folder path in S3 bucket
 * @param {Object} options - Additional options
 * @param {string} options.parentId - Parent UUID for grouping related files
 * @param {string} options.fileCategory - Category/type of the file
 * @returns {Promise<Object>} - Object containing upload URL and file key
 */
export const getPresignedUrl = async (
  fileType,
  folder = "uploads",
  options = {}
) => {
  try {
    const response = await api.post("/api/upload/presigned-url", {
      fileType,
      folder,
      ...options,
    });

    if (!response.data?.data?.uploadURL) {
      throw new Error("Invalid response format");
    }

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
    await api.put(uploadURL, file, {
      headers: {
        "Content-Type": file.type,
      },
      baseURL: "",
      withCredentials: false,
    });
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error(error.response?.data?.message || "Failed to upload file");
  }
};

/**
 * Upload a file to S3 (get presigned URL and upload)
 * @param {File} file - File to upload
 * @param {string} folder - Folder path in S3 bucket
 * @param {Object} options - Additional options
 * @param {string} options.parentId - Parent UUID for grouping related files
 * @param {string} options.fileCategory - Category/type of the file
 * @returns {Promise<Object>} - Object containing file URL and key
 */
export const uploadFile = async (file, folder = "uploads", options = {}) => {
  try {
    const { uploadURL, key, fileUrl, fileId, parentId } = await getPresignedUrl(
      file.type,
      folder,
      options
    );

    await uploadFileToS3(file, uploadURL);

    return { key, fileUrl, fileId, parentId };
  } catch (error) {
    console.error("Error in uploadFile:", error);
    throw error;
  }
};
