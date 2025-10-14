import React from "react";

export const PhotoCarousel = ({ photos }) => {
  if (!photos || photos.length === 0) return null;

  return (
    <div
      className="photo-carousel"
      style={{ display: "flex", overflowX: "auto", gap: "8px" }}
    >
      {photos.map((photo) => (
        <img
          key={photo.url}
          src={photo.url}
          alt="Post media"
          style={{ height: "300px", borderRadius: "8px", flexShrink: 0 }}
        />
      ))}
    </div>
  );
};
