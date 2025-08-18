// MapComponent.jsx
import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom"; // <-- added

// Import marker images instead of using require
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// Fix default Leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

export const MapComponent = ({ posts, onAddPost }) => {
  const [newPostLocation, setNewPostLocation] = useState(null);
  const navigate = useNavigate(); // <-- added

  // Handle clicks on the map
  function MapClickHandler() {
    useMapEvents({
      click(e) {
        setNewPostLocation(e.latlng);
      },
    });
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const description = e.target.description.value;
    if (newPostLocation && title) {
      onAddPost({
        lat: newPostLocation.lat,
        lng: newPostLocation.lng,
        title,
        description,
      });
      setNewPostLocation(null);
    }
  };

  return (
    <MapContainer
      center={[40.7128, -74.006]} // Default center (NYC)
      zoom={13}
      style={{ height: "96vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      <MapClickHandler />

      {posts
        .filter((post) => {
          const lat = Number(post.latitude);
          const lng = Number(post.longitude);
          return (
            !isNaN(lat) &&
            !isNaN(lng) &&
            lat >= -90 &&
            lat <= 90 &&
            lng >= -180 &&
            lng <= 180
          );
        })
        .map((post) => (
          <Marker
            key={post.id}
            position={[Number(post.latitude), Number(post.longitude)]}
          >
            <Popup>
              <h3>{post.title}</h3>
              <p>{post.short_description}</p>
              <button
                onClick={() => navigate(`/posts/${post.id}`)} // <-- added
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                View Details
              </button>
            </Popup>
          </Marker>
        ))}

      {newPostLocation && (
        <Marker position={newPostLocation}>
          <Popup>
            <form onSubmit={handleSubmit}>
              <input type="text" name="title" placeholder="Title" required />
              <textarea name="description" placeholder="Description" />
              <button type="submit">Add Post</button>
            </form>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};
