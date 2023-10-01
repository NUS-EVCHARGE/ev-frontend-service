"use client";

import React from "react";
import { useState } from "react";
import axios from "axios";
import { Input, Space } from 'antd';
const { Search } = Input;

export default function ChargerForm() {
    const [coordinates, setCoordinates] = useState({ lat: null, 
      lng: null });
    const googleAPIKey = String(process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_API_KEY)
    const [charger_id, setChargerId] = useState('');
    const [rates_id, setRatesId] = useState('');
    
    const handleGetCoordinates = async (value:string) => {
        try {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
              value
            )}&key=${googleAPIKey}`
          );
          const { results } = response.data;
          if (results.length > 0) {
            const { lat, lng } = results[0].geometry.location;
            setCoordinates({ lat, lng });
          } else {
            alert('No location found for the entered address.');
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    };

    return (
        <div>
          <Space direction="vertical" style={{}}>
            <Input placeholder="Charger Id" style={{ width: 200 , padding: '5px'}} onChange={(e) => setChargerId(e.target.value)}/>
            <Input placeholder="Rates Id" style={{ width: 200 , padding: '5px'}} onChange={(e) => setRatesId(e.target.value)}/>
            <Search
              placeholder="Enter address"
              onSearch={value => handleGetCoordinates(value)}
              style={{ width: 200 , padding: '5px'}}
            />
            <div style={{ color: 'black'}}>
                Latitude: {coordinates.lat} <br/>
                Longitude: {coordinates.lng}
            </div>
          </Space>
        </div>
    )
}