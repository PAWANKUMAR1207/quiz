# DevOps Quiz Web Application (React + Express)

Full-stack quiz app:
- Frontend: React (Vite), CSS
- Backend: Node.js + Express
- Storage: In-memory leaderboard

## Structure

```text
quiz_app/
|-- client/
|   |-- index.html
|   |-- package.json
|   |-- vite.config.js
|   `-- src/
|       |-- App.jsx
|       |-- main.jsx
|       |-- styles.css
|       `-- pages/
|           |-- HomePage.jsx
|           |-- QuizPage.jsx
|           `-- ResultPage.jsx
`-- server/
    |-- index.js
    |-- package.json
    |-- routes/quizRoutes.js
    `-- questions/index.js
```

## Run (Development)

1. Start backend:
```bash
cd server
npm install
node index.js
```

2. Start frontend in a second terminal:
```bash
cd client
npm install
npm run dev
```

3. Open:
- `http://localhost:5173`

## Run (Single Server / Deployment Style)

1. Build frontend:
```bash
cd client
npm install
npm run build
```

2. Start backend:
```bash
cd ../server
npm install
node index.js
```

3. Open:
- `http://localhost:3000`

## API Endpoints

- `GET /questions`
- `POST /submit`
- `GET /leaderboard`

## Notes

- Leaderboard is sorted by score descending, then earlier submission time.
- Duplicate submission is blocked by username (case-insensitive).
- Data is in memory and resets on server restart.
