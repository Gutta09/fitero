import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.resolve(__dirname, "../../fitero.db");

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS workout_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    goal TEXT NOT NULL,
    days_per_week INTEGER NOT NULL,
    level TEXT NOT NULL,
    schedule TEXT NOT NULL,
    notes TEXT,
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS logged_workouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plan_id INTEGER REFERENCES workout_plans(id),
    date TEXT NOT NULL,
    focus TEXT NOT NULL,
    exercises TEXT NOT NULL,
    session_notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

export type DbPlan = {
  id: number;
  goal: string;
  days_per_week: number;
  level: string;
  schedule: string;
  notes: string | null;
  active: number;
  created_at: string;
};

export type DbLog = {
  id: number;
  plan_id: number | null;
  date: string;
  focus: string;
  exercises: string;
  session_notes: string | null;
  created_at: string;
};

export const planQueries = {
  insert: db.prepare<[string, number, string, string, string | null]>(`
    INSERT INTO workout_plans (goal, days_per_week, level, schedule, notes)
    VALUES (?, ?, ?, ?, ?)
  `),
  deactivateAll: db.prepare(`UPDATE workout_plans SET active = 0`),
  getActive: db.prepare<[], DbPlan>(`
    SELECT * FROM workout_plans WHERE active = 1 ORDER BY created_at DESC LIMIT 1
  `),
  getById: db.prepare<[number], DbPlan>(`SELECT * FROM workout_plans WHERE id = ?`),
  updateSchedule: db.prepare<[string, number]>(
    `UPDATE workout_plans SET schedule = ? WHERE id = ?`
  ),
};

export const logQueries = {
  insert: db.prepare<[number | null, string, string, string, string | null]>(`
    INSERT INTO logged_workouts (plan_id, date, focus, exercises, session_notes)
    VALUES (?, ?, ?, ?, ?)
  `),
  getSince: db.prepare<[string], DbLog>(`
    SELECT * FROM logged_workouts WHERE date >= ? ORDER BY date DESC
  `),
  getRecent: db.prepare<[number], DbLog>(`
    SELECT * FROM logged_workouts ORDER BY date DESC LIMIT ?
  `),
};

export default db;
