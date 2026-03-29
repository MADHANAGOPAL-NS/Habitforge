# HabitForge — Gamified Habit Tracking Application

## Project Overview

Traditional habit trackers often struggle to maintain long-term user interest. HabitForge aims to solve this lack of engagement by leveraging core gamification principles. Instead of a simple checklist, HabitForge turns daily habits into an RPG-like experience where user consistency is actively rewarded. The platform focuses on maintaining streaks, earning XP, leveling up, and collecting badges to keep users motivated and accountable over time.

## Key Objectives

The goal of this project is to build an engagement system rather than just a standard CRUD application. This requires handling several technical challenges:
- **Time-series data**: Storing and querying large sets of habit logs mapped over continuous timeframes.
- **Complex backend logic**: Calculating and updating dynamic metrics such as active streaks, XP gains, level milestones, and daily resets.
- **Interactive data visualization**: Generating real-time, meaningful visual representations of the user's progress.

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, Recharts / Chart.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (specifically structured for time-series handling)
- **Tools**: Date-fns / Moment.js (for precise date comparative logic)

## Authentication

A core requirement for HabitForge is ensuring secure and isolated user data. The authentication and security layer includes:
- **JWT-Based Sessions**: Utilizing JSON Web Tokens to establish identity and maintain secure, stateless user sessions across the application.
- **Protected Routes**: Implementing custom authorization middleware on the backend to safeguard private API endpoints from unauthorized access.
- **Password Security**: Ensuring all user passwords are computationally hashed and salted using bcrypt before being stored in the database.

## Phase 1: Core Habit Management

- **Habit Schema Design**: Structured handling for both daily recurring and weekly habits.
- **Data Scaling**: Utilization of a secondary `HabitLog` collection to maintain scalable history without overloading the primary records.
- **CRUD Operations**: Complete control over individual habits including the ability to seamlessly create, read, update, and delete them.
- **Metadata Support**: Allowing users to customize habits with specific color tags and associated icons.

### Streak Calculation Logic
At the core of the HabitForge backend is the mathematical streak engine:
- If `lastCompletedDate` equals yesterday, the active streak sequentially increments.
- If `lastCompletedDate` is strictly prior to yesterday, the active streak resets back to zero.
- The system prevents duplicate completions for the same period.
- Timezone and temporal tracking differs between daily schedules and specific weekly habit deadlines.

## Phase 2: Gamification Engine

- **XP Architecture**: Users are actively awarded Experience Points (XP) upon every verified habit completion.
- **Level Calculation**: A custom scaling mathematical formula evaluates total XP and continuously updates the user's level.
- **Badge System**: Achievement triggers automatically evaluate milestone progression to award un-lockable badges.
- **Dashboard Data**: The main dashboard intelligently aggregates and displays the user's Level, Badges, and overall RPG Progress.

### XP & Level Formula
The gamification engine relies on a linear and highly predictable progression model to ensure consistency is actively rewarded over time.
- **Formula Mapping**: `Level = 1 + floor(XP / 20)`
- **Core Explanation**: As a user successfully completes their daily and weekly habits, they accumulate total XP. Based on the mathematical floor grouping, every 20 XP gathered consistently maps to an increase of exactly 1 level, ensuring smooth and transparent progress plotting.

## Phase 3: Data Visualization & Analytics

To improve engagement, HabitForge incorporates Recharts to effectively display:
- **Completion Heatmap**: A GitHub-style intensity grid showing active days over the last 90 days.
- **30-Day Consistency Graph**: A smooth area tracking chart visualizing habit completion consistency over the trailing month.
- Aggregation pipelines dynamically fetch and calculate structured data from logs stored in the MongoDB database.

## Phase 4: Monetization (Freemium Model)

To showcase realistic business architecture, the application integrates a clear Freemium model mapping:
- All core tracking, RPG elements, and basic metrics remain completely free.
- **Premium Features**: Locking advanced analytics (like dynamic heatmaps), raw Data Export systems (CSV generation), and theoretically unlimited habits behind premium states.
- Handled seamlessly with an `isPremium` boolean gate implemented throughout the backend controllers and frontend view layers.

## Deployment
Frontend: Vercel
Backend: Render

## Live URL



## Author

Madhanagopal N S
