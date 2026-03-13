**Frontend:** React, Tailwind CSS, DaisyUI, Axios, React Router  
**Backend:** Node.js, Express, MongoDB, Mongoose, Bcrypt  
**AI & Workflows:** Inngest (AI agent workflow & background jobs)  
**Email:** Nodemailer + Mailtrap (SMTP testing)
```

And add to `.env` variables:
```
MONGO_URL
JWT_SECRET
OPENAI_API_KEY
MAILTRAP_SMTP_HOST
MAILTRAP_SMTP_PORT
MAILTRAP_SMTP_USER
MAILTRAP_SMTP_PASSWORD
VITE_URL
APP_URL
```

---

## Updated X post
```
Built a full-stack AI ticket management system 🎟️

An AI agent reads every ticket and automatically assigns it to the right person based on their skills — powered by Inngest workflows

Stack:
→ React + Tailwind
→ Node.js + Express
→ MongoDB
→ Inngest for AI workflows
→ Nodemailer + Mailtrap for email
→ JWT auth + HTTP-only cookies
→ OTP email verification
→ Role-based access (admin/mod/user)


#buildinpublic #webdev #nodejs #react #inngest
```

---

## Updated LinkedIn post
```
🚀 Just shipped a full-stack AI-powered ticket management system!

The core idea: instead of manually assigning support tickets, an AI agent reads each ticket and automatically routes it to the team member whose skills best match the problem.

What I built:
✅ Inngest-powered AI workflow for automatic ticket assignment
✅ Email notifications via Nodemailer + Mailtrap
✅ JWT auth with refresh tokens and HTTP-only cookies
✅ OTP email verification on signup
✅ Role-based access control (admin / moderator / user)
✅ Admin panel for managing users and roles

Tech stack: React, Tailwind CSS, DaisyUI, Node.js, Express, MongoDB, Inngest

The most interesting part was building the Inngest workflow — it handles the AI agent logic as a background job so the ticket creation response is instant while the assignment happens asynchronously.


#webdevelopment #nodejs #react #inngest #buildinpublic #javascript