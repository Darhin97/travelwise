import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import styles from "./Map.module.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useCities } from "../contexts/CitiesContext";
import { useGeolocation } from "./hooks/useGeolocation";
import Button from "./Button";
import { useUrlPosition } from "./hooks/useUrlPosition";

const Map = () => {
  const { cities } = useCities();
  const [mapPositons, setMapPositions] = useState([40, -3.09]);

  const {
    getPosition,
    isLoading: isLoadingPosition,
    position: geolocationPosition,
  } = useGeolocation();

  const [mapLat, mapLng] = useUrlPosition();

  // sync the changing lat and lng
  useEffect(() => {
    if (mapLat && mapLng) setMapPositions([mapLat, mapLng]);
  }, [mapLat, mapLng]);

  //setting current position with geolocation
  useEffect(() => {
    if (geolocationPosition)
      setMapPositions([geolocationPosition.lat, geolocationPosition.lng]);
  }, [geolocationPosition]);

  return (
    <div className={styles.mapContainer}>
      {!geolocationPosition && (
        <Button type={"position"} onClick={getPosition}>
          {isLoadingPosition ? "loading...." : "Use your position"}
        </Button>
      )}
      <MapContainer
        center={mapPositons}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}

        <ChangeCenter position={mapPositons} />
        <DetectClick />
      </MapContainer>
    </div>
  );
};
//component used to change center when coordinates change
function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}

export default Map;
