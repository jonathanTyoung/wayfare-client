import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { geocodeCity } from "../data/MapData.ts"; // your geocoding helper

export const PostForm = ({
  categories = [],
  initialData = {},
  onSubmit, // async function(postData)
  onSuccess = () => {},
  mode = "create", // "create" or "edit"
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.from || "/home";

  const [formData, setFormData] = useState({
    title: "",
    short_description: "",
    location: "",
    category_id: "",
    tags: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null); // store lat/lng

  useEffect(() => {
    setFormData({
      title: initialData.title || "",
      short_description: initialData.short_description || "",
      location: initialData.location_name || "",
      category_id: initialData.category?.id || "",
      tags: initialData.tags?.map((tag) => tag.name).join(", ") || "",
    });
  }, [
    initialData.title,
    initialData.short_description,
    initialData.location_name,
    initialData.category?.id,
    initialData.tags?.map((tag) => tag.name).join(", "),
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const tagList = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    // Use selectedLocation from autocomplete
    const latitude = selectedLocation?.lat
      ? parseFloat(selectedLocation.lat.toFixed(6))
      : null;
    const longitude = selectedLocation?.lng
      ? parseFloat(selectedLocation.lng.toFixed(6))
      : null;

    // If the user typed a location but didn’t select from suggestions, block submit
    if (formData.location && !selectedLocation) {
      alert("Please select a valid location from the suggestions.");
      setIsSubmitting(false);
      return;
    }

    const postData = {
      title: formData.title,
      short_description: formData.short_description,
      location_name: formData.location || "Not specified",
      category_id: formData.category_id
        ? parseInt(formData.category_id, 10)
        : null,
      tags: tagList,
      latitude,
      longitude,
    };

    try {
      await onSubmit(postData);
      navigate(returnTo);
    } catch (error) {
      alert(error.message || "Failed to submit post");
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => navigate(returnTo);
  const handleLocationChange = async (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, location: value }));
    setSelectedLocation(null); // reset previous selection

    if (value.length < 3) {
      setLocationSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          value
        )}`
      );
      const data = await res.json();
      setLocationSuggestions(data.slice(0, 5)); // top 5 results
    } catch (err) {
      console.error("Error fetching location suggestions:", err);
      setLocationSuggestions([]);
    }
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

        {/* Description */}
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
            placeholder="Describe your post..."
            rows={4}
            required
            className="w-full p-3 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/*  location handling with tagged location names for lat/long */}
        <div className="relative">
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

          {locationSuggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded-lg max-h-48 overflow-auto">
              {locationSuggestions.map((loc) => (
                <li
                  key={loc.place_id}
                  className="p-2 hover:bg-yellow-100 cursor-pointer"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      location: loc.display_name,
                    }));
                    setSelectedLocation({
                      lat: parseFloat(loc.lat),
                      lng: parseFloat(loc.lon),
                    });
                    setLocationSuggestions([]);
                  }}
                >
                  {loc.display_name}
                </li>
              ))}
            </ul>
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
            onClick={handleBack}
            className="py-3 px-6 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            {mode === "edit" ? "← Back" : "🔄 Reset Form"}
          </button>
        </div>
      </form>
    </div>
  );
};
