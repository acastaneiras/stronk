import React from 'react';

export default function CreateNewWorkoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-grow w-full max-w-full lg:max-w-screen-lg mx-auto p-4">
        {children}
      </div>
    </main>
  );
}