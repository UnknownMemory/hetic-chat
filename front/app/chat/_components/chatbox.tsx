import React, {useContext, useEffect, useState} from "react";
import MessageCard from "@/app/chat/_components/message-card";
import {UserContext} from "../../context";


export default function ChatBox(props: { id: string }) {
    const [chatID, setChatID]: [chatID: string | number, setChatID: React.Dispatch<React.SetStateAction<any>>] = useState("")
    const [currentChat, setCurrentChat]: [currentChat: Record<string, any>, setCurrentChat: React.Dispatch<React.SetStateAction<any>>] = useState({})
    const [currentUser, setCurrentUser]: [currentUser: Record<string, any>, setCurrentUser: React.Dispatch<React.SetStateAction<any>>] = useState({})
    const [message, setMessage]: [message: string, setMessage: React.Dispatch<React.SetStateAction<any>>] = useState("")
    const [chatMessages, setChatMessages]: [message: Record<string, any>[], setMessage: React.Dispatch<React.SetStateAction<any>>] = useState([])

    const user: Record<string, any> = useContext(UserContext)

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

    const sendMsg = async (e: React.FormEvent<any>) => {
        e.preventDefault()
        const res: Response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sendMsg`,
            {
                'method': 'POST',
                'headers': { "Content-Type": "application/json" },
                'body': JSON.stringify({'message': message, 'chat_id': chatID, 'user_id': localStorage.getItem('user_id')})
            })

        if (!res.ok) {
            throw new Error('Failed to fetch data')
        }

        return res.json()
    }

    const getChatMessages = async () => {
        const res: Response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/${props.id}/messages`,
            {
                'method': 'GET',
                'headers': { "Content-Type": "application/json" }
            })

        if (!res.ok) {
            throw new Error('Failed to fetch data')
        }

        return res.json()
    }

    const messagesList = chatMessages.map((message: Record<string, any>, index: number) => {
        return(
            <MessageCard key={index} message={message.message} username={message.author == user.user.id ? user.user.user : currentUser.user} date={message.created_at}/>
        )
    })

    useEffect(() => {
        setChatID(parseInt(props.id))
        getChat().then(r => setCurrentChat(r))
        getChatMessages().then(r => setChatMessages(r))
    }, [props.id])

    useEffect(() => {
        if (currentChat && currentChat.id){
            getUser(user.userID == currentChat.user_id ? currentChat.user2_id : currentChat.user_id).then(r => {
                setCurrentUser(r)
            })
        }

    }, [currentChat]);

    return (
        <div className={"chat-box w-[75%] h-screen bg-gray-700 flex flex-col"}>
            <div className={"chat-box-header text-xl pl-6"}>
                <div className={"py-6"}>{currentUser.user}</div>
            </div>
            <div className={"chat-messages grow overflow-y-auto"}>
                {messagesList}
            </div>
            <div className={"chat-message-dialog"}>
                <input className={"w-full text-slate-950"} onChange={(e) => {
                    e.preventDefault()
                    setMessage(e.currentTarget.value)

                }} />
                <button onClick={(e) => sendMsg(e)}>Envoyer</button>
            </div>
        </div>
    )
}
