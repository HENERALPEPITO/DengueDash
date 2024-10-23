"use client";

import React from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import geoJsonData from "../assets/geojsons/iloilo_barangays_random.json";
import { GeoJsonObject } from "geojson";

interface GeoJSONFeature {
  properties: {
    shape4: string;
    count: number;
  };
  geometry: any;
}

const ClientMap = () => {
  const geoJson: GeoJsonObject = geoJsonData as GeoJsonObject;

  const geoStyler = (feature: GeoJSONFeature | undefined) => {
    if (!feature) return {};
    return {
      color: "white",
      weight: 1,
      fillColor: getColor(feature.properties.count),
      fillOpacity: 0.5,
    };
  };

  const getColor = (cases: number): string => {
    return cases > 150
      ? "#800026"
      : cases > 100
        ? "#BD0026"
        : cases > 75
          ? "#E31A1C"
          : cases > 50
            ? "#FC4E2A"
            : cases > 30
              ? "#FD8D3C"
              : cases > 20
                ? "#FEB24C"
                : cases > 10
                  ? "#FED976"
                  : "#FFEDA0";
  };

  return (
    <MapContainer
      style={{ height: "100vh" }}
      zoom={13}
      center={[10.7202, 122.5621]}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      />
      {geoJsonData && <GeoJSON data={geoJson} style={geoStyler} />}
    </MapContainer>
  );
};

export default ClientMap;
