export const CREATE_TABLES_SQL = `
  CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    muscle_group TEXT NOT NULL,
    equipment TEXT DEFAULT 'none',
    difficulty TEXT DEFAULT 'beginner',
    instructions TEXT,
    is_custom INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS workout_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    started_at TEXT NOT NULL,
    finished_at TEXT,
    duration_minutes INTEGER,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS workout_sets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
    exercise_id INTEGER NOT NULL REFERENCES exercises(id),
    set_number INTEGER NOT NULL,
    reps INTEGER NOT NULL,
    weight_kg REAL NOT NULL DEFAULT 0,
    is_warmup INTEGER DEFAULT 0,
    rest_seconds INTEGER,
    rpe REAL,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS workout_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS template_exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    template_id INTEGER NOT NULL REFERENCES workout_templates(id) ON DELETE CASCADE,
    exercise_id INTEGER NOT NULL REFERENCES exercises(id),
    order_index INTEGER NOT NULL,
    target_sets INTEGER DEFAULT 3,
    target_reps TEXT DEFAULT '8-12',
    target_weight_kg REAL,
    notes TEXT
  );

  CREATE TABLE IF NOT EXISTS meals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    calories INTEGER,
    protein_g REAL,
    carbs_g REAL,
    fat_g REAL,
    fiber_g REAL,
    ingredients TEXT,
    instructions TEXT,
    is_custom INTEGER DEFAULT 0,
    tags TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS meal_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    meal_id INTEGER REFERENCES meals(id),
    custom_name TEXT,
    date TEXT NOT NULL,
    meal_time TEXT NOT NULL,
    calories INTEGER,
    protein_g REAL,
    carbs_g REAL,
    fat_g REAL,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS body_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL UNIQUE,
    weight_kg REAL,
    body_fat_pct REAL,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS user_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    display_name TEXT DEFAULT 'Athlete',
    weight_unit TEXT DEFAULT 'kg',
    theme_mode TEXT DEFAULT 'system',
    fitness_goal TEXT DEFAULT 'general',
    target_calories INTEGER,
    target_protein_g REAL,
    target_workout_days INTEGER DEFAULT 4,
    reminder_enabled INTEGER DEFAULT 1,
    reminder_day TEXT DEFAULT 'sunday',
    reminder_hour INTEGER DEFAULT 9,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS personal_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exercise_id INTEGER NOT NULL REFERENCES exercises(id),
    record_type TEXT NOT NULL,
    value REAL NOT NULL,
    achieved_at TEXT NOT NULL,
    session_id INTEGER REFERENCES workout_sessions(id),
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(exercise_id, record_type)
  );
`;

export const CREATE_INDEXES_SQL = `
  CREATE INDEX IF NOT EXISTS idx_workout_sets_session ON workout_sets(session_id);
  CREATE INDEX IF NOT EXISTS idx_workout_sets_exercise ON workout_sets(exercise_id);
  CREATE INDEX IF NOT EXISTS idx_template_exercises_template ON template_exercises(template_id);
  CREATE INDEX IF NOT EXISTS idx_meal_log_date ON meal_log(date);
  CREATE INDEX IF NOT EXISTS idx_body_metrics_date ON body_metrics(date);
  CREATE INDEX IF NOT EXISTS idx_personal_records_exercise ON personal_records(exercise_id);
  CREATE INDEX IF NOT EXISTS idx_exercises_muscle_group ON exercises(muscle_group);
  CREATE INDEX IF NOT EXISTS idx_exercises_equipment ON exercises(equipment);
  CREATE INDEX IF NOT EXISTS idx_workout_sessions_started ON workout_sessions(started_at);
  CREATE INDEX IF NOT EXISTS idx_meals_category ON meals(category);
`;

export const INSERT_DEFAULT_SETTINGS_SQL = `
  INSERT OR IGNORE INTO user_settings (id) VALUES (1);
`;

export const CREATE_CHAT_MESSAGES_SQL = `
  CREATE TABLE IF NOT EXISTS chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );
`;

export const CREATE_CHAT_INDEXES_SQL = `
  CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON chat_messages(created_at);
`;
