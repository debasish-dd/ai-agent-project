import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function ProtectedNavbar() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);

  const buttonStyle = "px-4 py-2 bg-indigo-700/40 text-white rounded hover:bg-blue-600/60";

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onLogOut = async () => {
    try {
      await axios.post("http://localhost:3000/api/v1/users/logout", {}, { withCredentials: true });
      navigate("/");
    } catch (error) {
      console.log("error while logging out-", error);
    }
  };

  const onCreateTicket = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/tickets/create-ticket",
        form,
        { withCredentials: true }
      );
      console.log("all done", res.data);
      
      setForm({ title: "", description: "" });
      setModalOpen(false);
    } catch (error) {
      console.log("error while creating a ticket", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <nav className="flex justify-between bg-gray-900 border-b border-gray-800">
        <ul className="flex gap-4 p-3">
          <Link to="/tickets" className={buttonStyle}>Tickets</Link>
        </ul>
        <div className="flex gap-4 p-3">
          <button onClick={() => setModalOpen(true)} className={buttonStyle}>Create Ticket</button>
          <button onClick={onLogOut} className={buttonStyle}>Logout</button>
        </div>
      </nav>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-white text-lg font-semibold mb-5">Create Ticket</h2>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter ticket title"
                  className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-md text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the issue..."
                  rows={4}
                  className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-md text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white transition resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={onCreateTicket}
                disabled={loading || !form.title || !form.description}
                className="px-4 py-2 text-sm bg-white text-gray-900 font-semibold rounded-md hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating…" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProtectedNavbar;