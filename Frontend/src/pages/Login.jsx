import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(true)
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/users/login",
        {
          email: form.email,
          password: form.password
        },
        { withCredentials: true }
      );
      console.log("res->", response);
      if (response.status===200) {
        navigate("/tickets")
      }
    } catch (error) {
      setLoading(true)
      setError(error.response?.data?.message || 'Invalid email or password')
      console.log(error);
      
    } finally{
      setLoading(false)
    }

  }

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse gap-12 w-full max-w-4xl">

        {/* Left text */}
        <div className="text-center lg:text-left max-w-sm">
          <div className="badge badge-primary badge-outline mb-3 text-xs tracking-widest uppercase">Welcome back</div>
          <h1 className="text-4xl font-bold text-base-content leading-tight">
            Log in to your account
          </h1>
          <p className="py-4 text-base-content/50 text-sm leading-relaxed">
            Access your dashboard, manage your projects, and pick up right where you left off.
          </p>
        </div>

        {/* Card */}
        <div className="card bg-base-100 w-full max-w-sm shadow-xl border border-base-300 shrink-0">
          <form className="card-body gap-4" onSubmit={handleSubmit}>

            <div className="form-control gap-1">
              <label className="label py-0">
                <span className="label-text text-xs font-semibold uppercase tracking-widest text-base-content/60">Email</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                className="input input-bordered focus:input-primary w-full"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-control gap-1">
              <label className="label py-0">
                <span className="label-text text-xs font-semibold uppercase tracking-widest text-base-content/60">Password</span>
                <a className="label-text-alt link link-primary text-xs">Forgot password?</a>
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className="input input-bordered focus:input-primary w-full"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-full mt-1 ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Logging in…' : 'Login'}
            </button>

            <p className="text-center text-sm text-base-content/40">
              No account?{' '}
              <button type="button" onClick={() => navigate('/signup')} className="link link-primary font-medium">
                Sign up
              </button>
            </p>

          </form>
        </div>

      </div>
    </div>
  )
}

export default Login