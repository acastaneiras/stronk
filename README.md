# Stronk
This project is both a web application and a Progressive Web Application (PWA) that works as a fitness tracker, helping you monitor your workouts.

<a href="https://acastaneiras.github.io/stronk/" target="_blank">Website</a>

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
- Track workouts, exercises, sets, reps, and weights.
- Add notes, rest times, and intensity ratings (RPE & RIR).
- Create, edit, and organize your workout routines.
- Add exercises from a rich database.
- See progress with detailed workout summaries.
- View statistics for specific exercises, including graphs of weight over time.
- Filter exercises by category, muscle group, or required equipment.
- Search exercises by name for quick access.
- Data is securely stored using [Supabase](https://supabase.com/), ensuring seamless synchronization across devices.
- Rest interval countdowns with notifications.
- Supports dark mode, light mode and system theme.

## Technology Stack

- **Frontend**: [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vite.dev/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **API Integration**: [Supabase](https://supabase.com/)
- **Styling**: [shadcn/ui](https://ui.shadcn.com/) & [Tailwind CSS](https://tailwindcss.com/)
- **PWA Features**: [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- **Charts**: [Recharts](https://recharts.org/en-US/)
- **Drag-and-Drop**: [dnd-kit](https://dndkit.com/)
- **Form Handling**: [React Hook Form](https://www.react-hook-form.com/) + [Zod](https://zod.dev/)
- **Testing**: [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/)

## Exercise Database
The exercise database is sourced from [Free Exercise DB](https://github.com/yuhonas/free-exercise-db), which offers a collection of more than 800 exercises categorized by muscle groups and equipment.

## Installation
If you want to run this yourself the only requirement is to have [Node.js](https://nodejs.org/en) >= 21.6.2 installed:

1. Clone the repository:
   ```bash
   git clone https://github.com/acastaneiras/stronk.git
   cd stronk
   ```

2. Fill the Environment Variables:

   Copy the ```.env.default``` file and renamte it to ```.env```. Fill in the required variables with your own values.

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   or if you want to build the project:

   ```bash
   npm run build
   ```

   ```bash
   npm run preview
   ```

5. Populate Database:
   Since this project uses Supabase as the backend you'll need to create a project with the schema provided in ```schema.sql``` and populate the database with your own data.

## License
This project is licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
You can view the full legal code of the license at:
https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode.en