import React, { useEffect, useState } from "react";


export default function MessageCard(props: { message: string, username: string, date: string}) {
    const [date, setDate] = useState('')

    useEffect(() => {
        const messageDate = new Date(props.date)
        setDate(`${messageDate.toDateString()} ${messageDate.toLocaleTimeString()}`)
    }, [props.date]);
    return (
        <div className={"w-full px-6 py-2"}>
            <div className={"mb-2 flex items-center"}>
                <div className={"text-violet-600"}>{props.username}</div>
                <div className={"text-xs ml-2 text-gray-400"}>{date}</div>
            </div>
            <div>{props.message}</div>
        </div>
    )
}
