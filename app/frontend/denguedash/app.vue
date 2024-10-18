<template>
  <div style="height: 100vh">
    <LMap
      ref="map"
      :zoom="zoom"
      :center="[10.7202, 122.5621]"
      :use-global-leaflet="false"
      :options="mapOptions"
    >
      <LGeoJson
        :geojson="geojson"
        :options-style="geoStyler"
        :options="{
          onEachFeature: (feature, layer) => {
            layer.on({
              mouseover: highlightFeature,
              mouseout: resetHighlight,
            });
            layer.bindPopup(
              `<b>${feature.properties.shape4}</b><br>${feature.properties.count} cases`,
            );
          },
        }"
      />
    </LMap>
  </div>
</template>

<script setup>
import { ref } from "vue";
import geojsonData from "@/assets/iloilo_barangays_random.json";

const zoom = ref(13);
const geojson = ref(geojsonData);

const mapOptions = {
  dragging: false,
  touchZoom: false,
  scrollWheelZoom: false,
  doubleClickZoom: false,
  boxZoom: false,
  keyboard: false,
  zoomControl: false,
  // Optionally, disable tap for mobile devices
  tap: false,
};

const geoStyler = (feature) => ({
  color: "white",
  weight: 1,
  fillColor: getColor(feature.properties.count),
  fillOpacity: 0.5,
});

function getColor(d) {
  return d > 150
    ? "#800026"
    : d > 100
      ? "#BD0026"
      : d > 75
        ? "#E31A1C"
        : d > 50
          ? "#FC4E2A"
          : d > 30
            ? "#FD8D3C"
            : d > 20
              ? "#FEB24C"
              : d > 10
                ? "#FED976"
                : "#FFEDA0";
}

function highlightFeature(e) {
  const layer = e.target;

  layer.setStyle({
    color: "grey",
    weight: 2,
    fillOpacity: 0.7,
  });

  layer.bringToFront();
}

function resetHighlight(e) {
  const layer = e.target;

  layer.setStyle({
    color: "white",
    weight: 1,
    fillOpacity: 0.5,
  });
}
</script>
