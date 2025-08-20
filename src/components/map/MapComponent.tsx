// MapComponent.jsx
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default Leaflet marker images
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

// Custom blue and red icons using your inline SVG approach
export const blueIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64," +
    btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="30" height="45" viewBox="0 0 30 45">
      <path d="M15 0C6.716 0 0 9.036 0 20.125 0 29 15 45 15 45s15-16 15-24.875C30 9.036 23.284 0 15 0z" fill="#007bff"/>
      <circle cx="15" cy="15" r="7" fill="white"/>
    </svg>`),
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [0, -40],
  shadowUrl,
  shadowSize: [41, 41],
});

export const redIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64," +
    btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="30" height="45" viewBox="0 0 30 45">
      <path d="M15 0C6.716 0 0 9.036 0 20.125 0 29 15 45 15 45s15-16 15-24.875C30 9.036 23.284 0 15 0z" fill="#ff4d4f"/>
      <circle cx="15" cy="15" r="7" fill="white"/>
    </svg>`),
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [0, -40],
  shadowUrl,
  shadowSize: [41, 41],
});

// Helper to update map center dynamically
function SetMapCenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

export const MapComponent = ({ trips, posts }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const centerLat = Number(params.get("lat")) || 40.7128;
  const centerLng = Number(params.get("lng")) || -74.006;

  return (
    <div
      style={{
        height: "96vh",
        width: "100%",
        padding: "60px",
        background: "#292524",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        border: "1px solid #e0e0e0",
        zIndex: 10,
      }}
    >
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <SetMapCenter lat={centerLat} lng={centerLng} />

        {/* Trips markers (blue)
        {trips.map((trip) => (
          <Marker
            key={trip.id}
            position={[Number(trip.latitude), Number(trip.longitude)]}
            icon={blueIcon}
          >
            <Popup>
              <div style={{ minWidth: "200px" }}>
                <h3 style={{ fontWeight: "bold", marginBottom: "8px" }}>
                  {trip.title}
                </h3>
                <p style={{ marginBottom: "8px", color: "#555" }}>
                  {trip.short_description}
                </p>
                <button
                  onClick={() => navigate(`/trips/${trip.id}`)}
                  style={{
                    marginTop: "8px",
                    padding: "6px 12px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  View Trip
                </button>
              </div>
            </Popup>
          </Marker>
        ))} */}

        {/* Posts markers (red) */}
        {posts
          .filter((post) => !post.trip_id)
          .map((post) => (
            <Marker
              key={post.id}
              position={[Number(post.latitude), Number(post.longitude)]}
              icon={redIcon}
            >
              <Popup>
                <div style={{ minWidth: "200px" }}>
                  <h3 style={{ fontWeight: "bold", marginBottom: "8px" }}>
                    {post.title}
                  </h3>
                  <p style={{ marginBottom: "8px", color: "#555" }}>
                    {post.short_description}
                  </p>
                  <button
                    onClick={() => navigate(`/posts/${post.id}`)}
                    style={{
                      marginTop: "8px",
                      padding: "6px 12px",
                      backgroundColor: "#ff0000",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    View Post
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
};
