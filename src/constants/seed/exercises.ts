export interface ExerciseSeed {
  name: string;
  muscle_group:
    | "chest"
    | "back"
    | "shoulders"
    | "arms"
    | "legs"
    | "core"
    | "cardio"
    | "full_body";
  equipment:
    | "barbell"
    | "dumbbell"
    | "cable"
    | "machine"
    | "bodyweight"
    | "kettlebell"
    | "bands"
    | "none";
  difficulty: "beginner" | "intermediate" | "advanced";
  instructions: string;
}

export const SEED_EXERCISES: ExerciseSeed[] = [
  // =====================
  // CHEST (9 exercises)
  // =====================
  {
    name: "Bench Press",
    muscle_group: "chest",
    equipment: "barbell",
    difficulty: "intermediate",
    instructions:
      "Lie flat on a bench, grip the bar slightly wider than shoulder-width, lower it to mid-chest, then press up to full lockout. Keep your feet flat on the floor and maintain a slight arch in your lower back.",
  },
  {
    name: "Incline Bench Press",
    muscle_group: "chest",
    equipment: "barbell",
    difficulty: "intermediate",
    instructions:
      "Set the bench to a 30-45 degree incline, grip the bar slightly wider than shoulder-width, and press from upper chest to lockout. Keep your shoulder blades retracted and feet planted firmly.",
  },
  {
    name: "Decline Bench Press",
    muscle_group: "chest",
    equipment: "barbell",
    difficulty: "intermediate",
    instructions:
      "Secure your legs at the end of a decline bench, lower the bar to your lower chest, and press back up. Keep your core tight and avoid flaring your elbows excessively.",
  },
  {
    name: "Dumbbell Fly",
    muscle_group: "chest",
    equipment: "dumbbell",
    difficulty: "intermediate",
    instructions:
      "Lie flat on a bench with a dumbbell in each hand, arms extended above your chest. Lower the weights in a wide arc with a slight bend in your elbows, then squeeze your chest to bring them back together.",
  },
  {
    name: "Cable Crossover",
    muscle_group: "chest",
    equipment: "cable",
    difficulty: "intermediate",
    instructions:
      "Stand between two cable stations with handles set high, step forward slightly, and bring your hands together in front of your chest in a hugging motion. Control the weight on the return and keep a slight bend in your elbows.",
  },
  {
    name: "Push-ups",
    muscle_group: "chest",
    equipment: "bodyweight",
    difficulty: "beginner",
    instructions:
      "Place your hands shoulder-width apart on the floor, keep your body in a straight line from head to heels, and lower your chest to the ground. Push back up to full arm extension while engaging your core throughout.",
  },
  {
    name: "Dips (Chest)",
    muscle_group: "chest",
    equipment: "bodyweight",
    difficulty: "advanced",
    instructions:
      "Lean your torso forward on parallel bars and lower yourself until your upper arms are parallel to the floor. Press back up while maintaining the forward lean to emphasize chest activation.",
  },
  {
    name: "Incline Dumbbell Press",
    muscle_group: "chest",
    equipment: "dumbbell",
    difficulty: "intermediate",
    instructions:
      "Set the bench to 30-45 degrees, press the dumbbells from shoulder height to full extension above your upper chest. Lower under control and keep your shoulder blades pinched together throughout.",
  },
  {
    name: "Chest Press Machine",
    muscle_group: "chest",
    equipment: "machine",
    difficulty: "beginner",
    instructions:
      "Sit with your back flat against the pad, grip the handles at chest height, and press forward to full extension. Return slowly and avoid locking out your elbows completely.",
  },

  // =====================
  // BACK (9 exercises)
  // =====================
  {
    name: "Deadlift",
    muscle_group: "back",
    equipment: "barbell",
    difficulty: "advanced",
    instructions:
      "Stand with feet hip-width apart, grip the bar just outside your knees, and drive through your heels to stand up while keeping your back flat. Lower the bar by hinging at the hips and bending the knees.",
  },
  {
    name: "Barbell Row",
    muscle_group: "back",
    equipment: "barbell",
    difficulty: "intermediate",
    instructions:
      "Hinge at the hips with a slight knee bend, grip the bar shoulder-width apart, and row it toward your lower chest. Keep your torso stable and squeeze your shoulder blades at the top.",
  },
  {
    name: "Pull-ups",
    muscle_group: "back",
    equipment: "bodyweight",
    difficulty: "advanced",
    instructions:
      "Hang from a bar with an overhand grip slightly wider than shoulder-width and pull yourself up until your chin clears the bar. Lower yourself under control to a full dead hang.",
  },
  {
    name: "Lat Pulldown",
    muscle_group: "back",
    equipment: "cable",
    difficulty: "beginner",
    instructions:
      "Sit at the machine, grip the bar wider than shoulder-width, and pull it down to your upper chest while leaning back slightly. Control the weight back up without letting your shoulders shrug.",
  },
  {
    name: "Seated Cable Row",
    muscle_group: "back",
    equipment: "cable",
    difficulty: "beginner",
    instructions:
      "Sit upright with your feet on the platform, pull the handle to your lower chest while squeezing your shoulder blades together. Return the weight slowly without rounding your back.",
  },
  {
    name: "T-Bar Row",
    muscle_group: "back",
    equipment: "barbell",
    difficulty: "intermediate",
    instructions:
      "Straddle the bar, grip the handle with both hands, and row the weight toward your chest while maintaining a flat back. Lower under control and avoid using momentum.",
  },
  {
    name: "Face Pulls",
    muscle_group: "back",
    equipment: "cable",
    difficulty: "beginner",
    instructions:
      "Set the cable at face height with a rope attachment, pull toward your face while separating the rope ends, and squeeze your rear delts. Keep your elbows high and return slowly.",
  },
  {
    name: "Single-Arm Dumbbell Row",
    muscle_group: "back",
    equipment: "dumbbell",
    difficulty: "beginner",
    instructions:
      "Place one knee and hand on a bench, row the dumbbell to your hip with the opposite arm, and squeeze your lat at the top. Keep your back flat and avoid rotating your torso.",
  },
  {
    name: "Chin-ups",
    muscle_group: "back",
    equipment: "bodyweight",
    difficulty: "intermediate",
    instructions:
      "Hang from a bar with an underhand shoulder-width grip and pull yourself up until your chin clears the bar. Lower yourself with control to a full dead hang between reps.",
  },

  // =====================
  // SHOULDERS (8 exercises)
  // =====================
  {
    name: "Overhead Press",
    muscle_group: "shoulders",
    equipment: "barbell",
    difficulty: "intermediate",
    instructions:
      "Stand with feet shoulder-width apart, press the bar from your upper chest to overhead lockout. Keep your core braced and avoid excessive lower-back arching.",
  },
  {
    name: "Lateral Raise",
    muscle_group: "shoulders",
    equipment: "dumbbell",
    difficulty: "beginner",
    instructions:
      "Stand with dumbbells at your sides and raise them out to the sides until your arms are parallel to the floor. Lower slowly and avoid swinging or shrugging your shoulders.",
  },
  {
    name: "Front Raise",
    muscle_group: "shoulders",
    equipment: "dumbbell",
    difficulty: "beginner",
    instructions:
      "Stand holding dumbbells in front of your thighs and raise one or both arms to shoulder height with a slight elbow bend. Lower under control and keep your torso stationary.",
  },
  {
    name: "Rear Delt Fly",
    muscle_group: "shoulders",
    equipment: "dumbbell",
    difficulty: "beginner",
    instructions:
      "Bend forward at the hips with dumbbells hanging below your chest, then raise the weights out to the sides. Squeeze your shoulder blades together at the top and lower slowly.",
  },
  {
    name: "Arnold Press",
    muscle_group: "shoulders",
    equipment: "dumbbell",
    difficulty: "intermediate",
    instructions:
      "Start with dumbbells at shoulder height, palms facing you, then rotate your palms outward as you press overhead. Reverse the motion on the way down for a full range of motion.",
  },
  {
    name: "Upright Row",
    muscle_group: "shoulders",
    equipment: "barbell",
    difficulty: "intermediate",
    instructions:
      "Hold the bar with a narrow grip in front of your thighs and pull it up along your body to chin height, leading with your elbows. Lower slowly and avoid excessive internal shoulder rotation.",
  },
  {
    name: "Cable Lateral Raise",
    muscle_group: "shoulders",
    equipment: "cable",
    difficulty: "beginner",
    instructions:
      "Stand sideways to a low cable pulley, grab the handle with the far hand, and raise your arm out to the side to shoulder height. Lower under control and keep a slight bend in your elbow.",
  },
  {
    name: "Dumbbell Shoulder Press",
    muscle_group: "shoulders",
    equipment: "dumbbell",
    difficulty: "intermediate",
    instructions:
      "Sit or stand with dumbbells at shoulder height, palms facing forward, and press them overhead to full extension. Lower the weights back to shoulder level under control.",
  },

  // =====================
  // ARMS (9 exercises)
  // =====================
  {
    name: "Barbell Curl",
    muscle_group: "arms",
    equipment: "barbell",
    difficulty: "beginner",
    instructions:
      "Stand with an underhand grip on the bar at shoulder width, curl the weight to your shoulders while keeping your elbows pinned to your sides. Lower slowly without swinging your body.",
  },
  {
    name: "Hammer Curl",
    muscle_group: "arms",
    equipment: "dumbbell",
    difficulty: "beginner",
    instructions:
      "Hold dumbbells with a neutral grip (palms facing each other) and curl them toward your shoulders. Keep your elbows stationary and lower the weight under control.",
  },
  {
    name: "Tricep Pushdown",
    muscle_group: "arms",
    equipment: "cable",
    difficulty: "beginner",
    instructions:
      "Stand at a cable machine with a bar or rope attachment, push the weight down by extending your elbows until your arms are straight. Keep your upper arms locked at your sides throughout.",
  },
  {
    name: "Skull Crushers",
    muscle_group: "arms",
    equipment: "barbell",
    difficulty: "intermediate",
    instructions:
      "Lie on a bench and hold the bar above your chest with arms extended, then lower it toward your forehead by bending only at the elbows. Press back up to full extension without moving your upper arms.",
  },
  {
    name: "Preacher Curl",
    muscle_group: "arms",
    equipment: "barbell",
    difficulty: "intermediate",
    instructions:
      "Rest your upper arms on the preacher pad, curl the bar up to shoulder height, and lower it back down with control. Avoid swinging and ensure a full stretch at the bottom.",
  },
  {
    name: "Overhead Tricep Extension",
    muscle_group: "arms",
    equipment: "dumbbell",
    difficulty: "intermediate",
    instructions:
      "Hold a dumbbell overhead with both hands, lower it behind your head by bending at the elbows, then extend back up. Keep your upper arms close to your ears and your core tight.",
  },
  {
    name: "Concentration Curl",
    muscle_group: "arms",
    equipment: "dumbbell",
    difficulty: "beginner",
    instructions:
      "Sit on a bench, brace the back of your upper arm against your inner thigh, and curl the dumbbell toward your shoulder. Squeeze at the top and lower slowly for maximum bicep isolation.",
  },
  {
    name: "Close-Grip Bench Press",
    muscle_group: "arms",
    equipment: "barbell",
    difficulty: "intermediate",
    instructions:
      "Lie on a bench, grip the bar with hands shoulder-width apart or narrower, and press from your chest to lockout. Keep your elbows tucked close to your body to target the triceps.",
  },
  {
    name: "Cable Bicep Curl",
    muscle_group: "arms",
    equipment: "cable",
    difficulty: "beginner",
    instructions:
      "Stand facing a low cable pulley with a straight or EZ-bar attachment and curl the handle toward your shoulders. Keep your elbows at your sides and lower the weight under control.",
  },

  // =====================
  // LEGS (11 exercises)
  // =====================
  {
    name: "Squat",
    muscle_group: "legs",
    equipment: "barbell",
    difficulty: "intermediate",
    instructions:
      "Place the bar on your upper traps, stand with feet shoulder-width apart, and squat down until your thighs are at least parallel to the floor. Drive through your heels to stand back up while keeping your chest tall.",
  },
  {
    name: "Leg Press",
    muscle_group: "legs",
    equipment: "machine",
    difficulty: "beginner",
    instructions:
      "Sit in the leg press machine with feet shoulder-width apart on the platform, lower the sled until your knees reach 90 degrees, then press back up. Do not lock out your knees completely at the top.",
  },
  {
    name: "Romanian Deadlift",
    muscle_group: "legs",
    equipment: "barbell",
    difficulty: "intermediate",
    instructions:
      "Hold the bar at hip height, hinge forward at the hips while keeping a slight knee bend, and lower the bar along your legs until you feel a hamstring stretch. Drive your hips forward to return to standing.",
  },
  {
    name: "Lunges",
    muscle_group: "legs",
    equipment: "dumbbell",
    difficulty: "beginner",
    instructions:
      "Step forward with one leg, lower your back knee toward the floor until both knees form 90-degree angles, then push back to the starting position. Keep your torso upright and alternate legs.",
  },
  {
    name: "Leg Curl",
    muscle_group: "legs",
    equipment: "machine",
    difficulty: "beginner",
    instructions:
      "Lie face down on the leg curl machine with the pad behind your ankles and curl your heels toward your glutes. Lower the weight slowly and avoid lifting your hips off the bench.",
  },
  {
    name: "Leg Extension",
    muscle_group: "legs",
    equipment: "machine",
    difficulty: "beginner",
    instructions:
      "Sit in the machine with the pad against your shins and extend your legs until they are straight. Lower the weight slowly and avoid using momentum to swing the weight up.",
  },
  {
    name: "Calf Raises",
    muscle_group: "legs",
    equipment: "machine",
    difficulty: "beginner",
    instructions:
      "Stand on the edge of a platform with the balls of your feet, rise up onto your toes as high as possible, then lower your heels below the platform for a full stretch. Keep your knees straight throughout.",
  },
  {
    name: "Hip Thrust",
    muscle_group: "legs",
    equipment: "barbell",
    difficulty: "intermediate",
    instructions:
      "Sit on the floor with your upper back against a bench, roll a barbell over your hips, and drive through your heels to lift your hips until your body forms a straight line from shoulders to knees. Squeeze your glutes at the top and lower under control.",
  },
  {
    name: "Bulgarian Split Squat",
    muscle_group: "legs",
    equipment: "dumbbell",
    difficulty: "intermediate",
    instructions:
      "Stand in a staggered stance with your rear foot elevated on a bench behind you and lower your back knee toward the floor. Push through your front heel to return to standing while keeping your torso upright.",
  },
  {
    name: "Goblet Squat",
    muscle_group: "legs",
    equipment: "dumbbell",
    difficulty: "beginner",
    instructions:
      "Hold a dumbbell vertically against your chest with both hands, squat down until your elbows touch the inside of your knees, then stand back up. Keep your chest tall and heels on the floor.",
  },
  {
    name: "Hack Squat",
    muscle_group: "legs",
    equipment: "machine",
    difficulty: "intermediate",
    instructions:
      "Position yourself in the hack squat machine with your back against the pad and feet shoulder-width apart. Lower until your thighs are parallel and press back up through your heels.",
  },

  // =====================
  // CORE (7 exercises)
  // =====================
  {
    name: "Plank",
    muscle_group: "core",
    equipment: "bodyweight",
    difficulty: "beginner",
    instructions:
      "Support your body on your forearms and toes with your body in a straight line from head to heels. Brace your core, keep your hips level, and hold the position without sagging or piking.",
  },
  {
    name: "Cable Crunch",
    muscle_group: "core",
    equipment: "cable",
    difficulty: "intermediate",
    instructions:
      "Kneel below a high cable pulley with a rope attachment behind your head and crunch your torso downward by flexing your spine. Focus on contracting your abs rather than pulling with your arms.",
  },
  {
    name: "Hanging Leg Raise",
    muscle_group: "core",
    equipment: "bodyweight",
    difficulty: "advanced",
    instructions:
      "Hang from a pull-up bar with straight arms and raise your legs until they are parallel to the floor or higher. Lower them slowly and avoid swinging or using momentum.",
  },
  {
    name: "Russian Twist",
    muscle_group: "core",
    equipment: "bodyweight",
    difficulty: "intermediate",
    instructions:
      "Sit with your knees bent and feet off the floor, lean back slightly, and rotate your torso side to side. Keep your core braced and move in a controlled manner.",
  },
  {
    name: "Ab Wheel Rollout",
    muscle_group: "core",
    equipment: "bodyweight",
    difficulty: "advanced",
    instructions:
      "Kneel on the floor, grip the ab wheel handles, and roll forward by extending your arms and hips while keeping your core tight. Pull yourself back to the starting position without arching your lower back.",
  },
  {
    name: "Mountain Climbers",
    muscle_group: "core",
    equipment: "bodyweight",
    difficulty: "beginner",
    instructions:
      "Start in a push-up position and rapidly drive your knees toward your chest in an alternating fashion. Keep your hips low, core braced, and maintain a steady pace.",
  },
  {
    name: "Dead Bug",
    muscle_group: "core",
    equipment: "bodyweight",
    difficulty: "beginner",
    instructions:
      "Lie on your back with arms extended toward the ceiling and knees bent at 90 degrees, then slowly extend opposite arm and leg toward the floor. Keep your lower back pressed into the ground throughout.",
  },

  // =====================
  // CARDIO (6 exercises)
  // =====================
  {
    name: "Running",
    muscle_group: "cardio",
    equipment: "none",
    difficulty: "beginner",
    instructions:
      "Maintain an upright posture, land midfoot with each stride, and keep a steady breathing rhythm. Start at a comfortable pace and gradually increase speed or distance over time.",
  },
  {
    name: "Cycling",
    muscle_group: "cardio",
    equipment: "machine",
    difficulty: "beginner",
    instructions:
      "Adjust the seat height so your knee has a slight bend at the bottom of the pedal stroke. Maintain a smooth cadence and keep your upper body relaxed.",
  },
  {
    name: "Rowing",
    muscle_group: "cardio",
    equipment: "machine",
    difficulty: "intermediate",
    instructions:
      "Drive with your legs first, then lean back slightly and pull the handle to your lower chest. Return by extending your arms, hinging forward, then bending your knees.",
  },
  {
    name: "Jump Rope",
    muscle_group: "cardio",
    equipment: "none",
    difficulty: "beginner",
    instructions:
      "Keep your elbows close to your sides, rotate the rope with your wrists, and jump just high enough to clear the rope. Land softly on the balls of your feet with your knees slightly bent.",
  },
  {
    name: "Stair Climber",
    muscle_group: "cardio",
    equipment: "machine",
    difficulty: "intermediate",
    instructions:
      "Stand upright on the machine with a light grip on the rails for balance and drive each foot down through the full step. Avoid leaning heavily on the handrails.",
  },
  {
    name: "Swimming",
    muscle_group: "cardio",
    equipment: "none",
    difficulty: "intermediate",
    instructions:
      "Maintain a streamlined body position, breathe rhythmically to one or both sides, and use long, efficient strokes. Focus on a steady kick and rotating your body with each stroke.",
  },

  // =====================
  // FULL BODY (5 exercises)
  // =====================
  {
    name: "Clean and Press",
    muscle_group: "full_body",
    equipment: "barbell",
    difficulty: "advanced",
    instructions:
      "Pull the bar explosively from the floor to your shoulders in one motion, then press it overhead to lockout. Keep the bar close to your body throughout and use your hips to generate power.",
  },
  {
    name: "Burpees",
    muscle_group: "full_body",
    equipment: "bodyweight",
    difficulty: "intermediate",
    instructions:
      "From standing, drop into a push-up position, perform a push-up, jump your feet to your hands, and leap into the air. Move fluidly between each phase and land softly.",
  },
  {
    name: "Thrusters",
    muscle_group: "full_body",
    equipment: "barbell",
    difficulty: "intermediate",
    instructions:
      "Hold the bar in a front rack position, squat to parallel, then drive up explosively and press the bar overhead in one fluid motion. Keep your core braced and elbows high during the squat.",
  },
  {
    name: "Kettlebell Swings",
    muscle_group: "full_body",
    equipment: "kettlebell",
    difficulty: "intermediate",
    instructions:
      "Hinge at the hips to swing the kettlebell between your legs, then snap your hips forward to drive it to chest height. Keep your arms relaxed and power the movement with your glutes and hamstrings.",
  },
  {
    name: "Turkish Get-up",
    muscle_group: "full_body",
    equipment: "kettlebell",
    difficulty: "advanced",
    instructions:
      "Lie on your back holding a kettlebell overhead with one arm and methodically stand up while keeping the weight locked out above you. Reverse each step to return to the floor with control.",
  },
];
