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

// Ersetzen Sie 'YOUR_API_KEY' durch Ihren tatsächlichen API-Schlüssel
const API_KEY = "2710688779c7d26454b430483ba0c60a";

interface Player {
  player: {
    id: number;
    name: string;
    number: number | null;
  };
  statistics: Array<{
    team: {
      name: string;
    };
  }>;
}

export default function FussballQuiz() {
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewQuestion();
  }, []);

  const fetchNewQuestion = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://v3.football.api-sports.io/players/topscorers?season=2022&league=39",
        {
          method: "GET",
          headers: {
            "x-apisports-key": API_KEY,
          },
        },
      );
      const data = await response.json();
      const players = data.response;

      // Wähle zufällig einen Spieler aus
      const randomIndex = Math.floor(Math.random() * players.length);
      const selectedPlayer = players[randomIndex];
      setCurrentPlayer(selectedPlayer);

      // Erstelle Antwortoptionen
      const correctAnswer = selectedPlayer.player.name;
      const wrongAnswers = players
        .filter((p: Player) => p.player.id !== selectedPlayer.player.id)
        .map((p: Player) => p.player.name)
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);

      setOptions(
        [correctAnswer, ...wrongAnswers].sort(() => 0.5 - Math.random()),
      );
      setLoading(false);
    } catch (error) {
      console.error("Fehler beim Abrufen der Spielerdaten:", error);
      setLoading(false);
    }
  };

  const handleAnswer = (selectedAnswer: string) => {
    if (currentPlayer && selectedAnswer === currentPlayer.player.name) {
      setScore(score + 1);
    }
    fetchNewQuestion();
  };

  if (loading) {
    return <div>Laden...</div>;
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Fußball-Quiz</CardTitle>
        <CardDescription>
          Errate den Spieler anhand seiner Nummer und seines Vereins
        </CardDescription>
      </CardHeader>
      <CardContent>
        {currentPlayer && (
          <div className="space-y-4">
            <p>Spielernummer: {currentPlayer.player.number || "Unbekannt"}</p>
            <p>Verein: {currentPlayer.statistics[0].team.name}</p>
            <div className="space-y-2">
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
      <CardFooter>
        <p>Punktzahl: {score}</p>
      </CardFooter>
    </Card>
  );
}
