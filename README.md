# FitFlex - Smart Workout Generator App

**FitFlex** is a web-based workout routine generator that dynamically creates personalized strength training plans based on user preferences such as workout type, target muscle groups, and fitness goals.

## Features

- **Step-by-step workout customization** – Choose workout type, target muscle groups, and training goal  
- **Dynamic workout generation** – Exercises are randomized with calculated sets, reps/duration, tempo, and rest intervals  
- **Compound and accessory differentiation** – Exercises are categorized and distributed for balanced training  
- **Smart validation and filtering** – Prevents exercise duplication and aligns selections with environment settings  
- **Interactive set tracking** – Users can log completed sets for each exercise in real-time  
- **Workout progress tracker with celebration animation** – Visual progress bar updates as you complete sets, with a celebratory animation on full completion  
- **Download workout as PDF** – Export your routine as a clean, readable, text-based PDF report  
- **Responsive design** – Fully styled with Tailwind CSS for consistent behavior across devices  
- **Structured and scalable logic** – Built using modular, reusable React components and functional logic  

## Tech Stack and Core Concepts

- **React** – Modular component-based architecture for managing UI and logic separation  
- **Tailwind CSS** – Utility-first CSS framework used for responsive, modern styling  
- **JavaScript (ES6+)** – Application logic, functional transformations, and data operations  
- **Vite** – High-performance development server and bundler for fast iteration  
- **jsPDF** – Lightweight PDF generation library used for text-based export functionality  
- **Data-Driven Rendering** – All exercises, schemes, goals, and mappings are abstracted into structured datasets (`swoldier.js`)  
- **Functional Programming** – Core logic uses pure functions (`generateWorkout`, `shuffleArray`) and immutability principles  
- **Randomization and Constraints** – Ensures diverse and valid routines, prevents duplicate exercises, and aligns rep ranges with selected goals  
- **State Management** – `useState` is leveraged to manage user selections, UI updates, and set progress across components  

## Application Flow

### 1. **Landing Page**
- A bold introductory interface inviting users to begin.
- The "Accept & Begin" button scrolls the page to the workout generator section.

### 2. **Workout Generator**
- **Step 1**: User selects a workout mode (e.g., `individual`, `push_pull`, `upper_lower`)
- **Step 2**: User selects target muscle groups
- **Step 3**: User selects a training goal (e.g., `strength_power`, `hypertrophy`, `endurance`)

### 3. **Workout Generation**
- Upon submission, the application invokes the workout engine to generate a routine.
- Each routine includes:
  - Exercise name  
  - Type (compound or accessory)  
  - Targeted muscle groups  
  - Repetition count or duration (based on unit)  
  - Tempo for execution  
  - Prescribed rest time  

### 4. **Workout Display and Interaction**
- Each generated exercise is displayed within a card layout.
- Users can mark completed sets by interacting with a tracker (up to 5 sets per exercise).
- A progress bar visually updates as sets are completed.
- Once all sets are completed, a celebratory message is shown.

### 5. **Workout Export**
- Users can download their workout as a structured, text-based PDF for future reference or offline access.

## Running the Application Locally

To run FitFlex on your local development environment:

```bash
git clone https://github.com/SoumyaGanesh12/FitFlex.git
npm install
npm run dev
```

## Live Demo

The FitFlex application is deployed on **Netlify** for public access.

🔗 [https://fitflexnow.netlify.app/](https://fitflexnow.netlify.app/)
