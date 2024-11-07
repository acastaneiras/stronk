"use client"
import { useState } from 'react'
import { ChevronLeft, ImageIcon, PlusCircle } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { DndContext } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const DraggableExercise = ({ exercise }: { exercise: Exercise, index: number }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: exercise.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Card ref={setNodeRef} {...attributes} {...listeners} style={style} className="flex flex-row items-center justify-between gap-4 px-4 py-2 shadow-none rounded-lg">
      <div className="flex flex-row items-center gap-4">
        <ImageIcon className="cursor-move" />
        <div className='flex flex-col gap-1'>
          <span className="text-xl font-bold flex flex-col">{exercise.name}</span>
          <Badge className="w-min text-nowrap">Strength</Badge>
          <span className='text-xs'>{exercise.muscle}</span>
        </div>
      </div>
    </Card>
  )
}

type Exercise = {
  id: number;
  name: string;
  muscle: string;
};

const ExerciseList = () => {
  const [exercises] = useState([
    { id: 1, muscle: "Chest", name: 'Bench Press' },
    { id: 2, muscle: "Legs", name: 'Deadlift' },
    { id: 3, muscle: "Legs", name: 'Squat' },
    { id: 4, muscle: "Shoulders", name: 'Overhead Press' },
    { id: 5, muscle: "Back", name: 'Pull Up' },
  ])

  const [groupDrawerOpen, setGroupDrawerOpen] = useState(false)
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false)
  const [equipmentDrawerOpen, setEquipmentDrawerOpen] = useState(false)
  const [createExerciseOpen, setCreateExerciseOpen] = useState(false)

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-row items-center justify-between'>
        <div className='w-10'>
          <ChevronLeft className="cursor-pointer" />
        </div>
        <h1 className="text-xl font-bold tracking-tighter w-full text-center ">Exercise List</h1>
        <div className='w-10' >
          <PlusCircle className="cursor-pointer" onClick={() => setCreateExerciseOpen(true)} />
        </div>
      </div>

      <Input placeholder="Search exercise" />

      <div className='flex justify-center gap-1'>
        <Button className='w-full' onClick={() => setCategoryDrawerOpen(true)}>Category</Button>
        <Button className='w-full' onClick={() => setEquipmentDrawerOpen(true)}>Equipment</Button>
        <Button className='w-full' onClick={() => setGroupDrawerOpen(true)}>M. Group</Button>
      </div>

      <Separator className='h-[2px]' />

      <DndContext>
        <SortableContext items={exercises} strategy={rectSortingStrategy}>
          <div className="flex flex-col gap-2">
            {exercises.map((exercise, index) => (
              <DraggableExercise key={exercise.id} exercise={exercise} index={index} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Drawer open={groupDrawerOpen} onOpenChange={setGroupDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Select Muscle Group</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            <Button className="w-full mb-2">Chest</Button>
            <Button className="w-full mb-2">Back</Button>
            <Button className="w-full mb-2">Legs</Button>
            <Button className="w-full mb-2">Shoulders</Button>
            <Button className="w-full mb-2">Arms</Button>
            ...
          </div>
        </DrawerContent>
      </Drawer>

      <Drawer open={categoryDrawerOpen} onOpenChange={setCategoryDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Select Category</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            <Button className="w-full mb-2">Strength</Button>
            <Button className="w-full mb-2">Cardio</Button>
            <Button className="w-full mb-2">Mobility</Button>
            <Button className="w-full mb-2">Endurance</Button>
            ...
          </div>
        </DrawerContent>
      </Drawer>

      <Drawer open={equipmentDrawerOpen} onOpenChange={setEquipmentDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Select Equipment</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            <Button className="w-full mb-2">Barbell</Button>
            <Button className="w-full mb-2">Dumbbell</Button>
            <Button className="w-full mb-2">Machine</Button>
            <Button className="w-full mb-2">Bodyweight</Button>
            ...
          </div>
        </DrawerContent>
      </Drawer>

      <Drawer open={createExerciseOpen} onOpenChange={setCreateExerciseOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Create New Exercise</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            <Input placeholder="Exercise Name" className="mb-4" />

            <Select>
              <SelectTrigger className="w-full mb-2">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="strength">Strength</SelectItem>
                <SelectItem value="cardio">Cardio</SelectItem>
                <SelectItem value="mobility">Mobility</SelectItem>
                <SelectItem value="endurance">Endurance</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-full mb-2">
                <SelectValue placeholder="Select Muscle Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chest">Chest</SelectItem>
                <SelectItem value="back">Back</SelectItem>
                <SelectItem value="legs">Legs</SelectItem>
                <SelectItem value="shoulders">Shoulders</SelectItem>
                <SelectItem value="arms">Arms</SelectItem>
                <SelectItem value="core">Core</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-full mb-2">
                <SelectValue placeholder="Select Equipment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="barbell">Barbell</SelectItem>
                <SelectItem value="dumbbell">Dumbbell</SelectItem>
                <SelectItem value="machine">Machine</SelectItem>
                <SelectItem value="bodyweight">Bodyweight</SelectItem>
              </SelectContent>
            </Select>

            <Textarea placeholder="Instructions" className="mb-4 h-24" />
            <Button onClick={() => setCreateExerciseOpen(false)} className="w-full">Save</Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default ExerciseList
