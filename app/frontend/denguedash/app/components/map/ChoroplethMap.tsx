"use client";

import React from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import { GeoJsonObject } from "geojson";
import { Layer, LeafletEventHandlerFn } from "leaflet";
import geoJsonData from "@assets/geojsons/iloilo_barangays_random.json";

interface GeoJSONFeature {
  properties: {
    shape4: string;
    count: number;
  };
}

export default function ChoroplethMap() {
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

  const highlightFeature: LeafletEventHandlerFn = (e) => {
    const layer = e.target;

    layer.setStyle({
      color: "grey",
      weight: 2,
      fillOpacity: 0.7,
    });

    layer.bringToFront();
  };

  const resetHighlight: LeafletEventHandlerFn = (e) => {
    const layer = e.target;

    layer.setStyle({
      color: "white",
      weight: 1,
      fillOpacity: 0.5,
    });
  };

  const mapOnEachFeature = (feature: GeoJSONFeature, layer: Layer) => {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
    });

    layer.bindPopup(
      `<b>${feature.properties.shape4}</b><br>${feature.properties.count} cases`
    );
  };

  const ILOILO_CITY_COORDS: [number, number] = [10.73, 122.5521];
  const ZOOM_LEVEL: number = 13;

  return (
    <MapContainer
      style={{ height: "80vh" }}
      zoom={ZOOM_LEVEL}
      center={ILOILO_CITY_COORDS}
      dragging={false}
      touchZoom={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      boxZoom={false}
      keyboard={false}
      zoomControl={false}
    >
      {geoJsonData && (
        <GeoJSON
          data={geoJson}
          style={geoStyler}
          onEachFeature={mapOnEachFeature}
        />
      )}
    </MapContainer>
  );
}
