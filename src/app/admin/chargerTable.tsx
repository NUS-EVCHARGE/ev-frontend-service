import React, { useEffect, useState } from 'react';
import { Button, Radio, Space, Table, Tag, Popconfirm } from 'antd';
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
    key: React.Key,
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




function ChargersList() {
  const [chargers, setChargers] = useState<RatesType[]>();
  const [count, setCount] = useState(2);
  const [rates, setRates] = useState<RatesType[]>();
  const [dataSource, setDataSource] = useState<RatesType[]>([
    {
      key: '1',
      chargerId: '1',
      address: 'New York No. 1 Lake Park',
      normalRate: 1.00,
      penaltyRate: 2.00,
      noShowRate: 3.00,
      status: 'active',
    },
    {
        key: '2',
        chargerId: '2',
        address: 'London No. 1 Lake Park',
        normalRate: 1.00,
        penaltyRate: 2.00,
        noShowRate: 3.00,
        status: 'active',
    },
    {
        key: '3',
        chargerId: '3',
        address: 'Sydney No. 1 Lake Park',
        normalRate: 1.00,
        penaltyRate: 2.00,
        noShowRate: 3.00,
        status: 'inactive',
    },]
  );
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
    {
      title: 'Operation',
      dataIndex: 'operation',
      render: (_, record: { key: React.Key }) =>
          dataSource.length >= 1 ? (
            <div>
              <div>
                <Popconfirm title="Sure to edit?" onConfirm={() => handleDelete(record.key)}>
                  <a>Edit</a>
                </Popconfirm>
              </div>
              <div>
                <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                  <a>Delete</a>
                </Popconfirm>
              </div>
            </div>
          ) : null,
      },
  
  ];
  const handleAdd = () => {
    const newData: RatesType = {
      key: count,
      chargerId: `${count}`,
      address: `London, Park Lane no. ${count}`,
      normalRate: 1.1,
      penaltyRate: 1.3,
      noShowRate: 1.5,
      status: 'Active',
      
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

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
        // console.log("data[id]", Object.keys(0))
        // return data[id];
        // setRates(data);
        return rates;
      }
        // Add the charger details to the array
        console.log("item.rates_id", item.rates_id)
        // let rates = GetRates(item.rates_id)
        
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
    // setChargers(newArr);
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
    <Button onClick={handleAdd} style={{ marginBottom: 16 }}>Add a Charger</Button>
    
      <Table columns={columns} pagination={{ position: [bottom] }} dataSource={dataSource} />
    </div>
  )
}
export default ChargersList;