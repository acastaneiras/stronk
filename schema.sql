create table public."ExerciseDetails" (
  id uuid not null default gen_random_uuid (),
  notes text null default '' :: text,
  "setInterval" numeric null,
  "order" numeric null,
  "exerciseId" uuid not null,
  "createdAt" timestamp with time zone not null default now(),
  sets jsonb null,
  constraint ExerciseDetails_pkey primary key (id),
  constraint ExerciseDetails_exerciseId_fkey foreign key ("exerciseId") references "Exercises" (id) on update cascade on delete cascade
) tablespace pg_default;

create table public."Exercises" (
  id uuid not null default gen_random_uuid (),
  guid text not null,
  name text not null,
  category text null,
  "primaryMuscles" json null,
  "secondaryMuscles" json null,
  equipment text null,
  instructions json null,
  "isCustom" boolean null default false,
  "userId" uuid null,
  "createdAt" timestamp with time zone not null default now(),
  images json null,
  constraint exercises_pkey primary key (id),
  constraint Exercises_userId_fkey foreign key ("userId") references "Users" (id) on update cascade on delete cascade
) tablespace pg_default;

create table public."RoutineExerciseDetails" (
  "routineId" uuid not null,
  "exerciseDetailsId" uuid not null,
  "createdAt" timestamp with time zone not null default now(),
  constraint RoutineExerciseDetails_pkey primary key ("routineId", "exerciseDetailsId"),
  constraint RoutineExerciseDetails_exerciseDetailsId_fkey foreign key ("exerciseDetailsId") references "ExerciseDetails" (id) on update cascade on delete cascade,
  constraint RoutineExerciseDetails_routineId_fkey foreign key ("routineId") references "Routines" (id) on update cascade on delete cascade
) tablespace pg_default;

create table public."Routines" (
  id uuid not null default gen_random_uuid (),
  "createdAt" timestamp with time zone not null default now(),
  title text not null,
  "userId" uuid not null,
  units text null,
  constraint routines_pkey primary key (id),
  constraint routines_userid_fkey foreign key ("userId") references "Users" (id) on update cascade on delete cascade
) tablespace pg_default;

create table public."Users" (
  id uuid not null default gen_random_uuid (),
  "firstName" text null,
  "lastName" text null,
  alias text null,
  "unitPreference" text null,
  created_at timestamp with time zone not null default now(),
  "intensitySetting" text null,
  constraint Users_pkey primary key (id),
  constraint Users_id_fkey foreign key (id) references auth.users (id) on update cascade on delete cascade
) tablespace pg_default;

create table public."WorkoutExerciseDetails" (
  "workoutId" uuid not null,
  "exerciseDetailsId" uuid not null,
  "createdAt" timestamp with time zone not null default now(),
  constraint WorkoutExerciseDetails_pkey primary key ("workoutId", "exerciseDetailsId"),
  constraint WorkoutExerciseDetails_exerciseDetailsId_fkey foreign key ("exerciseDetailsId") references "ExerciseDetails" (id) on update cascade on delete cascade,
  constraint WorkoutExerciseDetails_workoutId_fkey foreign key ("workoutId") references "Workouts" (id) on update cascade on delete cascade
) tablespace pg_default;

create table public."Workouts" (
  id uuid not null default gen_random_uuid (),
  title text not null,
  description text null,
  date timestamp with time zone null,
  duration numeric null,
  sets numeric null,
  volume numeric null,
  units text null,
  "createdAt" timestamp with time zone not null default now(),
  "routineId" uuid null,
  "userId" uuid null default auth.uid (),
  constraint Workouts_pkey primary key (id),
  constraint Workouts_userId_fkey foreign key ("userId") references "Users" (id) on update cascade on delete cascade
) tablespace pg_default;