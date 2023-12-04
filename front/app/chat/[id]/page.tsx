'use client';
import React, {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import useSWR from "swr";
import ChatBox from "@/app/chat/_components/chatbox";

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json())

export default function Chat() {
    const [pageIndex, setPageIndex] = useState(1);

    const {push} = useRouter();
    const params = useParams()

    const getChat = async (user_id: number) => {
        const res: Response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/goc?user_id=${localStorage.getItem('user_id')}&user2_id=${user_id.toString()}`,
      {'method': 'GET',
           'headers': {"Content-Type": "application/json"}})

        if (!res.ok) {
            throw new Error('Failed to fetch data')
        }

        const chat = await res.json()
        push('/chat/' + chat.id)
    }

    const { data, error } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${pageIndex}?user_id=${localStorage.getItem('user_id')}`, fetcher)
    const users = data?.map((user: any, index: number)=> {

        return (
            <div onClick={() => getChat(user.id)} key={index} className={"py-2"}>{user.username}</div>
        )
    })




    return (
        <div className={"flex h-full"}>
            <div className={"user-list w-1/4 h-screen bg-gray-800 pl-6"}>
                <h1 className={"text-xl py-6"}>Listes des utilisateurs</h1>
                <div>
                    {users}
                </div>
            </div>
            {params.id != "me" ?  <ChatBox id={params.id as string}/> : ""}
        </div>
    )
}