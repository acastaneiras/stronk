# Stronk

**Stronk**, is a web and Progressive Web Application (PWA) that works as a fitness tracker, helping you monitor and optimize your workouts.

[Website](https://acastaneiras.github.io/stronk/)

## Screenshots

<div align="center">

<table>
  <tr>
    <td><img src="https://i.imgur.com/EPzm8tp.png" alt="Screenshot 1" width="263"></td>
    <td><img src="https://i.imgur.com/IihzbXi.png" alt="Screenshot 2" width="263"></td>
    <td rowspan="2"><img src="https://i.imgur.com/cwhnkw9.png" alt="Screenshot 5" width="263"></td>
  </tr>
  <tr>
    <td><img src="https://i.imgur.com/DAt7EPh.png" alt="Screenshot 3" width="263"></td>
    <td><img src="https://i.imgur.com/FXGVWqC.png" alt="Screenshot 4" width="263"></td>
  </tr>
</table>

</div>

## Features

1. **Comprehensive Fitness Tracker**:
   - Track workouts, exercises, sets, reps, and weights.
   - Add notes, rest times, and intensity ratings (RPE & RIR).

2. **Customizable Routines**:
   - Create, edit, and organize your workout routines.
   - Add exercises from a rich database.

3. **Analytics & History**:
   - See progress with detailed workout summaries.
   - View statistics for specific exercises, including graphs of weight over time.

4. **Exercise Filtering**:
   - Filter exercises by category, muscle group, or required equipment.
   - Search exercises by name for quick access.

5. **Cloud Storage**:
   - Data is securely stored using **Supabase**, ensuring seamless synchronization across devices.

6. **Built-in Timer**:
   - Rest interval countdowns with notifications.

7. **Theming**:
   - Supports dark mode, light mode and system theme.

## Technology Stack

- **Frontend**: React + TypeScript + Vite
- **State Management**: Zustand
- **API Integration**: Supabase
- **Styling**: shadcn/ui & TailwindCSS
- **PWA Features**: vite-plugin-pwa
- **Charts & Data Visualization**: Recharts
- **Drag-and-Drop**: @dnd-kit/core
- **Form Handling**: React Hook Form + Zod

## Exercise Database
The exercise database is sourced from [Free Exercise DB](https://github.com/yuhonas/free-exercise-db), which offers a comprehensive collection of +800 exercises categorized by muscle groups and equipment.

## License 📜
You can view the full legal code of the license at:
https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode.en