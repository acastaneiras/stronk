export enum WeightUnit {
    KG = 'kg',
    LB = 'lb',
}

export enum SetType {
    WarmUpSet = 'Warm Up Set',
    NormalSet = 'Normal Set',
    FailureSet = 'Failure Set',
    DropSet = 'Drop Set',
    RestPauseSet = 'Rest Pause Set',
}

export type SetWeight = {
    value: number | string; //it can be string if its empty, otherwise it's an int
    unit: WeightUnit;
}

export type ExerciseSet = {
    id: number,
    previous?: ExerciseSet;
    weight: SetWeight;
    reps: number | string; //it can be string if its empty, otherwise it's an int
    completed: boolean;
    intensity?: number; //ToDo: conversion form RPE to RIR and vice versa
    type: SetType;
    number?: number;
}

export interface SelectedSet {
    exerciseIndex: string | number[],
    setIndex: number,
}