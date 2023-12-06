import React, { useEffect, useState } from "react";

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json())



export default function ChatBox(props: { id: string }) {
    const [pageIndex, setPageIndex] = useState(1);
    const [chatID, setChatID]: [chatID: string | number, setChatID: React.Dispatch<React.SetStateAction<any>>] = useState("")
    const [currentChat, setCurrentChat]: [currentChat: Record<string, any>, setCurrentChat: React.Dispatch<React.SetStateAction<any>>] = useState({})
    const [currentUser, setCurrentUser]: [currentUser: Record<string, any>, setCurrentUser: React.Dispatch<React.SetStateAction<any>>] = useState({})
    const [message, setMessage]: [message: string, setMessage: React.Dispatch<React.SetStateAction<any>>] = useState({})

    const getChat = async () => {
        const res: Response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/${props.id}`,
            {
                'method': 'GET',
                'headers': { "Content-Type": "application/json" }
            })

        if (!res.ok) {
            throw new Error('Failed to fetch data')
        }

        return res.json()
    }

    const getUser = async (user_id: number) => {
        const res: Response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${user_id}`,
            {
                'method': 'GET',
                'headers': { "Content-Type": "application/json" }
            })

        if (!res.ok) {
            throw new Error('Failed to fetch data')
        }

        return res.json()
    }

    useEffect(() => {
        setChatID(parseInt(props.id))
        getChat().then(r => setCurrentChat(r))
    }, [props.id])

    useEffect(() => {
        if (currentChat && currentChat.id)
            getUser(localStorage.getItem("user_id") == currentChat.user_id ? currentChat.user2_id : currentChat.user_id).then(r => {
                setCurrentUser(r)
            })
    }, [currentChat]);

    return (
        <div className={"chat-box w-[75%] h-screen bg-gray-700 flex flex-col"}>
            <div className={"chat-box-header text-xl pl-6"}>
                <div className={"py-6"}>{currentUser.user}</div>
            </div>
            <div className={"chat-messages grow overflow-y-auto"}></div>
            <div className={"chat-message-dialog"}>
                <input className={"w-full text-slate-950"} onChange={(e) => {
                    e.preventDefault()
                    setMessage(e.currentTarget.value)

                }} />
                <button>Envoyer</button>
            </div>
        </div>
    )
}
