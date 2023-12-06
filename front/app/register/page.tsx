'use client';
import React, {useState} from "react";
import { useRouter } from "next/navigation";

async function postData(data: {}) {
  const res: Response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`,
      {'method': 'POST',  headers: {
          "Content-Type": "application/json",
        }, body: JSON.stringify(data)})

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
    return res.json()
}



export default function Register() {
    const { push } = useRouter();
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const register = async (e: React.FormEvent<any>) => {
    e.preventDefault()
    const res = await postData({'username': username, 'password': password})

        if(res){
            localStorage.setItem('user_id', res.id)
            push('/')
        }
    }



  return (
      <div>
          <h1 className={"text-center text-2xl m-4"}>Inscription</h1>
          <form className="max-w-sm mx-auto">
              <div className="mb-5">
                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom d'utilisateur</label>
                <input onChange={(e) => setUsername(e.currentTarget.value)} type="username" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Nom d'utilisateur" required />
              </div>
              <div className="mb-5">
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mot de passe</label>
                <input onChange={(e) => setPassword(e.currentTarget.value)} type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
              </div>
              <button onClick={(e) => register(e)} type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Envoyer</button>
          </form>
      </div>
  )
}