'use client'

import React, {createContext, Context, useState} from 'react';
import {useRouter} from "next/navigation";

export const UserContext: Context<any> = createContext({})

export default function UserProvider({children}: {children: any}){
    const [user, setUser] = useState({})
    const [userID, setUserID]: [userID: string | null, setUserID: React.Dispatch<React.SetStateAction<any>>] = useState(null)
    const { push } = useRouter();

    const getUser = async () => {
        const res: Response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${userID}`,
            {
                'method': 'GET',
                'headers': { "Content-Type": "application/json" }
            })

        if (!res.ok) {
            throw new Error('Failed to fetch data')
        }
        const user = await res.json()
        setUser(user)
    }

    const getStorageID = () => {
        const id: string | null = localStorage.getItem('user_id')
        if(id){
            setUserID(id)
            return true
        } else {
            push('/login')
        }
    }

    return (
        <UserContext.Provider value={{'user': user, 'getUser': getUser, 'userID': userID, 'getStorageID': getStorageID}}>
          {children}
        </UserContext.Provider>
    )
}
