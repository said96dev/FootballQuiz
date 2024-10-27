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

const API_KEY = "2710688779c7d26454b430483ba0c60a";

const TEAM_IDS = {
  "Manchester City": 50,
  "Manchester United": 33,
  Arsenal: 42,
  Chelsea: 49,
  Tottenham: 47,
  Barcelona: 529,
  "Real Madrid": 541,
  "Inter Milan": 505,
  PSG: 85,
  "Bayern Munich": 157,
};

interface Player {
  id: number;
  name: string;
  firstname: string;
  lastname: string;
  age: number;
  birth: {
    date: string;
    place: string;
    country: string;
  };
  nationality: string;
  height: string;
  weight: string;
  photo: string;
  position: string;
  team: {
    name: string;
    logo: string;
  };
  statistics: {
    games: {
      appearences: number;
      minutes: number;
    };
    goals: {
      total: number;
      assists: number;
    };
  };
}

export default function ExtendedEuropeanFootballQuiz() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [unusedPlayers, setUnusedPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shake, setShake] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const allPlayers: Player[] = [];
      for (const [teamName, teamId] of Object.entries(TEAM_IDS)) {
        const response = await fetch(
          `https://v3.football.api-sports.io/players?team=${teamId}&season=2022`,
          {
            method: "GET",
            headers: {
              "x-apisports-key": API_KEY,
            },
          },
        );
        const data = await response.json();
        const teamPlayers = data.response
          .filter(
            (playerData: any) => playerData.statistics[0].games.minutes >= 10,
          )
          .map((playerData: any) => ({
            id: playerData.player.id,
            name: playerData.player.name,
            firstname: playerData.player.firstname,
            lastname: playerData.player.lastname,
            age: playerData.player.age,
            birth: playerData.player.birth,
            nationality: playerData.player.nationality,
            height: playerData.player.height,
            weight: playerData.player.weight,
            photo: playerData.player.photo,
            position: playerData.statistics[0].games.position,
            team: {
              name: teamName,
              logo: playerData.statistics[0].team.logo,
            },
            statistics: {
              games: {
                appearences: playerData.statistics[0].games.appearences,
                minutes: playerData.statistics[0].games.minutes,
              },
              goals: {
                total: playerData.statistics[0].goals.total,
                assists: playerData.statistics[0].goals.assists,
              },
            },
          }));
        allPlayers.push(...teamPlayers);
      }
      setPlayers(allPlayers);
      setUnusedPlayers(allPlayers);
      setLoading(false);
      selectRandomPlayer(allPlayers);
    } catch (error) {
      console.error("Error fetching player data:", error);
      setLoading(false);
    }
  };

  const selectRandomPlayer = (playerList: Player[]) => {
    if (unusedPlayers.length === 0) {
      // All players have been used, reset the unused players
      setUnusedPlayers([...players]);
    }

    const randomIndex = Math.floor(Math.random() * unusedPlayers.length);
    const selectedPlayer = unusedPlayers[randomIndex];
    setCurrentPlayer(selectedPlayer);

    // Remove the selected player from unusedPlayers
    setUnusedPlayers(unusedPlayers.filter((p) => p.id !== selectedPlayer.id));

    const correctAnswer = selectedPlayer.name;
    const wrongAnswers = players
      .filter((p) => p.id !== selectedPlayer.id)
      .map((p) => p.name)
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
            <CardDescription className="text-xl">
              Test your knowledge of top players from the 2022 season! This quiz
              features players from Manchester City, Manchester United, Arsenal,
              Chelsea, Tottenham, Barcelona, Real Madrid, Inter Milan, PSG, and
              Bayern Munich who played at least 10 minutes in the season.
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
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={currentPlayer.photo}
                      alt={currentPlayer.name}
                    />
                    <AvatarFallback>
                      {currentPlayer.firstname[0]}
                      {currentPlayer.lastname[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg font-semibold">
                      Position: {currentPlayer.position}
                    </p>
                    <p>Age: {currentPlayer.age} years</p>
                    <p>Height: {currentPlayer.height}</p>
                    <p>Weight: {currentPlayer.weight}</p>
                  </div>
                </div>
                <div>
                  <p>Nationality: {currentPlayer.nationality}</p>
                  <p>
                    Birthplace: {currentPlayer.birth.place},{" "}
                    {currentPlayer.birth.country}
                  </p>
                  <p>Club: {currentPlayer.team.name}</p>
                </div>
                <div>
                  <p>
                    Appearances: {currentPlayer.statistics.games.appearences}
                  </p>
                  <p>
                    Minutes played: {currentPlayer.statistics.games.minutes}
                  </p>
                  <p>Goals: {currentPlayer.statistics.goals.total}</p>
                  <p>Assists: {currentPlayer.statistics.goals.assists}</p>
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
