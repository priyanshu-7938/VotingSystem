import React, { useEffect, useState } from "react";
import axios from "axios";
import * as secp from '@noble/secp256k1';
import sha256 from "sha256";

export default function Vote(){
    const [ candidates, setData ] = useState("");
    const [ vote, setVote ] = useState(-1);
    const [ loading, setLoading ] = useState(false);
    const [ privateKey, setPrivateKey ] = useState("");
    const [ publicKey, setPublicKey ] = useState("");
    function hexToUint8Array(hexString) {
        if (hexString.length % 2 !== 0) {
          throw new Error("Invalid hex string length.");
        }
        const pkey = secp.utils.randomPrivateKey();        
        for (let i = 0; i < hexString.length; i += 2) {
          pkey[i / 2] = parseInt(hexString.substr(i, 2), 16);
        }
        return pkey;
    }
    useEffect(() => {
        axios("https://localhost:3443/candidates").then(data => {
            console.log(data.data);
            setData(data.data.candidates);
        });
    }, []);
    const TriggerCast = (async(index)=>{
        if(privateKey === ""){
            alert("Please enter your private key");
            return;
        }
        if(publicKey === ""){
            alert("Please enter your public key");
            return;
        }
        if(index === -1){
            alert("Please select a candidate");
            return;
        }
        var arr = new Array(candidates.length).fill(0); // Fill the array with 0s
        arr[index] = 1; 
        // const response = await axios.post(
        //     "https://localhost:3443/encryptor", 
        //     { arr }, // Pass the request body here
        //     {
        //         headers: {
        //             "Content-Type": "application/json"
        //         }
        //     }
        // );
        const stringifyedArr = JSON.stringify(arr);
        console.log(stringifyedArr);
        const pkeArr = hexToUint8Array(privateKey);
        const signature = await secp.signAsync(sha256(stringifyedArr), pkeArr);
        console.log(signature);
        console.log(secp.verify(signature, sha256(stringifyedArr), hexToUint8Array(publicKey)));
        const serializedSignature = JSON.stringify(signature, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
          );
          console.log(serializedSignature);
        const reso = await axios.post("https://localhost:3443/vote", {
            publicKey,
            arr: stringifyedArr,
            signature: serializedSignature
        })
        console.log(signature);
        alert(reso.data.message);
    })
    return (
        <div>
            <h1 className="text-3xl font-bold underline">Vote</h1>
            <div className="flex gap-2 items-center ">
            <h1>Private Key:</h1>
            <input type="text" className="px-2 border-1 border-black w-[300px] h-[40px] rounded-[10px]" onChange={(e)=>{setPrivateKey(e.target.value)}} />
            </div>
            <div className="flex gap-2 items-center ">
            <h1>Public Key:</h1>
            <input type="text" className="px-2 border-1 border-black w-[300px] h-[40px] rounded-[10px]" onChange={(e)=>{setPublicKey(e.target.value)}} />
            </div>
            <div className={`flex flex-col gap-2 ${loading?"pointer-events-none":""}`} >
                {candidates && candidates.map((candidate, index) => {
                    return (
                        <div key={index} className="flex flex-row gap-2">
                            <input type="radio" name="candidate" value={index} onClick={()=>{setVote(index)}}/>
                            <label>{candidate}</label>
                        </div>
                    )
                })}
            </div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={()=>{setLoading(true); TriggerCast(vote)}}>Submit Vote</button>
        </div>
    )
}