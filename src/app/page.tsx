"use client";
import { Amplify } from 'aws-amplify';
import awsExports from "./aws-exports";
import { ChargingStationArray } from './map';
import Map from './map';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Configure Amplify in index file or root file
Amplify.configure({
  Auth: {
    region: awsExports.REGION,
    userPoolId: awsExports.USER_POOL_ID,
    userPoolWebClientId: awsExports.USER_POOL_APP_CLIENT_ID
  }
})

const markers: ChargingStationArray = [
  { id: 1, address: "Address1", lat: 1.2922, lng: 103.7766 },
  { id: 2, address: "Address2", lat: 1.3332674, lng: 103.6367302 },
];

const chargerUrl = String(process.env.NEXT_PUBLIC_REACT_APP_BASE_URL) + "/charger"


function App() {
  const [chargingStationList, setChargingStationList] = useState<ChargingStationArray>([]);
  async function GetAllCharger() {
    // const { data } = await axios.get(chargerUrl)
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