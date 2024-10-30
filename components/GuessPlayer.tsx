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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const API_KEY = "3bd124bdc6msh2c0a3685a39e8f2p16f5d7jsnf166efa981b4"; // Replace with your actual RapidAPI key

const TEAM_IDS = {
  "Manchester City": 17,
  "Manchester United": 35,
  Arsenal: 42,
  Chelsea: 38,
  Tottenham: 33,
  Barcelona: 2817,
  "Real Madrid": 2829,
  "Inter Milan": 2697,
  PSG: 1644,
  "Bayern Munich": 2672,
};

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
}

export default function ExtendedEuropeanFootballQuiz() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shake, setShake] = useState(false);
  const [usedPlayers, setUsedPlayers] = useState<Set<number>>(new Set()); // Set to track used players
  const { toast } = useToast();

  useEffect(() => {
    fetchPlayers();
  }, []);
  const POSITION_MAP: { [key: string]: string } = {
    F: "Forward",
    M: "Midfielder",
    D: "Defender",
    G: "Goalkeeper",
    // Füge hier weitere Abkürzungen hinzu, falls vorhanden
  };

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const allPlayers: Player[] = [];
      for (const [teamName, teamId] of Object.entries(TEAM_IDS)) {
        const response = await fetch(
          `https://sofascore.p.rapidapi.com/teams/get-squad?teamId=${teamId}`,
          {
            method: "GET",
            headers: {
              "X-RapidAPI-Key": API_KEY,
              "X-RapidAPI-Host": "sofascore.p.rapidapi.com",
            },
          },
        );
        const data = await response.json();
        const teamPlayers = data.players
          .filter((playerData: any) => playerData.player.position !== "G")
          .map((playerData: any) => {
            const position = playerData.player.position || "Unknown";
            const fullPosition = POSITION_MAP[position] || position; // Mapping zur vollständigen Position
            return {
              id: playerData.player.id || 0,
              name: playerData.player.name || "Unknown",
              shortName: playerData.player.shortName || "Unknown",
              position: fullPosition, // Setze die vollständige Position
              jerseyNumber: playerData.player.jerseyNumber || "N/A",
              height: playerData.player.height || 0,
              preferredFoot: playerData.player.preferredFoot || "Unknown",
              dateOfBirthTimestamp: playerData.player.dateOfBirthTimestamp || 0,
              country: {
                name: playerData.player.country?.name || "Unknown",
              },
              team: {
                name: teamName,
              },
            };
          });
        allPlayers.push(...teamPlayers);
      }
      setPlayers(allPlayers);
      setLoading(false);
      selectRandomPlayer(allPlayers);
    } catch (error) {
      console.error("Error fetching player data:", error);
      setLoading(false);
    }
  };

  const selectRandomPlayer = (playerList: Player[]) => {
    let selectedPlayer;
    let attempts = 0;
    const maxAttempts = playerList.length;

    // Ensure the selected player has not been used already
    do {
      const randomIndex = Math.floor(Math.random() * playerList.length);
      selectedPlayer = playerList[randomIndex];
      attempts++;
    } while (usedPlayers.has(selectedPlayer.id) && attempts < maxAttempts);

    // Add player to used set and set as current player
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
      setScore(score + 1);
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
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            ) : currentPlayer ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="text-lg font-semibold">
                      Position: {currentPlayer.position}
                    </p>
                    <p>Jersey Number: {currentPlayer.jerseyNumber}</p>
                  </div>
                </div>
                <div>
                  <p>Nationality: {currentPlayer.country.name}</p>

                  <p>Club: {currentPlayer.team.name}</p>
                </div>
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
            ) : null}
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
