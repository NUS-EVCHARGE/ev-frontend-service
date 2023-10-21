'use client'
import { Card, Button, List, Avatar } from "antd"
import { useRouter } from 'next/navigation';
import ChargerTable from "./chargerTable";
import { User } from "./page";

interface ChargerUserDetailsProps {
    user: User
}
function ChargerDetails({ user }: ChargerUserDetailsProps) {

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
        <div>
            <ChargerTable user= {user}/>
        </div>
    )
}

export default ChargerDetails
export type { ChargerUserDetailsProps }