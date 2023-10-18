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

const chargerUrl = String(process.env.NEXT_PUBLIC_REACT_APP_BASE_URL) + "/charger"

function App() {
  const [chargingStationList, setChargingStationList] = useState<ChargingStationArray>([]);
  async function GetAllCharger() {
    const { data } = await axios.get(chargerUrl)
    setChargingStationList(data)
  }
  useEffect(() => {
    axios.get(chargerUrl)
  }, [])

  return (
    <Map chargingStations={chargingStationList} />
  );
}

export default App;