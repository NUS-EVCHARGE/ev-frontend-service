'use client'
import { Card, Button, List, Avatar } from "antd"
import { useRouter } from 'next/navigation';
import ChargerTable from "./chargerTable";
function ChargerDetails({ user }: any) {

    const router = useRouter();

    const navigateToAddChargerPage = () => {
        router.push('/newcharger');
    };

    const data = [
        {
            chargerId: '1',
            address: '1234 Main St',
            normalRate: '1.00',
            penaltyRate: '2.00',
            noShowRate: '3.00',
            status: 'Active',
        },
        {
            chargerId: '2',
            address: '1234 Main St',
            normalRate: '1.00',
            penaltyRate: '2.00',
            noShowRate: '3.00',
            status: 'Active',
        },
        {
            chargerId: '3',
            address: '1234 Main St',
            normalRate: '1.00',
            penaltyRate: '2.00',
            noShowRate: '3.00',
            status: 'Active',
        },
    ];
    return (
        <Card type="inner" title="Chargers" extra={<Button onClick={navigateToAddChargerPage}>
            Add Charger
        </Button>}>
            <ChargerTable />
            {/* <List
                pagination={{ position: 'bottom', align: 'center' }}
                dataSource={data}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                            // avatar={
                            //     <Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />
                            // }
                            title={<a href="https://ant.design">{"Charger ID: "+item.chargerId}</a>}
                            // address={item.address}
                            // normalRate={item.normalRate}
                            // penaltyRate={item.penaltyRate}
                            // noShowRate={item.noShowRate}
                            // status={item.status}

                            description={
                                "Location: "+ item.address+' |\n'+
                                "Normal Rate: "+ item.normalRate+' |\n'+
                                "Penalty Rate: "+ item.penaltyRate+' |\n'+
                                "No Show Rate: "+ item.noShowRate+' |\n'+
                                "Status: "+ item.status+' |\n'
                            }
                        />
                        <Button>
                            Details
                        </Button>
                    </List.Item>
                )}
            /> */}

        </Card>
    )
}

export default ChargerDetails