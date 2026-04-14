import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("app.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'patient'
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    type TEXT,
    date TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    role TEXT,
    content TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    url TEXT,
    category TEXT
  );
`);

// Seed some videos if empty
const videoCount = db.prepare("SELECT COUNT(*) as count FROM videos").get() as { count: number };
if (videoCount.count === 0) {
  const insertVideo = db.prepare("INSERT INTO videos (title, description, url, category) VALUES (?, ?, ?, ?)");
  insertVideo.run("Das Stresssystem: Grundlagen", "Einführung in das Nervensystem, Sympathikus vs. Parasympathikus und die Auswirkungen von Stress auf den Körper.", "https://www.w3schools.com/html/mov_bbb.mp4", "Anatomie");
  insertVideo.run("Körperarbeit-Praxis: Grundlagen", "Einführung in die Evolution Methodik.", "https://www.w3schools.com/html/mov_bbb.mp4", "Körperarbeit-Praxis");
  insertVideo.run("Kundenumgang: Empathie", "Wie man professionell und empathisch mit Kunden kommuniziert.", "https://www.w3schools.com/html/movie.mp4", "Kundenumgang");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/videos", (req, res) => {
    const videos = db.prepare("SELECT * FROM videos").all();
    res.json(videos);
  });

  app.get("/api/bookings/:userId", (req, res) => {
    const bookings = db.prepare("SELECT * FROM bookings WHERE user_id = ?").all(req.params.userId);
    res.json(bookings);
  });

  app.post("/api/bookings", (req, res) => {
    const { userId, type, date } = req.body;
    const info = db.prepare("INSERT INTO bookings (user_id, type, date) VALUES (?, ?, ?)").run(userId, type, date);
    res.json({ id: info.lastInsertRowid });
  });

  app.get("/api/chat/:userId", (req, res) => {
    const messages = db.prepare("SELECT * FROM messages WHERE user_id = ? ORDER BY timestamp ASC").all(req.params.userId);
    res.json(messages);
  });

  app.post("/api/chat", (req, res) => {
    const { userId, role, content } = req.body;
    db.prepare("INSERT INTO messages (user_id, role, content) VALUES (?, ?, ?)").run(userId, role, content);
    res.json({ status: "ok" });
  });

  // Auth Routes
  app.post("/api/register", async (req, res) => {
    const { email, password, name } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const info = db.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)").run(name, email, hashedPassword);
      const user = { id: info.lastInsertRowid, name, email, role: 'patient' };
      res.json(user);
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        res.status(400).json({ error: "E-Mail Adresse bereits registriert." });
      } else {
        res.status(500).json({ error: "Registrierung fehlgeschlagen." });
      }
    }
  });

  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    
    if (!user) {
      return res.status(401).json({ error: "Ungültige E-Mail oder Passwort." });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Ungültige E-Mail oder Passwort." });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  app.post("/api/reset-password", (req, res) => {
    const { email } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    
    if (!user) {
      return res.status(404).json({ error: "Kein Benutzer mit dieser E-Mail Adresse gefunden." });
    }

    // In a real app, send reset email here.
    // For this demo, we just return success.
    res.json({ message: "Passwort-Reset-Link wurde an Ihre E-Mail gesendet." });
  });

  // Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
