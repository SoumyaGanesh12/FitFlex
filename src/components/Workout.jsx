import React, {useState, useEffect, useRef} from 'react'
import SectionWrapper from './SectionWrapper'
import ExcerciseCard from './ExcerciseCard'
// import Confetti from 'react-confetti';
// import html2pdf from 'html2pdf.js';
import jsPDF from 'jspdf';
import Button from './Button';

export default function Workout(props) {
    const {workout, totalSetsCompleted, setTotalSetsCompleted} = props

    const totalSets = workout.length * 5;
    const progress = Math.round((totalSetsCompleted / totalSets) * 100);

    // const [showConfetti, setShowConfetti] = useState(true);

    // // Show confetti when all sets are completed
    // useEffect(() => {
    //     if (totalSetsCompleted === totalSets) {
    //     setShowConfetti(true);
    //     setTimeout(() => setShowConfetti(false), 5000);
    //     }
    // }, [totalSetsCompleted, totalSets]);

    function handleTextBasedPDF(workout) {
        const doc = new jsPDF();
        let y = 10;
      
        doc.setFontSize(16);
        doc.setFont('Helvetica', 'bold');
        doc.text("FitFlex Workout Plan", 10, y);
        y += 10;
      
        workout.forEach((exercise, index) => {
          doc.setFontSize(12);
          doc.setFont('Helvetica', 'bold');
          doc.text(`${index + 1}. ${exercise.name.replaceAll("_", " ")}`, 10, y);
          y += 7;
          doc.setFontSize(10);
          // Reset font for the rest of the content
          doc.setFont('Helvetica', 'normal');
          doc.text(`   - Type: ${exercise.type}`, 10, y);
          y += 5;
          doc.text(`   - Muscles: ${exercise.muscles.join(", ")}`, 10, y);
          y += 5;
          doc.text(`   - Reps: ${exercise.reps} | Rest: ${exercise.rest}s | Tempo: ${exercise.tempo}`, 10, y);
          y += 5;
          doc.text(`   - Description:`, 10, y);
          y += 5;
      
          const descLines = doc.splitTextToSize(exercise.description.replaceAll('_', ' '), 180);
          doc.text(descLines, 10, y);
          y += descLines.length * 5 + 5;
      
          if (y > 270) {
            doc.addPage();
            y = 10;
          }
        });
      
        doc.save("FitFlex_Workout.pdf");
    }

    return (
        <SectionWrapper id={workout} header={"welcome to"} title={['The', 'DANGER', 'zone']}>
            {/* {showConfetti && <Confetti />} */}
            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-3 rounded overflow-hidden">
                {/* <div
                className="bg-blue-500 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
                ></div> */}
                <div className={`h-full transition-all duration-300 ${
                        totalSetsCompleted === totalSets ? 'bg-green-500' : 'bg-blue-500'
                    }`} style={{ width: `${progress}%` }}>

                </div>
            </div>
            <p className="text-sm text-center text-slate-300 mb-1 mt-1">
                {totalSetsCompleted} of {totalSets} sets completed ({progress}%)
            </p>

            {/* Success Message */}
            {totalSetsCompleted === workout.length * 5 && (
                <div className="flex items-center justify-center gap-2 text-green-400 animate-bounce mb-2">
                <span className="text-2xl">🎉</span>
                <p className="text-sm font-semibold text-white">Workout Complete! You crushed it! 💪</p>
                <span className="text-2xl">🎉</span>
                </div>
            )}

            {/* Excercise details */}
            <div className='flex flex-col gap-4'>
                {workout.map((excercise, i) => {
                    return(
                        <ExcerciseCard i={i} excercise={excercise} key={`${excercise.name}-${excercise.reps}`}
                         onSetIncrement={() => setTotalSetsCompleted(prev => prev + 1)}></ExcerciseCard>
                    )
                })}
            </div>

            {/* Download workout as pdf */}
            <Button
                text="📄 Download Workout as PDF"
                func={() => handleTextBasedPDF(workout)}
                />
        </SectionWrapper>
    )
}
