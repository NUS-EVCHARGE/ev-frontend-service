import React, { useEffect, useState } from 'react';
import { Select, Form, InputNumber, Input, Button, Space, Table, Popconfirm, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { message } from 'antd';
import {UserOutlined } from '@ant-design/icons';
import { getJwtToken } from '../utils/index';
import axios from 'axios';
import { ChargerUserDetailsProps } from './chargerDetails';

interface RatesType {
    key: number, //number, React.Key,
    chargerId: string,
    address: string,
    lat: number,
    lng: number,
    rateId : number,
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
}

type Rates = {
  id: number,
  provider_id: number,
  no_show_penalty_rate: number,
  normal_rate: number,
  penalty_rate: number,
  status: string,
}

type ChargerRate = {
  id: number,
  provider_id: number,
  address: string,
  lat: number,
  lng: number,
  rates: Rates,
  status: string,
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

function ChargersList({ user }: ChargerUserDetailsProps) {
  const provderId = user.id;
  const chargerRateURL = String(process.env.NEXT_PUBLIC_REACT_APP_BASE_URL) + `/provider/${provderId}/chargerandrate`
  const [editingKey, setEditingKey] = useState('');
  const [selectEdit, setSelectEdit] = useState(false);
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState<RatesType[]>([]);
  const isEditing = (record: RatesType) => record.key === editingKey;

  const edit = (record: Partial<RatesType> & { key: React.Key }) => {
    form.setFieldsValue({ chargerId: '', provider_id: '', address: '', ...record });
    setEditingKey(record.key);
  };

  useEffect(() => {
    // Get chargers for the first time
    // console.log('useEffect - Edit')
    console.log('editingKey', editingKey)

    // In edit mode
    if (editingKey != '') {
      // Code
      editingKey
      setSelectEdit(false);
      // console.log('useEffect - Edit ENABLED')
      // Update Select Component props disabled to false

    } else { // Not in edit mode
      setSelectEdit(true); 
    }
  }, [editingKey]);

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as RatesType;

      const newData = [...dataSource];
      const index = newData.findIndex((item) => key === item.key);
      console.log("index", newData)
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

      // Save the data
      handlePatch(newData);
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
      title: 'Latitude',
      dataIndex: 'lat',
      key: 'lat',
      editable: true,
    },
    {
      title: 'Longitude',
      dataIndex: 'lng',
      key: 'lng',
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
            disabled={selectEdit}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'disabled', label: 'Disabled' },
            ]}
          />
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
            <Typography.Link onClick={() => {
              save(record.key)
              console.log('record-1a', record)
              //handlePatch(record) //why record is not updated here?
            }} style={{ marginRight: 8 }}>
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
            
            {/* <Popconfirm title="Sure to delete?" okType={"default"} onConfirm={() => handleDelete(record.key)}>
              <Button type="link">Delete</Button>
            </Popconfirm> */}
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
    const newCharger : RatesType = {
      key: 0,
      chargerId: "0",
      address: '',
      lat: 0,
      lng: 0,
      rateId: 0,
      normalRate: 0,
      penaltyRate: 0,
      noShowRate: 0,
      status: 'deactivated',
    };
    AddCharger(newCharger);
  };

  const handlePatch = (newData : RatesType) => {
    // console.log("handlePatch-1", key)
    // const newData = dataSource.filter((item) => item.key == key);
    console.log("handlePatch-2", newData)
    PatchCharger(newData);
  }

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
    DeleteCharger(key.toString());
  };
  
  // Get Charger details and rates for the provider
  async function GetChargers() {
    const jwtToken = await getJwtToken();
    await axios.get(chargerRateURL, {
        headers: {
            "Accept": 'application/json',
            "authentication": jwtToken?.toString()
        }
    }).then((res) => {
      const data: ChargerRate[] = res.data
      var newArr: RatesType[] = [];
  
      data.forEach((item: any) => {
        newArr.push({
            key: item.id,
            chargerId: item.chargerId,
            address: item.address,
            lat: item.lat,
            lng: item.lng,
            rateId: item.rates.id,
            normalRate: item.rates.normal_rate,
            penaltyRate: item.rates.penalty_rate,
            noShowRate: item.rates.no_show_penalty_rate,
            status: 'active',
          });
      });
      setDataSource(newArr);
    }).catch((err) => {
      console.log(err);
    });
  }
  
  // Function to add the charger
  async function AddCharger(newcharger: RatesType) {
    const jwtToken = await getJwtToken();
    await axios.post(chargerRateURL, {
          "provider_id": provderId,
          "address": newcharger.address,
          "lat": newcharger.lat,
          "lng": newcharger.lng,
          "status": "inactive",
          "rates": {
              "provider_id": provderId,
              "normal_rate": newcharger.normalRate,
              "penalty_rate": newcharger.penaltyRate,
              "no_show_penalty_rate": newcharger.noShowRate,
              "Status": "inactive"
          }
      }, {
        headers: {
          Accept: 'application/json',
          Authentication: jwtToken?.toString()
      }
    }).then((res) => {

      const data: ChargerRate = res.data
      const newData: RatesType = {
        key: data.id,
        chargerId: data.id.toString(),
        address: data.address,
        lat: data.lat,
        lng: data.lng,
        rateId: data.rates.id,
        normalRate: data.rates.normal_rate,
        penaltyRate: data.rates.penalty_rate,
        noShowRate: data.rates.no_show_penalty_rate,
        status: data.status,
      };
      setDataSource([...dataSource, newData]);
      
    }).catch((err) => {
      console.log(err);
    })
  };

  // Function to delete the charger
  async function DeleteCharger(chargerId: string) {
    const jwtToken = await getJwtToken();
    const { data } = await axios.delete(chargerRateURL, {
        headers: {
            "Accept": 'application/json',
            "authentication": jwtToken?.toString()
        }
    });
    // console.log("Delete charger data", data)
  };

  // Function to PATCH the charger
  async function PatchCharger(charger: RatesType) {
    console.log("PatchCharger-1", chargerRateURL)
    console.log("PatchCharger-1", charger)
    const jwtToken = await getJwtToken();
    await axios.patch(chargerRateURL, {
          "id": charger.key,
          "provider_id": provderId,
          "address": charger.address,
          "lat": charger.lat,
          "lng": charger.lng,
          "status": charger.status,
          "rates": {
              "id": charger.rateId,
              "provider_id": provderId,
              "normal_rate": charger.normalRate,
              "penalty_rate": charger.penaltyRate,
              "no_show_penalty_rate": charger.noShowRate,
              "Status": charger.status
          }
    }, {
        headers: {
            "Accept": 'application/json',
            "authentication": jwtToken?.toString()
        }
    }).then((res) => {
      const data: ChargerRate = res.data
      //GetChargers();
    }).catch((err) => {
      console.log(err);
    });
  };
  
  const [top, setTop] = useState<TablePaginationPosition>('topCenter');
  const [bottom, setBottom] = useState<TablePaginationPosition>('bottomCenter');

    useEffect(() => {
      GetChargers();
    }, []);

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
          inputType: col.dataIndex === 'id' ? 'number' : 'text',
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