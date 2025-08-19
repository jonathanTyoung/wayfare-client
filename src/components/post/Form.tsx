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

  // Effect for debounced location search
  useEffect(() => {
    const searchLocations = async () => {
      if (debouncedLocation.length < 3) {
        setLocationSuggestions([]);
        setIsLoadingLocations(false);
        return;
      }

      // Increment request counter for race condition handling
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
        // Only update if this is the latest request
        if (currentRequest === locationRequestRef.current) {
          console.error("Error fetching location suggestions:", err);
          setLocationSuggestions([]);
          setIsLoadingLocations(false);
        }
      }
    };

    searchLocations();
  }, [debouncedLocation]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const tagList = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const latitude = selectedLocation?.lat
      ? parseFloat(selectedLocation.lat.toFixed(6))
      : null;
    const longitude = selectedLocation?.lng
      ? parseFloat(selectedLocation.lng.toFixed(6))
      : null;

    if (formData.location && !selectedLocation) {
      alert("Please select a valid location from the suggestions.");
      setIsSubmitting(false);
      return;
    }

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

    try {
      // Create or update the post
      const createdOrUpdatedPost = await onSubmit(postData);
      if (photoFiles && photoFiles.length > 0) {
        await uploadPhotos(createdOrUpdatedPost.id, photoFiles); // now id is defined
      }

      navigate(returnTo);
      onSuccess();
    } catch (error) {
      alert(error.message || "Failed to submit post");
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate(-1); // fallback to browser history
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

  // --- Handle photo selection ---
  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files); // convert FileList to array
    setPhotoFiles(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPhotoPreviews(previews);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 rounded-xl shadow-lg bg-yellow-50 font-sans text-gray-900">
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block mb-2 font-semibold">
            Post Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter post title"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* Teaser Description */}
        <div>
          <label
            htmlFor="short_description"
            className="block mb-2 font-semibold"
          >
            📝 Description
          </label>
          <textarea
            id="short_description"
            name="short_description"
            value={formData.short_description}
            onChange={handleChange}
            placeholder="A teaser blip for your post..."
            rows={4}
            required
            className="w-full p-3 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* Long Form Text Description */}
        <div>
          <label
            htmlFor="long_form_description"
            className="block mb-2 font-semibold"
          >
            📝 Description
          </label>
          <textarea
            id="long_form_description"
            name="long_form_description"
            value={formData.long_form_description}
            onChange={handleChange}
            placeholder="Write your story here"
            rows={4}
            required
            className="w-full p-3 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* Location */}
        <div className="relative">
          <label htmlFor="location" className="block mb-2 font-semibold">
            📍 Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleLocationChange}
            placeholder="Type a city or place"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            autoComplete="off"
            required
          />

          {/* Loading indicator */}
          {isLoadingLocations && (
            <div className="absolute right-3 top-12 text-gray-500">
              <span className="animate-spin">🔄</span>
            </div>
          )}

          {/* Location suggestions */}
          {locationSuggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded-lg max-h-48 overflow-auto shadow-lg">
              {locationSuggestions.map((loc) => (
                <li
                  key={loc.place_id}
                  className="p-2 hover:bg-yellow-100 cursor-pointer border-b border-gray-100 last:border-b-0"
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
                  <div className="font-medium text-sm">{loc.display_name}</div>
                </li>
              ))}
            </ul>
          )}

          {/* Selected location coordinates */}
          {selectedLocation && (
            <div className="text-xs text-green-600 mt-1 font-medium">
              ✓ Selected: {selectedLocation.lat}, {selectedLocation.lng}
            </div>
          )}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category_id" className="block mb-2 font-semibold">
            🏷️ Category
          </label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block mb-2 font-semibold">
            📍 Tags (Optional)
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Add tags separated by commas, e.g. travel, summer, food"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label htmlFor="photo" className="block mb-2 font-semibold">
            📸 Upload a Photo
          </label>
          <input
            id="photo"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
               file:rounded-md file:border-0 file:text-sm file:font-semibold
               file:bg-yellow-100 file:text-yellow-700 hover:file:bg-yellow-200"
          />

          {photoPreviews && photoPreviews.length > 0 && (
            <div className="mt-4 flex gap-4 flex-wrap">
              <p className="w-full text-sm text-gray-600 mb-1">Preview:</p>
              {photoPreviews.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Preview ${idx + 1}`}
                  className="w-32 h-32 object-cover rounded-lg shadow-md"
                />
              ))}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-6 border-t border-gray-300">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 py-3 rounded-md font-semibold border border-blue-600 text-black ${
              isSubmitting
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-yellow-400 hover:bg-yellow-500 cursor-pointer"
            }`}
          >
            {isSubmitting
              ? mode === "edit"
                ? "Updating Post..."
                : "Creating Post..."
              : mode === "edit"
              ? "✏️ Update Post"
              : "🚀 Create Post"}
          </button>

          <button
            type="button"
            onClick={mode === "edit" ? handleBack : handleReset}
            className="py-3 px-6 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            {mode === "edit" ? "← Back" : "🔄 Reset Form"}
          </button>
        </div>
      </form>
    </div>
  );
};
