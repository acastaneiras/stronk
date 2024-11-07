"use client"
import { useState } from 'react'
import { ChevronLeft, GripVertical } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { DndContext } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Exercise {
  id: number;
  name: string;
}

const DraggableExercise = ({ exercise }: { exercise: Exercise }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: exercise.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style} className="flex flex-row items-center justify-between gap-4 px-4 py-2 bg-gray-100 rounded-lg">
      <div className="flex flex-row items-center gap-4">
        <GripVertical className="cursor-move" />
        <span className="text-xl font-bold">{exercise.name}</span>
      </div>
    </div>
  )
}

const ReorderExercises = () => {
  const [exercises] = useState([
    { id: 1, name: 'Bench Press' },
    { id: 2, name: 'Deadlift' },
    { id: 3, name: 'Squat' },
    { id: 4, name: 'Overhead Press' },
    { id: 5, name: 'Pull Up' },
  ])

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-row items-center justify-between'>
        <div className='w-10'>
          <ChevronLeft className="cursor-pointer" />
        </div>
        <h1 className="text-xl font-bold tracking-tighter w-full text-center ">Reorder Exercises</h1>
      </div>
      <Separator />
      <DndContext>
        <SortableContext items={exercises} strategy={rectSortingStrategy}>
          <div className="flex flex-col gap-2">
            {exercises.map((exercise) => (
              <DraggableExercise key={exercise.id} exercise={exercise} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}

export default ReorderExercises
