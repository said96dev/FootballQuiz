"use client";

import GuessPlayerQuiz from "@/components/GuessPlayer";
import { useGetTeamData } from "@/api/query";

export default function GuessThePlayerPage() {
  const { data, isLoading, error } = useGetTeamData();

  if (error) {
    return <div>Error loading data.</div>;
  }

  return (
    <div className="flex w-full flex-col items-center justify-center gap-12 px-4">
      <div className="w-full text-center text-3xl font-bold tracking-wide">
        <span className="text-primary-500 font-extrabold">
          Test Your Football Knowledge!
        </span>
        <p className="mt-4 text-lg font-light">
          Can you guess the player from Europe&#39;s top clubs? Challenge
          yourself and see how many stars you can identify.
        </p>
      </div>
      {!isLoading && data && <GuessPlayerQuiz data={data} />}
    </div>
  );
}
