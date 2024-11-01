"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface Player {
  id: number;
  name: string;
  shortName: string;
  position: string;
  jerseyNumber: string;
  height: number;
  preferredFoot: string;
  dateOfBirthTimestamp: number;
  country: {
    name: string;
  };
  team: {
    name: string;
  };
  tournament: string;
}

interface ExtendedQuizProps {
  data: Player[];
}

export default function ExtendedEuropeanFootballQuiz({
  data,
}: ExtendedQuizProps) {
  const [players, setPlayers] = useState<Player[]>(data);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shake, setShake] = useState(false);
  const [usedPlayers, setUsedPlayers] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    if (data.length) {
      setPlayers(data);
      selectRandomPlayer(data);
    }
  }, [data]);

  const selectRandomPlayer = (playerList: Player[]) => {
    if (!playerList.length) return;

    let selectedPlayer;
    let attempts = 0;
    const maxAttempts = playerList.length;

    do {
      const randomIndex = Math.floor(Math.random() * playerList.length);
      selectedPlayer = playerList[randomIndex];
      attempts++;
    } while (usedPlayers.has(selectedPlayer.id) && attempts < maxAttempts);

    setUsedPlayers((prevUsed) => new Set(prevUsed).add(selectedPlayer.id));
    setCurrentPlayer(selectedPlayer);

    const correctAnswer = selectedPlayer.name;
    const wrongAnswers = playerList
      .filter((p) => p.id !== selectedPlayer.id)
      .map((p) => p.name)
      .filter((name, index, self) => self.indexOf(name) === index)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    setOptions(
      [correctAnswer, ...wrongAnswers].sort(() => 0.5 - Math.random()),
    );
  };

  const handleAnswer = (selectedAnswer: string) => {
    if (currentPlayer && selectedAnswer === currentPlayer.name) {
      setScore((prevScore) => prevScore + 1);
      setShowConfetti(true);
      toast({
        title: "Correct!",
        description: "Well done! You've guessed the player correctly.",
        variant: "default",
      });
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      setShake(true);
      toast({
        title: "Wrong!",
        description: `The correct answer was ${currentPlayer?.name}.`,
        variant: "destructive",
      });
      setTimeout(() => setShake(false), 500);
    }
    setTimeout(() => selectRandomPlayer(players), 2000);
  };

  return (
    <>
      {showConfetti && <Confetti />}
      <motion.div
        animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        <Card className="mx-auto w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Extended European Football Quiz</CardTitle>
            <CardDescription>
              Test your knowledge of top players from top European clubs!
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!currentPlayer ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-lg font-semibold">
                  Position: {currentPlayer.position}
                </p>
                <p>Jersey Number: {currentPlayer.jerseyNumber}</p>
                <p>Nationality: {currentPlayer.country.name}</p>
                <p>Club: {currentPlayer.team.name}</p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => handleAnswer(option)}
                      className="w-full"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-lg font-semibold">Score: {score}</p>
            <Button onClick={() => selectRandomPlayer(players)}>
              Next Question
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </>
  );
}
