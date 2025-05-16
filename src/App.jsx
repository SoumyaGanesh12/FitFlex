import { useState } from 'react'
import Hero from './components/Hero'
import Generator from './components/Generator'
import Workout from './components/Workout'
import { generateWorkout } from './utils/functions'
function App() {
  // State to store the final generated workout
  const [workout, setWorkout] = useState(null)
  // State for user-selected workout type (e.g., 'individual', 'push_pull', etc.)
  const [poison, setPoison] = useState('individual')
  // State for selected muscle groups (e.g., ['chest', 'back'])
  const [muscles, setMuscles] = useState([])
  // State for training goal (e.g., 'strength_power', 'hypertrophy')
  const [goal, setGoal] = useState('strength_power')
  // Update progress bar based on sets completed
  const [totalSetsCompleted, setTotalSetsCompleted] = useState(0);
  // Show error if muscle group is empty
  const [formError, setFormError] = useState(false);

  // Generates a new workout based on user selections and updates the state
  function updateWorkout(){
    if(muscles.length < 1){
      setFormError(true)
      return
    }

    setFormError(false);  // Clear error on success
    let newWorkout = generateWorkout({poison, muscles, goal})
    console.log("newworkout -- ", newWorkout)
    setWorkout(newWorkout)

    // Scrolls the page to an element with id="workout"
    window.location.href = '#workout'
  }

  return (
    <main className='min-h-screen flex flex-col bg-gradient-to-r 
    from-slate-800 to-slate-950 text-white text-sm sm:text-base'>
      <Hero/>
      {/* Workout generator section (3-step form) */}
      <Generator poison={poison} setPoison={setPoison} goal={goal} setGoal={setGoal} formError={formError}
        muscles={muscles} setMuscles={setMuscles} updateWorkout={updateWorkout} setFormError={setFormError}/>
      {/* Show workout section only after it's generated */}
      {workout && (<Workout workout={workout}  totalSetsCompleted={totalSetsCompleted}
        setTotalSetsCompleted={setTotalSetsCompleted}/>)}
    </main>
  )
}

export default App
