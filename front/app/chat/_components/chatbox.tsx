import {useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import useSWR from "swr";

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json())

export default function ChatBox(props: {id: string}) {
    const [pageIndex, setPageIndex] = useState(1);
    const [chatID, setChatID]: [chatID: string | number, setChatID: React.Dispatch<React.SetStateAction<any>> ] = useState("")
    
    useEffect(() => {
        setChatID(parseInt(props.id))
    })
    return (
        <div className={"chat-box w-[75%] h-screen bg-gray-700 flex flex-col"}>
            <div className={"chat-box-header text-xl pl-6"}>
                <div className={"py-6"}>user</div>
            </div>
            <div className={"chat-messages grow"}></div>
            <div className={"chat-message-dialog"}>
                <input className={"w-full"}/>
            </div>
        </div>
    )
}