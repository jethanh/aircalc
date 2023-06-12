import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

function AirDistanceCalculator() {
  const [pointA, setPointA] = useState(null);
  const [pointB, setPointB] = useState(null);
  const [distance, setDistance] = useState("");

  L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
  });

  const calculateDistance = () => {
    if (pointA && pointB) {
      const [lat1, lon1] = pointA;
      const [lat2, lon2] = pointB;

      const R = 6371; // Radius of the Earth in km
      const dLat = deg2rad(lat2 - lat1);
      const dLon = deg2rad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
          Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      setDistance(distance.toFixed(2) + " km");
    }
  };

  const resetCalculator = () => {
    setPointA(null);
    setPointB(null);
    setDistance("");
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  function MapEvents() {
    useMapEvents({
      click: handleMapClick,
    });

    return null;
  }

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;

    if (!pointA) {
      setPointA([lat, lng]);
    } else if (!pointB) {
      setPointB([lat, lng]);
    }
  };

  return (
    <div className="container">
      <h1>Air Distance Calculator</h1>
      <button onClick={calculateDistance} disabled={!pointA || !pointB}>
        Calculate
      </button>
      {distance && <p>Distance: {distance}</p>}
      <button onClick={resetCalculator}>Reset</button>
      <div className="map-container">
        <MapContainer center={[0, 0]} zoom={2} style={{ height: "400px", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapEvents />
          {pointA && <Marker position={pointA} />}
          {pointB && <Marker position={pointB} />}
        </MapContainer>
      </div>
    </div>
  );
}

export default AirDistanceCalculator;
