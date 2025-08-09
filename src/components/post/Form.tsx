import { useState } from "react";

export const PostForm = ({ categories = [], onSuccess = () => {} }) => {
  const [formData, setFormData] = useState({
    title: "",
    short_description: "",
    location: "",
    category: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const postData = {
      title: formData.title,
      short_description: formData.short_description,
      location: formData.location || "Not specified",
      created_at: Date.now(), // Current timestamp
      categories: formData.category ? [parseInt(formData.category, 10)] : [],
    };

    try {
      const token = localStorage.getItem("wayfare_token");
      if (!token) throw new Error("No token found");

      console.log("Sending post data:", postData); // Debug log
      console.log("Using token:", token); // Debug log

      const response = await fetch("http://localhost:8000/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(postData),
      });

      console.log("Response status:", response.status); // Debug log

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error response:", errorText); // Debug log
        throw new Error(`Failed to create post: ${response.status} ${errorText}`);
      }

      // Reset form
      setFormData({
        title: "",
        short_description: "",
        location: "",
        category: "",
      });

      onSuccess();
    } catch (error) {
      console.error("Submit error:", error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        
        {/* Title Field */}
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "500" }}>
            🎮 Post Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter post title"
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              border: "1px solid #ccc",
              borderRadius: "0.5rem",
            }}
            required
          />
        </div>

        {/* Description Field */}
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "500" }}>
            📝 Description
          </label>
          <textarea
            name="short_description"
            value={formData.short_description}
            onChange={handleChange}
            placeholder="Describe your post..."
            rows={4}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              border: "1px solid #ccc",
              borderRadius: "0.5rem",
              resize: "vertical"
            }}
            required
          />
        </div>

        {/* Location Field */}
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "500" }}>
            📍 Location (Optional)
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Where did this happen?"
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              border: "1px solid #ccc",
              borderRadius: "0.5rem",
            }}
          />
        </div>

        {/* Category Field */}
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "500" }}>
            🏷️ Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              border: "1px solid #ccc",
              borderRadius: "0.5rem",
            }}
            required
          >
            <option value="">Select a category</option>
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))
            ) : (
              <option disabled>No categories available</option>
            )}
          </select>
        </div>

        {/* Form Actions */}
        <div style={{ display: "flex", gap: "1rem", paddingTop: "1.5rem", borderTop: "1px solid #ccc" }}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              flex: 1,
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              fontWeight: "500",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              border: "1px solid #007bff",
              background: isSubmitting ? "#ccc" : "#007bff",
              color: "white",
            }}
          >
            {isSubmitting ? "Creating Post..." : "🚀 Create Post"}
          </button>
          
          <button
            type="button"
            onClick={() => {
              setFormData({
                title: "",
                short_description: "",
                location: "",
                category: "",
              });
            }}
            style={{
              padding: "0.75rem 1.5rem",
              border: "1px solid #ccc",
              borderRadius: "0.5rem",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            🔄 Reset Form
          </button>
        </div>
      </form>
    </div>
  );
};