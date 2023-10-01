'use client'
import { Card, Button, List, Avatar } from "antd"
import { useRouter } from 'next/navigation';

function ChargerDetails({ user }: any) {

    const router = useRouter();

    const navigateToAddChargerPage = () => {
        router.push('/newcharger');
    };

    const data = [
        {
            title: 'Ant Design Title 1',
        },
        {
            title: 'Ant Design Title 2',
        },
        {
            title: 'Ant Design Title 3',
        },
        {
            title: 'Ant Design Title 4',
        },
    ];
    return (
        <Card type="inner" title="Chargers" extra={<Button onClick={navigateToAddChargerPage}>
            Add Charger
        </Button>}>

            <List
                pagination={{ position: 'bottom', align: 'center' }}
                dataSource={data}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={
                                <Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />
                            }
                            title={<a href="https://ant.design">{item.title}</a>}
                            description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                        />
                        <Button>
                            Details
                        </Button>
                    </List.Item>
                )}
            />

        </Card>
    )
}

export default ChargerDetails