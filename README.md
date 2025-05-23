# mermadic
mermadic.net

### 🔧 Tech Stack Summary

* **Backend**: Node.js + Express
* **Authentication**: Sessions (or JWT if preferred)
* **Frontend**: Vanilla JS + [NU-Native-UI](https://github.com/chrlzs/NUI-Native-UI)
* **Database**: SQLite or PostgreSQL (based on how light/heavy you want it)
* **Chart Renderer**: Mermaid.js (client-side rendering)
* **Optional Extras**:

  * Share via URL (using a unique chart ID)
  * Simple Markdown editor with Mermaid blocks

---

### 🗂️ Project Structure

```
mermchart/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── db.js
│   └── server.js
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── nui/ (your NUI components)
│   └── js/
│       ├── main.js
│       ├── auth.js
│       └── charts.js
├── public/ (static files: CSS, fonts, mermaid.min.js)
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

### ✅ Key Features to Implement

1. **User Registration & Login**

   * Simple forms using NUI
   * Passwords hashed with bcrypt
   * Session-based login

2. **Chart Creation**

   * Text area to input Mermaid syntax
   * Live preview using Mermaid.js

3. **Chart Sharing**

   * Charts saved in DB with unique ID
   * Public URLs to view individual charts

4. **Dashboard**

   * List of user’s charts
   * Edit / Delete functionality


