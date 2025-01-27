import React, { useEffect} from "react";
import axios from "axios";
export default function Board(){
    const [ votes, setVotes ] = React.useState([]);
    React.useEffect(()=>{
        const fxn = async()=>{ const data = await axios.get("https://localhost:3443/aggregateVotes").then(data => {
            console.log(data);
            setVotes(data.data.votes);
        });    
    }
    fxn();
    }, []);
    console.log(votes);
    const [ param, setParam ] = React.useState("");
    const [ values, setValues ] = React.useState([]);
    useEffect(()=>{
        setValues(votes.filter((vote) => {
            return vote.key.includes(param);
        }));
    },[param]);
    // implement
    return (
        <div>
        <h1>Board</h1>
        <div className=" mb-2 flex gap-2 border-1 rounded p-1">
            <h2>Search</h2>
            <input type="text" className="border-1 border-black rounded" onChange={(e)=>{
                setParam(e.target.value);
            }} />
        </div>
        <div className="flex flex-col gap-2">

        {values && values.map((vote, index) => {
            return (
                <div className="flex gap-2 border-1 border-black rounded  p-1 justify-between" key={index}>
                    <h2>{vote.key}</h2>
                    <p>{vote.value} !!</p>
                </div>
            );
        })}
        </div>




        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3" >::Get Proof of Vote calculation::</button>
        </div>
    )
}