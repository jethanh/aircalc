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

  const [latitudeA, setLatitudeA] = useState("");
  const [longitudeA, setLongitudeA] = useState("");
  const [latitudeB, setLatitudeB] = useState("");
  const [longitudeB, setLongitudeB] = useState("");

  L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
  });

  const calculateDistance = () => {
    const lat1 = parseFloat(latitudeA);
    const lon1 = parseFloat(longitudeA);
    const lat2 = parseFloat(latitudeB);
    const lon2 = parseFloat(longitudeB);

    if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
      // Check if any of the coordinates are not valid numbers
      setDistance("Invalid coordinates");
      setPointA(null);
      setPointB(null);
      return;
    }

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
    setPointA([lat1, lon1]);
    setPointB([lat2, lon2]);
  };

  const resetCalculator = () => {
    setPointA(null);
    setPointB(null);
    setDistance("");
    setLatitudeA("");
    setLongitudeA("");
    setLatitudeB("");
    setLongitudeB("");
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
      setLatitudeA(lat.toFixed(6));
      setLongitudeA(lng.toFixed(6));
      setPointA([lat, lng]);
    } else if (!pointB) {
      setLatitudeB(lat.toFixed(6));
      setLongitudeB(lng.toFixed(6));
      setPointB([lat, lng]);
    }
  };

  return (
    <div className="container">
      <h1>Air Distance Calculator</h1>
      <div className="form">
        <label htmlFor="pointA">Point A:</label>
        <input
          type="text"
          id="pointA"
          value={latitudeA}
          onChange={(e) => setLatitudeA(e.target.value)}
          placeholder="Latitude A"
        />
        <input
          type="text"
          id="pointALongitude"
          value={longitudeA}
          onChange={(e) => setLongitudeA(e.target.value)}
          placeholder="Longitude A"
        />
      </div>

      <div className="form">
        <label htmlFor="pointB">Point B:</label>
        <input
          type="text"
          id="pointB"
          value={latitudeB}
          onChange={(e) => setLatitudeB(e.target.value)}
          placeholder="Latitude B"
        />
        <input
          type="text"
          id="pointBLongitude"
          value={longitudeB}
          onChange={(e) => setLongitudeB(e.target.value)}
          placeholder="Longitude B"
        />
      </div>

      <button
        onClick={calculateDistance}
        disabled={!latitudeA || !longitudeA || !latitudeB || !longitudeB}
      >
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
