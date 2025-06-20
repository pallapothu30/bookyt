import React, { useState } from "react";
import { useFirebase } from "../context/Firebase";
import toast from "react-hot-toast";

const AddNewBook = () => {
  const firebase = useFirebase();

  const [title, setTitle] = useState("");
  const [isbnNumber, setIsbnNumber] = useState("");
  const [price, setPrice] = useState("");
  const [coverPic, setCoverPic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be less than 2MB.");
      return;
    }

    setError("");
    setLoading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      const res = await fetch(uploadUrl, {
        method: "POST",
        body: data,
      });

      const cloudData = await res.json();
      setCoverPic(cloudData.secure_url);
      setPreviewUrl(cloudData.secure_url);
      toast.success("Image uploaded!");
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload image.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !isbnNumber || !price || !coverPic) {
      setError("Please fill in all fields.");
      return;
    }

    if (isNaN(price) || price <= 0) {
      setError("Price must be a positive number.");
      return;
    }

    
    try {
      await firebase.handleCreateNewListing(title, isbnNumber, price, coverPic);
      toast.success("Book listed successfully!");

      // Reset form
      setTitle("");
      setIsbnNumber("");
      setPrice("");
      setCoverPic(null);
      setPreviewUrl(null);
      document.getElementById("coverPic").value = "";
    } catch (err) {
      console.error(err);
      toast.error("Failed to list book.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        className="bg-white p-8 rounded shadow-md w-full max-w-lg"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold mb-6 text-center">List a New Book</h1>

        {error && <div className="mb-4 text-red-600 text-sm text-center">{error}</div>}

        {/* Book Title */}
        <div className="mb-5">
          <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-700">
            Book Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            placeholder="Enter book title"
            required
          />
        </div>

        {/* ISBN */}
        <div className="mb-5">
          <label htmlFor="isbnNumber" className="block mb-2 text-sm font-medium text-gray-700">
            ISBN Number
          </label>
          <input
            type="text"
            id="isbnNumber"
            value={isbnNumber}
            onChange={(e) => setIsbnNumber(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            placeholder="Enter ISBN number"
            required
          />
        </div>

        {/* Price */}
        <div className="mb-5">
          <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            placeholder="Enter price"
            required
          />
        </div>

        {/* Cover Picture Upload */}
        <div className="mb-5">
          <label htmlFor="coverPic" className="block mb-2 text-sm font-medium text-gray-700">
            Cover Picture
          </label>

          <input
            type="file"
            id="coverPic"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          {loading ? (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg
                className="animate-spin h-5 w-5 text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                />
              </svg>
              Uploading...
            </div>
          ) : (
            <label
              htmlFor="coverPic"
              className="inline-block cursor-pointer bg-gray-800 text-white font-medium text-sm px-3 py-2 rounded-lg transition"
            >
              Choose File
            </label>
          )}

          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="mt-4 w-32 h-40 object-cover rounded shadow border"
            />
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full ${
            loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          } text-white font-medium rounded-lg text-sm px-5 py-2.5`}
        >
          {loading ? "Uploading..." : "List Book"}
        </button>
      </form>
    </div>
  );
};

export default AddNewBook;
