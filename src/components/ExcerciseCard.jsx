import React, {useState} from 'react'

export default function ExcerciseCard(props) {
    const [setsCompleted, setSetsCompleted] = useState(0)

    const {excercise, i, onSetIncrement} = props

    // function handleSetIncrement(){
    //     setSetsCompleted((setsCompleted + 1) % 6)
    // }
    function handleSetIncrement() {
        // const next = (setsCompleted + 1) % 6;
        // if (next > setsCompleted && onSetIncrement) {
        //   onSetIncrement(); // Notify parent only on actual +1
        // }
        // setSetsCompleted(next);
        if (setsCompleted < 5) {
            setSetsCompleted(setsCompleted + 1);
            if (onSetIncrement) onSetIncrement(); // update global only once per valid increment
        }
    }

    return (
    <div className='p-4 rounded:md flex flex-col gap-4 bg-slate-950 sm:flex-wrap'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:flex-wrap gap-x-4'>
            <h4 className='text-3xl hidden sm:inline sm:text-4xl md:text-5xl
            font-semibold text-slate-400'>0{i+1}</h4>
            <h2 className='capitalize whitespace-nowrap truncate max-w-full text-lg sm:text-xl
            md:text-2xl flex-1 sm:text-center'>
                {excercise.name.replaceAll("_", " ")}
            </h2>
            <p className='text-sm text-slate-400 capitalize'>{excercise.type}</p>
        </div>
        <div className='flex flex-col'>
            <h3 className='text-slate-400 text-sm'>Muscle Groups</h3>
            <p className='capitalize'>{excercise.muscles.join(' & ')}</p>
        </div>
        <div className='flex flex-col bg-slate-950 rounded gap-2'>
            {excercise.description.split('_').map((val, idx) => {
                return(
                    <div  key={idx} className='text-sm'>
                        {val}
                    </div>
                )
            })}
        </div>
        <div className='grid grid-cols-2 sm:grid-cols-4 sm:place-items-center gap-2'>
            {['reps', 'rest', 'tempo'].map(info => {
                return(
                    <div key={info} className='flex flex-col p-2 rounded border-[1.5px]
                    border-solid border-slate-900 w-full'>
                        <h3 className='capitalize text-slate-400 text-sm'>{info === 'reps' ? `${excercise.unit}`: info}</h3>
                        <p className='font-medium'>{excercise[info]}</p>
                    </div>
                )
            })}
            
        {/* Button to increment the number of completed sets for this exercise
        Displays progress in the format: current/total (e.g., 3/5) */}
        <button onClick={handleSetIncrement} className='flex flex-col p-2 rounded border-[1.5px] duration-200'>
            <h3 className='text-slate-400 text-sm capitalize'>Sets</h3>
            <p className='font-medium'>{setsCompleted}/5</p>
        </button>
        </div>

    </div>
  )
}
