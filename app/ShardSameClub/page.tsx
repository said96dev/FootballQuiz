import SameClub from "@/components/SameClub";

export default function GuessThePlayerPage() {
  return (
    <div className="my-auto flex w-full flex-col items-center justify-center gap-12 px-4">
      <div className="w-full text-center text-3xl font-bold tracking-wide">
        <span className="text-primary-500 font-extrabold">
          Test Your Football Knowledge!
        </span>
        <p className="mt-4 text-lg font-light">
          Can you match the players who have played for the same club? Choose
          the right option and prove you&#39;re a true football expert!
        </p>
      </div>
      <div className="max-w-6xl">{<SameClub />}</div>
    </div>
  );
}
