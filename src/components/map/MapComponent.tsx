// MapComponent.jsx
import { useEffect } from "react";
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

// Amber teardrop pin. Variable name kept as `redIcon` to preserve
// the module's public export shape; visually it is the app-accent pin.
export const redIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64," +
    btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="28" viewBox="0 0 20 28">
      <path d="M10 0C4.48 0 0 4.48 0 10c0 5 5 11 10 18c5-7 10-13 10-18C20 4.48 15.52 0 10 0z" fill="#fbbf24" stroke="#292524" stroke-width="1"/>
    </svg>`),
  iconSize: [20, 28],
  iconAnchor: [10, 28],
  popupAnchor: [0, -26],
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
    <div className="h-[96vh] w-full bg-app-bg rounded-xl overflow-hidden border border-stone-700 shadow-lg z-10">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={13}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <SetMapCenter lat={centerLat} lng={centerLng} />

        {/* Posts markers (amber) */}
        {posts
          .filter((post) => !post.trip_id)
          .map((post) => (
            <Marker
              key={post.id}
              position={[Number(post.latitude), Number(post.longitude)]}
              icon={redIcon}
            >
              <Popup>
                <div className="min-w-[220px] p-3 bg-app-surface text-stone-100">
                  <h3 className="font-special text-lg leading-tight mb-1">
                    {post.title}
                  </h3>
                  <p className="text-app-muted text-sm mb-3">
                    {post.short_description}
                  </p>
                  <button
                    onClick={() => navigate(`/posts/${post.id}`)}
                    className="px-3 py-1.5 rounded-md bg-app-accent text-stone-900 text-sm font-medium hover:bg-app-accent-hover transition-colors"
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
