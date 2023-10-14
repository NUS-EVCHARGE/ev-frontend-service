import React, { useEffect, useState } from 'react';
import { Radio, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import jwt from 'jsonwebtoken';
import { getJwtToken } from '../utils/index';
import axios from 'axios';

interface DataType {
    key: string;
    chargerId: string;
    address: string;
    normalRate: number,
    penaltyRate: number,
    noShowRate: number,
    status: string,
    // tags: string[];
}

interface RatesType {
    key: string,
    chargerId: string,
    address: string,
    normalRate: number,
    penaltyRate: number,
    noShowRate: number,
    status: string,
}

type TablePaginationPosition =
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomCenter'
  | 'bottomRight';

const topOptions = [
  { label: 'topLeft', value: 'topLeft' },
  { label: 'topCenter', value: 'topCenter' },
  { label: 'topRight', value: 'topRight' },
  { label: 'none', value: 'none' },
];

const bottomOptions = [
  { label: 'bottomLeft', value: 'bottomLeft' },
  { label: 'bottomCenter', value: 'bottomCenter' },
  { label: 'bottomRight', value: 'bottomRight' },
  { label: 'none', value: 'none' },
];

const columns: ColumnsType<DataType> = [
  {
    title: 'Charger ID',
    dataIndex: 'chargerId',
    key: 'chargerId',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Normal Rate',
    dataIndex: 'normalRate',
    key: 'normalRate',
    render: (text) => <a>{text.toFixed(2)}</a>,
  },
  {
    title: 'Penalty Rate',
    dataIndex: 'penaltyRate',
    key: 'penaltyRate',
    render: (text) => <a>{text.toFixed(2)}</a>,
  },
  {
    title: 'No Show Rate',
    dataIndex: 'noShowRate',
    key: 'noShowRate',
    render: (text) => <a>{text.toFixed(2)}</a>,
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    render: (status) => (
      <span>
        {(() => {
            console.log("status", status);
          if (status == 'active'){
              return (
                    <Tag color='green' key={status}>{status.toUpperCase()}</Tag>
              )
          }
          else {
                return (
                    <Tag color='red' key={status}>{status.toUpperCase()}</Tag>
                )
          }
          
        })()}
      </span>
    ),
  },

];

function ChargersList() {
  const [chargers, setChargers] = useState<RatesType[]>();
  const [rates, setRates] = useState<RatesType[]>();

  // Get Charger details for provider
  async function GetChargers() {
    const chargerUrl = String(process.env.NEXT_PUBLIC_REACT_APP_BASE_URL) + "provider/1/charger"
    const jwtToken = await getJwtToken();
    console.log("changerUrl", chargerUrl)
    const {data} = await axios.get(chargerUrl, {
        headers: {
            "Accept": 'application/json',
            "authentication": jwtToken?.toString()
        }
    });
    console.log("get chargers data", data)
    
    // Array to store the charger details and rates
    var newArr: DataType[] = [];
    // Loop through the chargers to add into RatesType array
    data.forEach((item: any) => {
        
      async function GetRates(id: number) {
        const {data} = await axios.get(String(process.env.NEXT_PUBLIC_REACT_APP_BASE_URL) + "provider/1/rates",{
            headers: {
                "Accept": 'application/json',
                "authentication": jwtToken?.toString()
            }
        });
        // console.log("get rates data", data)
        // const found = data.found((item: any) => id ==item.id)
        // setRates(found); 
        // return found;
        console.log("TK1")
        console.log("data[id]", Object.keys(0))
        // return data[id];
        // setRates(data);
        return rates;
      }
        // Add the charger details to the array
        console.log("item.rates_id", item.rates_id)
        let rates = GetRates(item.rates_id)
        console.log("GET rates", rates)
        newArr.push({
          key: '1',
          chargerId: item.chargerId,
          address: item.address,
          normalRate: rates.normal_rate,
          penaltyRate: rates.penalty_rate,
          noShowRate: rates.no_show_penalty_rate,
          status: 'active',
        });
    })
    // const data : DataType[] = newArr;
    const chargerList = GetChargers()
    return newArr;
    setChargers(newArr);
  }
  const [top, setTop] = useState<TablePaginationPosition>('topCenter');
  const [bottom, setBottom] = useState<TablePaginationPosition>('bottomCenter');
    useEffect(() => {
      // Get chargers for the first time
      GetChargers();
    }, []);
    useEffect(() => {
      // Get chargers for the first time
      GetChargers();
    }, chargers);
  return (
    <div>
      <Table columns={columns} pagination={{ position: [bottom] }} dataSource={chargers} />
    </div>
  )
}
export default ChargersList;