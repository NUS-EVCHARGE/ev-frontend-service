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
  
  const [count, setCount] = useState(2);
  const [rates, setRates] = useState<RatesType[]>();
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState<RatesType[]>([]);
  const isEditing = (record: RatesType) => record.key === editingKey;

  const edit = (record: Partial<RatesType> & { key: React.Key }) => {
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
      dataIndex: 'key',
      key: 'key',
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
            <Popconfirm title="Sure to cancel?" okType={"default"} onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Space>
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
              Edit
            </Typography.Link>
            
            <Popconfirm title="Sure to delete?" okType={"default"} onConfirm={() => handleDelete(record.key)}>
              <Button type="link">Delete</Button>
            </Popconfirm>
        </Space>
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
      address: '',
      normalRate: 0.0,
      penaltyRate: 0.0,
      noShowRate: 0.0,
      status: 'Active',
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
    AddCharger();
  };

  const handleDelete = (key: React.Key) => {
    console.log("record.key", key)
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
    DeleteCharger(key.toString());
  };
  
  // Get Charger details and rates for the provider
  async function GetChargers() {
    const chargerRaterUrl = String(process.env.NEXT_PUBLIC_REACT_APP_BASE_URL) + "provider/1/chargerandrate"
    const jwtToken = await getJwtToken();
    console.log("changerUrl", chargerRaterUrl)
    const { data } = await axios.get(chargerRaterUrl, {
        headers: {
            "Accept": 'application/json',
            "authentication": jwtToken?.toString()
        }
    });
    
    // console.log("get chargers data", data)
    var newArr: DataType[] = [];

    data.forEach((item: any) => {
      newArr.push({
          key: item.id,
          chargerId: item.chargerId,
          address: item.address,
          normalRate: item.rates.normal_rate,
          penaltyRate: item.rates.penalty_rate,
          noShowRate: item.rates.no_show_penalty_rate,
          status: 'active',
        });
    });
    console.log("newArr", newArr)
    
    setDataSource(newArr);
    console.log("dataSource", dataSource)
  }
  // Function to add the charger
  async function AddCharger() {
    const addChargerUrl = String(process.env.NEXT_PUBLIC_REACT_APP_BASE_URL) + "provider/1/rates"
    const jwtToken = await getJwtToken();
    console.log("changerUrl", addChargerUrl)
    const { data } = await axios.post(addChargerUrl, {
        headers: {
            "Accept": 'application/json',
            "authentication": jwtToken?.toString()
        },
        body: {
          "id": 11,
          "provider_id": 10,
          "no_show_penalty_rate": 10,
          "normal_rate": 10,
          "penalty_rate": 10,
          "status": "deactivated"
        }
    });
    console.log("Add charger data", data)
  }
  // Function to delete the charger
  async function DeleteCharger(chargerId: string) {
    const deleteChargerUrl = String(process.env.NEXT_PUBLIC_REACT_APP_BASE_URL) + "provider/1/charger/" + chargerId
    const jwtToken = await getJwtToken();
    console.log("changerUrl", deleteChargerUrl)
    const { data } = await axios.delete(deleteChargerUrl, {
        headers: {
            "Accept": 'application/json',
            "authentication": jwtToken?.toString()
        }
    });
    console.log("Delete charger data", data)
  }

  // Function to PATCH the charger
  async function PatchCharger(chargerId: string) {
    const patchChargerUrl = String(process.env.NEXT_PUBLIC_REACT_APP_BASE_URL) + "provider/1/charger/" + chargerId
    const jwtToken = await getJwtToken();
    console.log("changerUrl", patchChargerUrl)
    const { data } = await axios.patch(patchChargerUrl, {
        headers: {
            "Accept": 'application/json',
            "authentication": jwtToken?.toString()
        }
    });
    console.log("Patch charger data", data)
  }
  
  const [top, setTop] = useState<TablePaginationPosition>('topCenter');
  const [bottom, setBottom] = useState<TablePaginationPosition>('bottomCenter');
    // useEffect(() => {
    //   // Get chargers for the first time
    //   console.log('useEffect - Get chargers for the first time')
    //   GetChargers();
    // }, []);
    useEffect(() => {
      // Runs anytime dataSource changes
      console.log('useEffect - Runs when dependency changes')
      GetChargers();
    }, dataSource);

    const mergedColumns = columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      // console.log("col", col)
      // console.log("col.dataIndex", col.dataIndex)
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
        pagination={{ 
                      onChange: cancel, 
                      position: [bottom] 
                    }}  
                  />
    </Form>
    </div>
  )
}
export default ChargersList;