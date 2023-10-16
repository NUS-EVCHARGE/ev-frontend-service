import React, { useEffect, useState } from 'react';
import { Select, Form, InputNumber, Input, Button, Radio, Space, Table, Tag, Popconfirm, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { Dropdown, message, Tooltip } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';

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

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: RatesType;
  index: number;
  // children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

function ChargersList() {
  const [chargers, setChargers] = useState<RatesType[]>();
  const [count, setCount] = useState(2);
  const [rates, setRates] = useState<RatesType[]>();
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();
  


  const isEditing = (record: RatesType) => record.key === editingKey;
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

  const edit = (record: Partial<RatesType> & { key: React.Key }) => {
    console.log('EDIT TEST', record)
    console.log('EDIT TEST')
    form.setFieldsValue({ chargerId: '', age: '', address: '', ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as RatesType;

      const newData = [...dataSource];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setDataSource(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setDataSource(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    message.info('Click on menu item.');
    console.log('click', e);
  };
  const dropdownitems: MenuProps['items'] = [
    {
      label: 'Active',
      key: 'active',
      icon: <UserOutlined />,
    },
    {
      label: 'Inactive',
      key: 'inactive',
      icon: <UserOutlined />,
    },
  ];
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };
  const menuProps = {
    dropdownitems,
    onClick: handleMenuClick,
  };

  //: ColumnsType<DataType>
  const columns = [
    {
      title: 'Charger ID',
      dataIndex: 'chargerId',
      key: 'chargerId',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      editable: true,
    },
    {
      title: 'Normal Rate',
      dataIndex: 'normalRate',
      key: 'normalRate',
      editable: true,
      render: (text: any) => <a>{parseFloat(text).toFixed(2)}</a>,
    },
    {
      title: 'Penalty Rate',
      dataIndex: 'penaltyRate',
      key: 'penaltyRate',
      editable: true,
      render: (text: any) => <a>{parseFloat(text).toFixed(2)}</a>,
    },
    {
      title: 'No Show Rate',
      dataIndex: 'noShowRate',
      key: 'noShowRate',
      editable: true,
      render: (text: any) => <a>{parseFloat(text).toFixed(2)}</a>,
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (status: string) => (
        <span>
          <Select
            defaultValue="disabled"
            style={{ 
              width: 120,
              color: status == 'active' ? 'green' : 'red',
            }}
            onChange={handleChange}
            disabled={true}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'disabled', label: 'Disabled' },
            ]}
          />
          {/* {(() => {
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
            
          })()} */}
        </span>
      ),
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      render: (_: any, record: RatesType) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );
      },
    },
      // render: (_, record: { key: React.Key }) =>
      //     dataSource.length >= 1 ? (
      //       <div>
      //         <div>
      //           <Popconfirm title="Sure to edit?" onConfirm={() => handleDelete(record.key)}>
      //             <a>Edit</a>
      //           </Popconfirm>
      //         </div>
      //         <div>
      //           <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
      //             <a>Delete</a>
      //           </Popconfirm>
      //         </div>
      //       </div>
      //     ) : null,
      // },
  
  ];
  const handleAdd = () => {
    const newData: RatesType = {
      key: count,
      chargerId: `${count}`,
      address: `London, Park Lane no. ${count}`,
      normalRate: 0.0,
      penaltyRate: 0.0,
      noShowRate: 0.0,
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

    const mergedColumns = columns.map((col) => {
      if (!col.editable) {
        
        return col;
      }
      console.log("col", col)
      console.log("col.dataIndex", col.dataIndex)
      return {
        ...col,
        onCell: (record: RatesType) => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        }),
        
      };
    });

  return (
    <div>
    <Button onClick={handleAdd} style={{ marginBottom: 16 }}>Add a Charger</Button>
    <Form form={form} component={false}>
      <Table 
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={dataSource}
        columns={mergedColumns} 
        rowClassName="editable-row"
        pagination={{ onChange: cancel, 
                      position: [bottom] 
                    }}  
                  />
    </Form>
    </div>
  )
}
export default ChargersList;