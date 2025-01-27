import React from "react";
import axios from "axios";

export default function GenKey() {
    const [acc, setAcc] = React.useState({
        publicKey: "",
        privateKey: ""
    });
    console.log(import.meta.env.VITE_APP_BACKEND_KEYGEN);
    const generateAccount = async () => {
        axios.get( import.meta.env.VITE_APP_BACKEND_KEYGEN +"/generate",{}, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            console.log(response.data);
            return response.data;
        }).then((data)=>{setAcc(data)});
    }
    return (
        <div>
            <h1>Generate a new key</h1>
            <p>Click the button below to generate a new key.</p>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={()=>{generateAccount()}}>Generate Key</button>
            {acc && acc.publicKey && acc.privateKey && (
                
                <div>
                    <h2>Public Key</h2>
                    <p className="border-3 m-2 border-black bg-gray-300 rounded-[30px] p-4">{Object.values(acc.publicKey).map(value => value.toString(16).padStart(2, '0')).join('')}</p>
                    <h2>Private Key</h2>
                    <p className="border-3 m-2 border-black bg-gray-300 rounded-[30px] p-4">{Object.values(acc.privateKey).map(value => value.toString(16).padStart(2, '0')).join('')}</p>
                </div>
            )}
        </div>
    )
}