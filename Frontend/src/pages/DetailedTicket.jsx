import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function DetailedTicket() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getTicket = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/v1/tickets/get-ticket/${id}`,
          { withCredentials: true },
        );
        setTicket(res.data.ticket);
      } catch (error) {
        console.log("error fetching ticket->", error);
      } finally {
        setIsLoading(false);
      }
    };
    getTicket();
  }, [id]);

  if (isLoading) return <p className="m-auto">loading...</p>;
  if (!ticket) return <p className="m-auto">Ticket not found</p>;

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-2xl mx-auto bg-gray-900 border border-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="badge badge-outline">{ticket.status}</span>
          <span className="badge badge-outline">{ticket.priority}</span>
        </div>

        <h1 className="text-2xl font-semibold text-white mb-3">
          {ticket.title}
        </h1>
        <p className="text-gray-400 text-sm mb-6">{ticket.description}</p>

        <hr className="border-gray-800 mb-4" />

        <div className="flex gap-2 flex-wrap">
          <span className="text-gray-500 text-sm font-semibold">
            Related Skills:
          </span>
          {ticket.relatedSkills?.map((skill) => (
            <p
              key={skill}
              className="bg-stone-700/50 p-1 font-light rounded-lg text-sm"
            >
              {skill}
            </p>
          ))}
        </div>
          <hr className="m-2" />
        <div>
          <h4 className="w-50 h-5 m-auto">Helpful Notes</h4>
         <hr className="m-2" />
          <p className=" ">
            {ticket.helpfulNotes}
          </p>

        </div>
      </div>
    </div>
  );
}

export default DetailedTicket;
