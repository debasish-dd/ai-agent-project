import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../store/UserContext";
import { Navigate } from "react-router-dom"


function Admin() {

  const { user } = useUser()

  if (!user) return <Navigate to="/" />
  if (user.role !== "admin") return <Navigate to="/tickets" />


  const [allusers, setAllusers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const gettingUsers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/v1/users/get-users",
        { withCredentials: true }
      );
      setAllusers(res.data.users || []);
    } catch (error) {
      console.log("error while getting all users", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    gettingUsers();
  }, []);

  if (isLoading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-500 text-sm">Loading users...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-5xl mx-auto">

        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-white tracking-tight">Users</h1>
          <p className="text-gray-500 text-sm mt-1">{allusers.length} total users</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-left">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-gray-500">Name</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-gray-500">Email</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-gray-500">Role</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-gray-500">Status</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-gray-500">Joined</th>
              </tr>
            </thead>
            <tbody>
              {allusers.map((user, idx) => (
                <tr
                  key={user._id}
                  className={`border-b border-gray-800 hover:bg-gray-800/50 transition ${idx === allusers.length - 1 ? "border-none" : ""}`}
                >
                  <td className="px-5 py-3 text-white font-medium">{user.name}</td>
                  <td className="px-5 py-3 text-gray-400">{user.email}</td>
                  <td className="px-5 py-3">
                    <span className={`badge badge-outline text-xs ${
                      user.role === "admin" ? "badge-warning" : "badge-ghost"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`badge text-xs ${
                      user.isVerified ? "badge-success" : "badge-error"
                    }`}>
                      {user.isVerified ? "Verified" : "Unverified"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {allusers.length === 0 && (
            <p className="text-center text-gray-600 text-sm py-12">No users found.</p>
          )}
        </div>

      </div>
    </div>
  );
}

export default Admin;