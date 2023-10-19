"use client";
import { ChargingStationArray } from './map';
import Map from './map';


const markers: ChargingStationArray = [
  { id: 1, address: "Address1", lat: 1.2922, lng: 103.7766 },
  { id: 2, address: "Address2", lat: 1.3332674, lng: 103.6367302 },
];

function App() {
  return (
    <Map chargingStations={markers} />
  );
}

export default App;