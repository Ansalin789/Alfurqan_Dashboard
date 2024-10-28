'use client'

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Form() {
    const router = useRouter()
    const [fname, setfName] = useState("")
    const [lname, setlName] = useState("")
    const [email, setEmail] = useState("")
    const [number, setNumber] = useState("")
    const [country, setCountry] = useState("")

    const handleSubmit = async (e) =>{
        e.preventDefault()

        try {
            let response = await fetch('../api/users', {
                cache: 'no-store',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({fname, lname, email, number, country})
            })

            response = await response.json()
            if (response.success) {
                fname("")
                lname("")
                email("")
                number("")
                country("")
                alert(response.message)
                router.push('/view-data')
            } else {
                alert(response.message)
            }
        } catch (error) {
            console.error("POST Error:", error); 
            alert("could not save user try again later !")
        }
    }
  return (
    <div>
        <h2>Registration Form</h2>
        <form action="" className='p-4 bg-slate-300 w-1/2 justify-center align-middle border rounded mt-4' onSubmit={handleSubmit} autoComplete='off'>
            <div className="input-group p-2">
                <input type="text" placeholder='Enter First Name' className="form-control" value={fname} onChange={(e) =>setfName(e.target.value)}/>
            </div>
            <div className="input-group p-2">
                <input type="text" placeholder='Enter Last Name' className="form-control" value={lname} onChange={(e) =>setlName(e.target.value)}/>
            </div>
            <div className="input-group p-2">
                <input type="email" placeholder='Enter your Email' className="form-control" value={email} onChange={(e) =>setEmail(e.target.value)}/>
            </div>
            <div className="input-group p-2">
                <input type="number" placeholder='Enter your Number' className="form-control" value={number} onChange={(e) =>setNumber(e.target.value)}/>
            </div>
            <select name="" id="" value={country} onChange={(e) =>setCountry(e.target.value)} required>
                <option value="India">India</option>
                <option value="USA">USA</option>
                <option value="Germany">Germany</option>
                <option value="Qutar">Qutar</option>
            </select>
            <br /><br />
            <div className="input-group p-2">
                <button type='submit' className='btn'> register</button>
            </div>
        </form>
    </div>
  )
}
