# GymBuddy - Personal Gym Tracker Assistant

A cross-platform mobile app for tracking workouts, nutrition, and body metrics. Built as an offline-first POC with no cloud dependency — all data stays on your device.

## Tech Stack

- **Framework:** Expo Router + React Native + TypeScript
- **Database:** Expo SQLite (local, offline-first)
- **Styling:** NativeWind (Tailwind CSS for React Native)
- **State Management:** React Context API + useReducer
- **UI:** React Native Reanimated, Bottom Sheet, Chart Kit, Ionicons

## Features

### Workout Tracking
- Start/finish workout sessions with duration tracking
- Add exercises from a 100+ exercise library
- Log sets with reps, weight, RPE, and warmup flag
- Auto-populate sets from your previous session
- Rest timer with haptic feedback

### Personal Records
- Auto-detected on workout completion
- Tracks max weight, max reps, and max volume per exercise

### Workout Templates
- Pre-built templates for common routines
- Create custom templates for quick session setup

### Exercise Library
- 100+ seeded exercises organized by muscle group, equipment, and difficulty
- Search and filter functionality
- Create custom exercises

### Nutrition Tracking
- Meal database with full macro breakdown (calories, protein, carbs, fat, fiber)
- Daily meal logging with category support (breakfast, lunch, dinner, snack, pre/post workout)
- Daily totals vs. target tracking

### Body Metrics
- Log weight and body fat percentage over time

### UI/UX
- Light / dark / system theme support
- Configurable weight units (kg/lbs)
- Fitness goal and target setting

## Project Structure

```
app/                    # Expo Router file-based routing
  (tabs)/               # Bottom tab navigation (Home, Workout, Exercises, Meals, Profile)
  workout/              # Workout stack screens (new, active, [id])
  exercise/             # Exercise stack screens (create, [id])
  meal/                 # Meal stack screens (create, [id], log)
  template/             # Template stack screens (create, [id])
  history/              # Workout history

src/
  components/ui/        # Reusable UI components
  context/              # ThemeContext, SettingsContext, WorkoutContext
  db/                   # SQLite schema, migrations, seed data
  hooks/                # Custom hooks wrapping SQLite queries
  types/                # TypeScript interfaces
  utils/                # Helpers (dates, notifications, PR detection)
```

## Getting Started

### Prerequisites
- Node.js (LTS)
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator / Android Emulator / Expo Go app

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd Personal-Gym-Tracker-Assistant

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running

- Press `i` to open in iOS Simulator
- Press `a` to open in Android Emulator
- Scan the QR code with Expo Go on your device

## Database

SQLite with 9 core tables:

| Table | Purpose |
|---|---|
| `exercises` | Exercise library |
| `workout_sessions` | Completed workout sessions |
| `workout_sets` | Individual sets within sessions |
| `workout_templates` | Reusable workout templates |
| `template_exercises` | Exercises within templates |
| `meals` | Meal library |
| `meal_log` | Daily meal log entries |
| `body_metrics` | Weight and body fat logs |
| `user_settings` | User preferences |
| `personal_records` | PR history per exercise |

All data is stored locally with WAL mode, foreign key constraints, and indexes on common query columns.

## License

This project is a proof of concept for personal use.
