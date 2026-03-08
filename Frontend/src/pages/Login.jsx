import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../store/UserContext'


function Login() {

  const { setUser } = useUser()

  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/users/login",
        { email: form.email, password: form.password },
        { withCredentials: true }
      )
      setUser(response.data.user)
      if (response.status === 200) navigate("/tickets")
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-lg p-8 shadow-xl">

        <div className="mb-7">
          <h1 className="text-2xl font-semibold text-white tracking-tight">Sign in</h1>
          <p className="text-sm text-gray-500 mt-1">Enter your credentials to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm border border-gray-700 rounded-md bg-gray-800 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm border border-gray-700 rounded-md bg-gray-800 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-white hover:bg-gray-200 text-gray-900 text-sm font-semibold rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-600">
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/signup')}
            className="text-gray-300 font-semibold underline cursor-pointer hover:text-white transition"
          >
            Sign up
          </span>
        </p>

      </div>
    </div>
  )
}

export default Login