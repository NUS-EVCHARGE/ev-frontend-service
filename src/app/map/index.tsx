import {
  GoogleMap,
  Marker,
  useLoadScript,
  InfoWindow,
} from "@react-google-maps/api";
import { useEffect, useState } from "react";

const Map = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: String(process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_API_KEY),
  });

  const markers = [
    { address: "Address1", lat: 1.2922, lng: 103.7766 },
    { address: "Address2", lat: 1.3332674, lng: 103.6367302 },
  ];

  const [mapRef, setMapRef] = useState<google.maps.Map>();
  const [isOpen, setIsOpen] = useState(false);
  const [infoWindowData, setInfoWindowData] = useState<{
    id: number;
    address: string;
  }>();
  const [currentLocation, setCurrentLocation] =
    useState<GeolocationCoordinates | null>(null);

  const customMarker = {
    path: "M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759   c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z    M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713   v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336   h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805",
    fillColor: "blue",
    fillOpacity: 2,
    strokeWeight: 1,
    rotation: 0,
    scale: 1,
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleMarkerClick = (
    id: number,
    lat: number,
    lng: number,
    address: string
  ) => {
    mapRef?.panTo({ lat, lng });
    setInfoWindowData({ id, address });
    setIsOpen(true);
  };

  const onMapLoad = (map: google.maps.Map) => {
    setMapRef(map);
    const bounds = new google.maps.LatLngBounds();
    markers?.forEach(({ lat, lng }) => bounds.extend({ lat, lng }));
    if (currentLocation !== null) {
      bounds.extend({
        lat: currentLocation?.latitude,
        lng: currentLocation?.longitude,
      });
    }
    map.fitBounds(bounds);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation(position.coords);
          if (mapRef !== undefined) {
            onMapLoad(mapRef);
          }
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported in this browser.");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
      }}
    >
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerStyle={{
            height: "100%",
            width: "100%",
          }}
          onLoad={onMapLoad}
          onClick={() => setIsOpen(false)}
        >
          {markers.map(({ address, lat, lng }, ind) => (
            <Marker
              key={ind}
              position={{ lat, lng }}
              onClick={() => {
                handleMarkerClick(ind, lat, lng, address);
              }}
            >
              {isOpen && infoWindowData?.id === ind && (
                <InfoWindow
                  onCloseClick={() => {
                    setIsOpen(false);
                  }}
                >
                  <h3 style={{ color: "black" }}>{infoWindowData?.address}</h3>
                </InfoWindow>
              )}
            </Marker>
          ))}

          {currentLocation && (
            <Marker
              position={{
                lat: currentLocation.latitude,
                lng: currentLocation.longitude,
              }}
              icon={customMarker}
            />
          )}
        </GoogleMap>
      )}
    </div>
  );
};

export default Map;
