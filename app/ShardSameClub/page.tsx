"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactConfetti from "react-confetti";
import { players } from "../../db/players";
import { Button } from "@/components/ui/button";

type Player = {
  name: string;
  career: { club: string; years: string }[];
};

export default function FootballQuiz() {
  const [mainPlayer, setMainPlayer] = useState<Player | null>(null);
  const [otherPlayers, setOtherPlayers] = useState<Player[]>([]);
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    selectPlayers();
  }, []);

  const selectPlayers = () => {
    let main: Player;
    let others: Player[];
    let hasSharedClub: boolean;

    do {
      const shuffled = [...players].sort(() => 0.5 - Math.random());
      main = shuffled[0];
      others = shuffled.slice(1, 4);

      const mainClubs = new Set(main.career.map((c) => c.club));
      const sharedClubPlayers = others.filter((player) =>
        player.career.some((c) => mainClubs.has(c.club)),
      );

      hasSharedClub = sharedClubPlayers.length === 1;

      if (!hasSharedClub) {
        if (sharedClubPlayers.length > 1) {
          // If more than one player shares a club, replace the extras
          const keepIndex = Math.floor(
            Math.random() * sharedClubPlayers.length,
          );
          for (let i = 0; i < others.length; i++) {
            if (
              sharedClubPlayers.includes(others[i]) &&
              sharedClubPlayers.indexOf(others[i]) !== keepIndex
            ) {
              let newPlayer;
              do {
                newPlayer =
                  shuffled[Math.floor(Math.random() * shuffled.length)];
              } while (
                newPlayer === main ||
                others.includes(newPlayer) ||
                newPlayer.career.some((c) => mainClubs.has(c.club))
              );
              others[i] = newPlayer;
            }
          }
        } else {
          // If no player shares a club, replace one random player
          const replaceIndex = Math.floor(Math.random() * others.length);
          let sharedClubPlayer;
          do {
            sharedClubPlayer =
              shuffled[Math.floor(Math.random() * shuffled.length)];
          } while (
            sharedClubPlayer === main ||
            others.includes(sharedClubPlayer) ||
            !sharedClubPlayer.career.some((c) => mainClubs.has(c.club))
          );
          others[replaceIndex] = sharedClubPlayer;
        }
      }
    } while (!hasSharedClub);

    setMainPlayer(main);
    setOtherPlayers(others);
    setIsCorrect(null);
  };

  const handleGuess = (player: Player) => {
    const mainClubs = new Set(mainPlayer?.career.map((c) => c.club));
    const hasSharedClub = player.career.some((c) => mainClubs.has(c.club));

    setIsCorrect(hasSharedClub);

    if (hasSharedClub) {
      setScore((prevScore) => prevScore + 1);
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        selectPlayers();
      }, 3000);
    }
  };

  if (!mainPlayer) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Football Quiz</h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      ></motion.div>
      <p className="mb-4 font-semibold">
        Select the player who has played for the same club as{" "}
        <span className="font-extrabold text-primary">{mainPlayer.name}:</span>
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <AnimatePresence>
          {otherPlayers.map((player, index) => (
            <Button
              onClick={() => handleGuess(player)}
              className={`rounded px-4 py-2 font-bold ${
                isCorrect === false ? "animate-shake" : ""
              }`}
            >
              <motion.div
                key={player.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                {player.name}
              </motion.div>
            </Button>
          ))}
        </AnimatePresence>
      </div>
      <motion.div
        className="mt-4 text-xl"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        Score: {score}
      </motion.div>
      {isCorrect !== null && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`mt-4 text-xl ${isCorrect ? "text-green-500" : "text-red-500"}`}
        >
          {isCorrect ? "Correct!" : "Incorrect. Try again!"}
        </motion.div>
      )}
      {showConfetti && <ReactConfetti />}
    </div>
  );
}
