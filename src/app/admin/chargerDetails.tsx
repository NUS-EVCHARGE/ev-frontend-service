'use client'
import { Card, Button, List, Avatar } from "antd"
import { useRouter } from 'next/navigation';
import ChargerTable from "./chargerTable";
import { User } from "./page";

interface ChargerUserDetailsProps {
    user: User
}
function ChargerDetails({ user }: ChargerUserDetailsProps) {


    return (
        <div>
            <ChargerTable user= {user}/>
        </div>
    )
}

export default ChargerDetails
export type { ChargerUserDetailsProps }