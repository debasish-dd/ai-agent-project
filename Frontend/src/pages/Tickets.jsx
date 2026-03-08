import React, { useEffect, useState } from "react";
import axios from "axios";

function Tickets() {
  const [ticket, setTicket] = useState([]);
  const [isLoading, setIsLoading] = useState(true)

  const getTickets = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get(
        "http://localhost:3000/api/v1/tickets/get-tickets",
        { withCredentials: true },
      );
      console.log("res--", res.data.tickets);
      const tickets = res?.data?.tickets;
      setTicket(tickets.map((ticket) => ticket));
    } catch (error) {
      console.log("error while fetching tickets->", error);
    } finally{
      setIsLoading(false)
    }
  };
  useEffect(()=>{
    getTickets()
  }, [])

if(isLoading){
  return <p className="w-50 h-50 m-auto">loading...</p>
}else return <div>
  {ticket.map((i)=>{
    return (<div className="card shadow-lg card-dash w-96 bg-gray-800 p-2 pb-4 px-4 m-4">
        <div className="card-body">
          <div className="badge badge-outline">{i.priorty}</div>
          <h2 className="card-title">{i.title}</h2>
          <p>
            {i.description}
          </p>
        </div>
         <div className="card-actions justify-end">
      <div className="badge badge-outline">{i.status}</div>
      <div className="badge badge-outline">assign to :  {i.assignedTo.name}</div>
      
     
    </div>
    <hr className="mt-3 m-1"/>
        <div className="flex gap-2 flex-wrap font-bold">related skills: {i?.relatedSkills?.slice(0,3).map((skill)=>(<p className="bg-stone-700/50 p-1 font-light rounded-lg">{skill}</p>))} </div>
      </div>)
  })}
</div>
}

export default Tickets;
