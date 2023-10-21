"use client";
import { ChargingStationArray } from './map';
import Map from './map';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getJwtToken } from './utils';


const markers: ChargingStationArray = [
  { id: 1, address: "Address1", lat: 1.2922, lng: 103.7766 },
  { id: 2, address: "Address2", lat: 1.3332674, lng: 103.6367302 },
];

const chargerUrl = String(process.env.NEXT_PUBLIC_REACT_APP_BASE_URL) + "/charger"


function App() {
  const [chargingStationList, setChargingStationList] = useState<ChargingStationArray>([]);
  async function GetAllCharger() {
    const jwtToken = await getJwtToken();
    console.log(jwtToken)
    const { data } = await axios.get(chargerUrl, {
      headers: {
        Accept: 'application/json',
        Authentication: jwtToken?.toString()
      }
    })
    console.log(data)
    // todo: set data to markers here
    setChargingStationList(markers)
  }
  useEffect(() => {
    GetAllCharger()
  }, [])

  return (
    <Map chargingStations={chargingStationList} />
  );
}

export default App;