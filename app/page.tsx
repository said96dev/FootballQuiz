"use client";
import { useGetTeamData } from "@/api/query";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function GuessThePlayerPage() {
  const { data, error } = useGetTeamData();
  console.log("🚀 ~ GuessThePlayerPage ~ data:", data);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-medium text-red-600">
          Oops! Something went wrong while loading the data. Please try again
          later.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-2xl px-4 py-8 text-center">
        <h1 className="text-primary-500 text-4xl font-extrabold">
          Test Your Football Knowledge!
        </h1>
        <p className="mt-4 text-xl font-light">
          Think you know the top players across Europe? Challenge yourself to
          identify the stars from some of the continent&#39;s biggest clubs. Let
          the games begin!
        </p>
        <div className="gab-5 mt-10 flex flex-col space-y-4">
          <Link href="/GuessPlayer" className="text-lg font-semibold">
            <Button variant="default" className="w-full text-lg">
              Guess the Player
            </Button>
          </Link>
          <Link href="/WhoAreYa" className="text-xl font-semibold">
            <Button variant="default" className="w-full text-lg">
              Who Are Ya?
            </Button>
          </Link>
          <Link href="/ShardSameClub" className="text-xl font-semibold">
            <Button variant="default" className="w-full text-lg">
              Shared the Same Club{" "}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
