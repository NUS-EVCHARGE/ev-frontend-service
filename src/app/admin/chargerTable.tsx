import React, { useState } from 'react';
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
    // normalRate: number,
    // penaltyRate: number,
    // noShowRate: number,
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
        {/* <Tag color='green' key={status}>
            {status}
        </Tag> */} 
        
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
        
    

        {/* return(
            if (status === 'Active') {
            <Tag color='green' key={status}>
            {status}
            </Tag>
        } else {
            <Tag color='red' key={status}>
            {status}
            </Tag>
        }
        ) */}
        
      </span>
    ),
  },
//   {
//     title: 'Action',
//     key: 'action',
//     render: (_, record) => (
//       <Space size="middle">
//         <a>Invite {record.name}</a>
//         <a>Delete</a>
//       </Space>
//     ),
//   },
];

// async function GetChargers() {
//     // Get Charger details for provider
//     const providerUrl = String(process.env.NEXT_PUBLIC_REACT_APP_BASE_URL) + "provider/1/charger"
//     const jwtToken = await getJwtToken();
//     console.log("jwtToken tk", jwtToken)
//     console.log(providerUrl)
    
//         const {data} = await axios.get(providerUrl, {
//             headers: {
//                 "Accept": 'application/json',
//                 "authentication": jwtToken?.toString()
//             }
//         });

//         var newArr: DataType[] = [];

//   data.forEach((item, index) => {


//     const found = data.results.find(item => {
//       if (item.id === item.id) {
//         return item
//       }
//     }
//     )
//     console.log("found", found)
//   }
//           // const filtered = await axios.get(String(process.env.NEXT_PUBLIC_REACT_APP_BASE_URL) + "charger/1/rate");
//           // const found = filtered.find(item => {
//           //   if (item.id === item.id) {
//           //     return item
//           //   }
//           // }
//           // )

//           // Add the charger details to the array
//           //   newArr.push({
//           //     key: '1',
//           //     chargerId: item.id,
//           //     address: item.address,
//           //     normalRate: 1.00,
//           //     penaltyRate: 2.00,
//           //     noShowRate: 3.00,
//           //     status: 'active',
//           // });
//         // });

//         console.log("data 2222", data)
//     return (
//         // Return the chargers, with the below format
//         {
//             tk_test: '1',
//         }
//     )
// };


async function GetChargers() {
    // Get Charger details for provider
    const [chargers, setChargers] = useState<RatesType[]>();
    const providerUrl = String("https://9eh0h2n03m.execute-api.ap-southeast-1.amazonaws.com/api/v1/provider")//String(process.env.NEXT_PUBLIC_REACT_APP_BASE_URL) + "provider/1/charger"
    const jwtToken = await getJwtToken();
    
        const {data} = await axios.get(providerUrl, {
            headers: {
                "Accept": 'application/json',
                "authentication": jwtToken?.toString()
            }
        });
        console.log("data1", data)
        // Search function for rates
        // async function GetRates(id: number) {
        //   const {data} = await axios.get(String(process.env.NEXT_PUBLIC_REACT_APP_BASE_URL) + "provider/1/rates",{
        //       headers: {
        //           "Accept": 'application/json',
        //           "authentication": jwtToken?.toString()
        //       }
        //   }
          
        //   );
        //   console.log("data", typeof(data))
        //   // return data;
        //   // find data by id
        //   const found = data.find((item) => id ==item.id)
        //   console.log("found", found)
        //   return found;
        // }
        

        // // Array to store the charger details and rates
        // var newArr: RatesType[] = [];
        // // Loop through the chargers to add into RatesType array
        // data.forEach((item, index) => {
        //     // Add the charger details to the array
        //     var rates = GetRates(item.rates_id).then((res) => {
        //         return res
        //     });
        //     console.log(typeof(rates))
        //     console.log("rates", rates)
        //     newArr.push({
        //       key: '1',
        //       chargerId: item.id,
        //       address: item.address,
        //       // normalRate: rates.normal_rate,
        //       // penaltyRate: rates.penalty_rate,
        //       // noShowRate: rates.no_show_penalty_rate,
        //       status: 'active',
        //     });
        // })
        // console.log("data2", data)
        // // const data : DataType[] = newArr;

        // console.log("newArr", newArr)
        // // return newArr;
        // setChargers(newArr);



        // data.forEach((item, index) => {
        //     // Add the charger details to the array
        //     var rates = GetRates(item.rates_id)
        //     newArr.push({
        //       key: '1',
        //       chargerId: item.id,
        //       address: item.address,
        //       normalRate: rates.normal_rate,
        //       penaltyRate: rates.penalty_rate,
        //       noShowRate: rates.no_show_penalty_rate,
        //       status: 'active',
        //     });
        // })
        // var newArr: DataType[] = [];
};

// const data: DataType[] = [
//     newArr
// ];

const data: DataType[] = [
    
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
    },
];

function ChargerTable() {
  const [top, setTop] = useState<TablePaginationPosition>('topCenter');
  const [bottom, setBottom] = useState<TablePaginationPosition>('bottomCenter');
    // console.log("newArr", newArr)
    console.log("GetChargers", GetChargers())
  return (
    <div>
      <div>
        {/* <Radio.Group
        //   style={{ marginBottom: 10 }}
        //   options={topOptions}
          value={top}
          onChange={(e) => {
            setTop(e.target.value);
          }}
        /> */}
      </div>
      {/* <Radio.Group
        style={{ marginBottom: 10 }}
        // options={bottomOptions}
        value={bottom}
        onChange={(e) => {
          setBottom(e.target.value);
        }}
      /> */}
      <Table columns={columns} pagination={{ position: [bottom] }} dataSource={data} />
    </div>
  );
};

export default ChargerTable;