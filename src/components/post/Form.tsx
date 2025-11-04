import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { uploadPhotos } from "../data/PhotoData";

// Custom debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Updated PostForm component with debounced location search
export const PostForm = ({
  categories = [],
  initialData = {},
  onSubmit,
  onSuccess = () => {},
  mode = "create",
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.from || "/home";

  const [formData, setFormData] = useState({
    title: "",
    short_description: "",
    long_form_description: "",
    location: "",
    category_id: "",
    tags: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [photoFiles, setPhotoFiles] = useState(null);
  const [photoPreviews, setPhotoPreviews] = useState(null);

  // Debounce the location input with 400ms delay
  const debouncedLocation = useDebounce(formData.location, 400);

  // Ref to track the latest request to prevent race conditions
  const locationRequestRef = useRef(0);

  // Initialize form data and selected location
  useEffect(() => {
    setFormData({
      title: initialData.title || "",
      short_description: initialData.short_description || "",
      long_form_description: initialData.long_form_description || "",
      location: initialData.location_name || "",
      category_id: initialData.category?.id || "",
      tags: initialData.tags?.map((tag) => tag.name).join(", ") || "",
    });

    if (mode === "edit" && initialData.latitude && initialData.longitude) {
      setSelectedLocation({
        lat: parseFloat(initialData.latitude),
        lng: parseFloat(initialData.longitude),
        name: initialData.location_name || "",
      });
    }
  }, [
    initialData.title,
    initialData.short_description,
    initialData.long_form_description,
    initialData.location_name,
    initialData.category?.id,
    initialData.tags?.map((tag) => tag.name).join(", "),
    initialData.latitude,
    initialData.longitude,
    mode,
  ]);

  // Effect for debounced location search with double-selection fix
  useEffect(() => {
    // Skip fetching if user already selected this location
    if (selectedLocation?.name === debouncedLocation) {
      setLocationSuggestions([]);
      setIsLoadingLocations(false);
      return;
    }

    // If input is too short, clear suggestions
    if (debouncedLocation.length < 3) {
      setLocationSuggestions([]);
      setIsLoadingLocations(false);
      return;
    }

    const searchLocations = async () => {
      const currentRequest = ++locationRequestRef.current;
      setIsLoadingLocations(true);

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            debouncedLocation
          )}`
        );
        const data = await res.json();

        // Only update if this is the latest request
        if (currentRequest === locationRequestRef.current) {
          setLocationSuggestions(data.slice(0, 5));
          setIsLoadingLocations(false);
        }
      } catch (err) {
        if (currentRequest === locationRequestRef.current) {
          console.error("Error fetching location suggestions:", err);
          setLocationSuggestions([]);
          setIsLoadingLocations(false);
        }
      }
    };

    searchLocations();
  }, [debouncedLocation, selectedLocation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, location: value }));
    setSelectedLocation(null); // reset previous selection

    // Show loading state immediately if user is typing
    if (value.length >= 3) {
      setIsLoadingLocations(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare tags
      const tagList = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      // Prepare location
      const latitude = selectedLocation?.lat
        ? parseFloat(selectedLocation.lat.toFixed(6))
        : null;
      const longitude = selectedLocation?.lng
        ? parseFloat(selectedLocation.lng.toFixed(6))
        : null;

      if (formData.location && !selectedLocation) {
        alert("Please select a valid location from the suggestions.");
        return;
      }

      // Build post payload
      const postData = {
        title: formData.title,
        short_description: formData.short_description,
        long_form_description: formData.long_form_description,
        location_name: formData.location || "Not specified",
        category_id: formData.category_id
          ? parseInt(formData.category_id, 10)
          : null,
        tags: tagList,
        latitude,
        longitude,
      };

      // Create or update the post
      const createdOrUpdatedPost = await onSubmit(postData);
      console.log("Post creation response:", createdOrUpdatedPost);
      if (!createdOrUpdatedPost?.id) {
        throw new Error("Post creation failed: missing post ID.");
      }

      // Upload photos if any
      if (photoFiles && photoFiles.length > 0) {
        try {
          await uploadPhotos(createdOrUpdatedPost.id, photoFiles);
        } catch (err) {
          console.error("Photo upload failed:", err);
          alert("Post created, but photo upload failed.");
        }
      }

      // Navigate and call success callback
      navigate(returnTo);
      onSuccess();
    } catch (error: any) {
      alert(error.message || "Failed to submit post");
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: initialData.title || "",
      short_description: initialData.short_description || "",
      long_form_description: initialData.long_form_description || "",
      location: initialData.location_name || "",
      category_id: initialData.category?.id || "",
      tags: initialData.tags?.map((tag) => tag.name).join(", ") || "",
    });

    setSelectedLocation(
      mode === "edit" && initialData.latitude && initialData.longitude
        ? {
            lat: parseFloat(initialData.latitude),
            lng: parseFloat(initialData.longitude),
            name: initialData.location_name || "",
          }
        : null
    );

    setLocationSuggestions([]);
    setIsLoadingLocations(false);
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotoFiles(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPhotoPreviews(previews);
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-[#A0A0A0] rounded-2xl shadow-lg border border-gray-100">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {mode === "edit" ? "✏️ Edit Post" : "✨ Create New Post"}
        </h1>
        <p className="text-gray-600">
          {mode === "edit"
            ? "Update your post details below"
            : "Share your story with the community"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-gray-700"
          >
            Post Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Give your post an engaging title..."
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Short Description */}
        <div className="space-y-2">
          <label
            htmlFor="short_description"
            className="block text-sm font-semibold text-gray-700"
          >
            📝 Short Description
          </label>
          <textarea
            id="short_description"
            name="short_description"
            value={formData.short_description}
            onChange={handleChange}
            placeholder="Write a brief, engaging summary..."
            rows={3}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Long Form Description */}
        <div className="space-y-2">
          <label
            htmlFor="long_form_description"
            className="block text-sm font-semibold text-gray-700"
          >
            📖 Full Story
          </label>
          <textarea
            id="long_form_description"
            name="long_form_description"
            value={formData.long_form_description}
            onChange={handleChange}
            placeholder="Tell your full story here..."
            rows={6}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Location */}
        <div className="space-y-2 relative">
          <label
            htmlFor="location"
            className="block text-sm font-semibold text-gray-700"
          >
            📍 Location
          </label>
          <div className="relative">
            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleLocationChange}
              placeholder="Start typing a city or place..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              autoComplete="off"
              required
            />

            {/* Loading indicator */}
            {isLoadingLocations && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <span className="animate-spin text-lg">🔄</span>
              </div>
            )}
          </div>

          {/* Location suggestions */}
          {locationSuggestions.length > 0 && (
            <ul className="absolute z-20 bg-white border border-gray-200 w-full mt-1 rounded-lg max-h-48 overflow-auto shadow-lg">
              {locationSuggestions.map((loc) => (
                <li
                  key={loc.place_id}
                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      location: loc.display_name,
                    }));
                    setSelectedLocation({
                      lat: parseFloat(loc.lat),
                      lng: parseFloat(loc.lon),
                      name: loc.display_name,
                    });
                    setLocationSuggestions([]);
                  }}
                >
                  <div className="text-sm text-gray-800">
                    {loc.display_name}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Selected location confirmation */}
          {selectedLocation && (
            <div className="flex items-center gap-2 mt-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
              <span>✓</span>
              <span>
                Location selected: {selectedLocation.name.split(",")[0]}
              </span>
            </div>
          )}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label
            htmlFor="category_id"
            className="block text-sm font-semibold text-black-700"
          >
            🏷️ Category
          </label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-black-400"
          >
            <option value="">Choose a category...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label
            htmlFor="tags"
            className="block text-sm font-semibold text-gray-700"
          >
            🏷️ Tags
            <span className="text-gray-500 font-normal ml-1">(Optional)</span>
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            value={formData.tags}
            onChange={handleChange}
            placeholder="travel, summer, food, adventure..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          <p className="text-xs text-gray-500">
            Separate multiple tags with commas
          </p>
        </div>

        {/* Photo Upload */}
        <div className="space-y-2">
          <label
            htmlFor="photo"
            className="block text-sm font-semibold text-gray-700"
          >
            📸 Photos
            <span className="text-gray-500 font-normal ml-1">(Optional)</span>
          </label>
          <input
            id="photo"
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoChange}
            className="block w-full text-sm text-gray-600 
                       file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 
                       file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 
                       hover:file:bg-blue-100 transition-colors duration-200"
          />

          {photoPreviews && photoPreviews.length > 0 && (
            <div className="mt-4 space-y-3">
              <p className="text-sm font-medium text-gray-700">
                Photo Preview:
              </p>
              <div className="flex gap-3 flex-wrap">
                {photoPreviews.map((url, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${idx + 1}`}
                      className="w-24 h-24 object-cover rounded-lg shadow-md border border-gray-200 group-hover:shadow-lg transition-shadow duration-200"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#05b88b] hover:bg-[#fbbf24] active:bg-blue-800 shadow-md hover:shadow-lg"
            }`}
          >
            {isSubmitting
              ? mode === "edit"
                ? "Updating..."
                : "Creating..."
              : mode === "edit"
              ? "✏️ Update Post"
              : "🚀 Create Post"}
          </button>

          <button
            type="button"
            onClick={mode === "edit" ? handleBack : handleReset}
            className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold bg-white hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {mode === "edit" ? "← Back" : "🔄 Reset"}
          </button>
        </div>
      </form>
    </div>
  );
};
