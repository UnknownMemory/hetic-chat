'use client';
import React, {useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json())

export default function Chat() {
    const { push } = useRouter();
    const [pageIndex, setPageIndex] = useState(1);

    const { data, error } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${pageIndex}`, fetcher)

    const users = data?.map((user: any, index: number)=> {
        return (
            <div key={index} className={"py-2"}>{user.username}</div>
        )
    })


    return (
        <div className={"w-full"}>
            <div className={"w-1/4 h-screen bg-gray-800 pl-6"}>
                <h1 className={"text-xl py-6"}>Listes des utilisateurs</h1>
                <div>
                    {users}
                </div>
            </div>
        </div>
    )
}