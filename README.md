# Job Skill Matcher

This is a web app that allows the user to search for skills and match them with job titles, also providing targeted suggestions to further enhance career opportunities.

# Live Demo
https://job-skill-matcher.vercel.app/

Note that this demo app does not have a real backend and uses a mock API.
To run the app with a real backend locally, follow the instructions below.


# File Structure

```
/
├── backend             # Bakcend code
│ ├── src/              # Source files
│ │ ├── controllers/    # Controllers
│ │ ├── models/         # Models
│ │ ├── routes/         # Routes
│ │ ├── app.js          # Express app
│ │ └── server.js       # Server
│ └── ...
├── frontend/           # Frontend code
│ ├── public/           # Public files
│ ├── src/              # Source files
│ │ ├── components/     # Components
│ │ ├── services/       # Services
│ │ ├── App.jsx         # App
│ │ ├── index.js        # Entry point
│ │ └── ...
│ └── ...
```

# Install

```bash
npm run install:all # Install dependencies for both frontend and backend
```

# Run

```bash
npm run start:all # Start both frontend and backend
```

# Stack

- React
- Tailwind
- Express.js
- MongoDB
