import { EXERCISES, SCHEMES, TEMPOS, WORKOUTS } from "./swoldier"
// To randomly generate workouts, it's easier if every exercise (even variants) is treated as its own unique entry
const exercises = exercisesFlattener(EXERCISES)

// Before flattening:
// barbell_bench_press: { variants: { incline: "...", flat: "...", ... }, ... }
// After flattening:
// incline_barbell_bench_press: { ... }, flat_barbell_bench_press: { ... }, ...
// → Treats each variant as a standalone exercise for easy access and randomization

// Generates a personalized workout based on selected muscle groups, workout type, and goal.
export function generateWorkout(args) {
    console.log("Recieved args - ", args)
    const { muscles, poison: workout, goal } = args
    console.log("User selected poison -", workout)
    let exer = Object.keys(exercises);

    // Filter out exercises meant for 'home' environment
    exer = exer.filter((key) => exercises[key].meta.environment !== "home");
    let includedTracker = []; // To avoid repeating exercises
    let numSets = 5;
    let listOfMuscles;

    // Determine list of target muscles based on workout type
    if (workout === "individual") {
        listOfMuscles = muscles;
    } else {
        listOfMuscles = WORKOUTS[workout][muscles[0]];
    }

    // Shuffle and deduplicate muscles for variation
    listOfMuscles = new Set(shuffleArray(listOfMuscles));
    let arrOfMuscles = Array.from(listOfMuscles);
    let scheme = goal

    // --------------------------------------------------------------------------------------------

    // sets is the blueprint or skeleton your final workout is built from
    let sets = SCHEMES[scheme].ratio
        .reduce((acc, curr, index) => {
            //make this compound and exercise muscle -> array of objects and destructure in loop
            return [
                ...acc,
                ...[...Array(parseInt(curr)).keys()].map((val) =>
                    index === 0 ? "compound" : "accessory"
                ),
            ];
        }, [])
        .reduce((acc, curr, index) => {
            const muscleGroupToUse =
                index < arrOfMuscles.length
                    ? arrOfMuscles[index]
                    : arrOfMuscles[index % arrOfMuscles.length];
            return [
                ...acc,
                {
                    setType: curr,
                    muscleGroup: muscleGroupToUse,
                },
            ];
        }, []);

    // Example: scheme = 'strength_power'
    // SCHEMES['strength_power'].ratio = [3, 2] → means: 3 compound, 2 accessory sets
    // arrOfMuscles = ['chest', 'back']

    // Step 1: Build set types array based on ratio
    // First reduce returns:
    // [
    //     "compound", "compound", "compound",  // from ratio[0] = 3
    //     "accessory", "accessory"             // from ratio[1] = 2
    // ]
    
    // Step 2: Assign muscle groups to each set
    // Using arrOfMuscles = ['chest', 'back']
    
    // Final output:
    // sets =
    // [
    //     { setType: 'compound', muscleGroup: 'chest' },   // index 0 → 'chest'
    //     { setType: 'compound', muscleGroup: 'back' },    // index 1 → 'back'
    //     { setType: 'compound', muscleGroup: 'chest' },   // index 2 → wraps around (2 % 2 = 0)
    //     { setType: 'accessory', muscleGroup: 'back' },   // index 3 → (3 % 2 = 1)
    //     { setType: 'accessory', muscleGroup: 'chest' }   // index 4 → (4 % 2 = 0)
    // ]
    
    // --------------------------------------------------------------------------------------------

    // Categorize all exercises into compound and accessory, filtered by target muscles
    // Reduce over the list of exercise keys (exer) to group matching exercises by type:
    // - curr: the current exercise key (e.g., "incline_barbell_bench_press")
    // - acc: the accumulator object, starts as { compound: {}, accessory: {} }
    //        and grows by adding exercises that target selected muscles
    const { compound: compoundExercises, accessory: accessoryExercises } =
        exer.reduce(
            (acc, curr) => {
                let exerciseHasRequiredMuscle = false;
                for (const musc of exercises[curr].muscles) {
                    if (listOfMuscles.has(musc)) {
                        exerciseHasRequiredMuscle = true;
                    }
                }
                return exerciseHasRequiredMuscle
                    ? {
                        ...acc,
                        [exercises[curr].type]: {
                            ...acc[exercises[curr].type],
                            [curr]: exercises[curr],
                        },
                    }
                    : acc;
            },
            { compound: {}, accessory: {} }
        );
        // acc = {
        // compound: {
        //     incline_barbell_bench_press: { ... }
        // },
        // accessory: {
        //     decline_prayer_press: { ... }
        // }
        // }

    // --------------------------------------------------------------------------------------------
   
    // For each set in the workout plan:
    // 1. Get the correct exercise pool based on set type (compound/accessory)
    // 2. Filter out already-used exercises and those not targeting the required muscle group
    // 3. Store eligible exercises in filteredDataList
    // 4. Prepare a fallback list (filteredOppList) from the opposite type in case no match is found
    
    // sets = [
    //     { setType: 'compound', muscleGroup: 'chest' },
    //     { setType: 'accessory', muscleGroup: 'back' },
    //     ...
    //   ]

    // compoundExercises = {
    // incline_barbell_bench_press: {
    //     type: "compound",
    //     muscles: ["chest"],
    //     unit: "reps",
    //     meta: {
    //     environment: "gym",
    //     level: [0, 1, 2],
    //     equipment: ["barbell"]
    //     },
    //     description: "Ensure your scapula are retracted...___With a bench inclined between 30 and 45 degrees...",
    //     substitutes: ["pushups", "dumbbell bench press", "flat_barbell_bench_press", ...],
    // },
    // dips: {
    //     type: "compound",
    //     muscles: ["chest", "triceps"],
    //     ...
    // }
    // }

    // accessoryExercises = {
    // prayer_press_incline: {
    //     type: "accessory",
    //     muscles: ["chest"],
    //     unit: "reps",
    //     meta: {
    //     environment: "gymhome",
    //     level: [0, 1, 2],
    //     equipment: []
    //     },
    //     description: "Place a plate between palms...___Press your hands away from you at a 45 degree angle...",
    //     substitutes: ["palm prayer press", "prayer_press_horizontal", "prayer_press_decline"],
    // },
    // standing_plate_raises: {
    //     type: "accessory",
    //     muscles: ["chest", "shoulders"],
    //     ...
    // }
    // }
    const genWOD = sets.map(({ setType, muscleGroup }) => {
        const data =
            setType === "compound" ? compoundExercises : accessoryExercises;
        
        // Filter out already used exercises or ones not matching the current muscle group
        const filteredObj = Object.keys(data).reduce((acc, curr) => {
            if (
                includedTracker.includes(curr) ||
                !data[curr].muscles.includes(muscleGroup) // Doesnt match the muscle group
            ) {
                // if (includedTracker.includes(curr)) { console.log('banana', curr) }
                return acc;
            }
            return { ...acc, [curr]: exercises[curr] };
        }, {});
        const filteredDataList = Object.keys(filteredObj);
        const filteredOppList = Object.keys(
            setType === "compound" ? accessoryExercises : compoundExercises
        ).filter((val) => !includedTracker.includes(val));

        // --------------------------------------------------------------------------------------------

        // Randomly pick an excercise
        let randomExercise =
            filteredDataList[
            Math.floor(Math.random() * filteredDataList.length)
            ] ||
            filteredOppList[
            Math.floor(Math.random() * filteredOppList.length)
            ];

        // console.log(randomExercise)

        if (!randomExercise) {
            return {};
        }

        // --------------------------------------------------------------------------------------------
        
        // 1. Calculate reps or duration based on exercise type and scheme
        // 2. Randomly select a tempo
        // 3. If total time (reps × tempo) exceeds 85s, reduce reps
        // 4. Round duration to nearest 5s for time-based exercises
        // 5. Track used exercise to avoid duplicates
        // 6. Return full exercise data with added tempo, reps, and rest

        // Calculate reps or duration based on unit type (reps or seconds)
        let repsOrDuraction =
            exercises[randomExercise].unit === "reps"
                ? Math.min(...SCHEMES[scheme].repRanges) +
                Math.floor(
                    Math.random() *
                    (Math.max(...SCHEMES[scheme].repRanges) -
                        Math.min(...SCHEMES[scheme].repRanges))
                ) +
                (setType === "accessory" ? 4 : 0)
                : Math.floor(Math.random() * 40) + 20;
        const tempo = TEMPOS[Math.floor(Math.random() * TEMPOS.length)];

        // Adjust reps if total duration with tempo exceeds 85 seconds
        if (exercises[randomExercise].unit === "reps") {
            const tempoSum = tempo
                .split(" ")
                .reduce((acc, curr) => acc + parseInt(curr), 0);
            if (tempoSum * parseInt(repsOrDuraction) > 85) {
                repsOrDuraction = Math.floor(85 / tempoSum);
            }
        } else {
            //set to nearest 5 seconds
            repsOrDuraction = Math.ceil(parseInt(repsOrDuraction) / 5) * 5;
        }
        includedTracker.push(randomExercise);

        return {
            name: randomExercise,
            tempo,
            rest: SCHEMES[scheme]["rest"][setType === "compound" ? 0 : 1],
            reps: repsOrDuraction,
            ...exercises[randomExercise],
        };
    });

    return genWOD.filter(
        (element) => Object.keys(element).length > 0
    );
}

// Shuffles the input array using Fisher-Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
        let temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
    return array
}

function exercisesFlattener(exercisesObj) {
    const flattenedObj = {}

    for (const [key, val] of Object.entries(exercisesObj)) {
        if (!("variants" in val)) {
            flattenedObj[key] = val
        } else {
            for (const variant in val.variants) {
                let variantName = variant + "_" + key
                let variantSubstitutes = Object.keys(val.variants).map((element) => {
                    return element + ' ' + key
                }).filter(element => element.replaceAll(' ', '_') !== variantName)

                flattenedObj[variantName] = {
                    ...val,
                    description: val.description + '___' + val.variants[variant],
                    substitutes: [
                        ...val.substitutes, variantSubstitutes
                    ].slice(0, 5)
                }
            }
        }
    }
    return flattenedObj
}