"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { CommandList } from "cmdk";
import { ScrollArea } from "@radix-ui/react-scroll-area";

interface Player {
  id: number;
  name: string;
  shortName: string;
  position: string;
  jerseyNumber: string;
  height: number;
  country: {
    name: string;
  };
  team: {
    name: string;
  };
  tournament: string;
  dateOfBirthTimestamp: number;
}

interface GuessResult {
  player: Player;
  matches: {
    nationality: boolean;
    team: boolean;
    league: boolean;
    age: boolean;
    number: boolean;
    position: boolean;
    tournament: boolean;
  };
  comparisons: {
    age: "older" | "younger" | "same";
    number: "higher" | "lower" | "same";
  };
}

interface PlayerGuessingGameProps {
  players: Player[];
}

const WhoAreAy = ({ players = [] }: PlayerGuessingGameProps) => {
  const [targetPlayer, setTargetPlayer] = useState<Player | null>(null);
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [remainingGuesses, setRemainingGuesses] = useState(8);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (players.length > 0) {
      const randomIndex = Math.floor(Math.random() * players.length);
      setTargetPlayer(players[randomIndex]);
    }
  }, [players]);

  const calculateAge = (timestamp: number) => {
    const birthDate = new Date(timestamp * 1000);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleGuess = (selectedPlayer: Player) => {
    if (!targetPlayer || gameOver) return;

    const selectedAge = calculateAge(selectedPlayer.dateOfBirthTimestamp);
    const targetAge = calculateAge(targetPlayer.dateOfBirthTimestamp);
    const selectedNumber = parseInt(selectedPlayer.jerseyNumber);
    const targetNumber = parseInt(targetPlayer.jerseyNumber);

    const result: GuessResult = {
      player: selectedPlayer,
      matches: {
        nationality:
          selectedPlayer.country?.name === targetPlayer.country?.name,
        team: selectedPlayer.team.name === targetPlayer.team.name,
        league: selectedPlayer.tournament === targetPlayer.tournament,
        age: selectedAge === targetAge,
        number: selectedPlayer.jerseyNumber === targetPlayer.jerseyNumber,
        position: selectedPlayer.position === targetPlayer.position,
        tournament: selectedPlayer.tournament === targetPlayer.tournament,
      },
      comparisons: {
        age:
          selectedAge > targetAge
            ? "older"
            : selectedAge < targetAge
              ? "younger"
              : "same",
        number:
          selectedNumber > targetNumber
            ? "higher"
            : selectedNumber < targetNumber
              ? "lower"
              : "same",
      },
    };

    setGuesses((prev) => [result, ...prev]);
    setRemainingGuesses((prev) => prev - 1);
    setValue("");
    setOpen(false);

    if (selectedPlayer.id === targetPlayer.id) {
      setGameOver(true);
    } else if (remainingGuesses <= 1) {
      setGameOver(true);
    }
  };

  const handleSearch = (searchValue: string) => {
    setValue(searchValue);

    if (searchValue) {
      const searchTerms = searchValue
        .toLowerCase()
        .split(" ")
        .filter((term) => term); // Remove any empty terms

      players.filter((player) =>
        searchTerms.every((term) => {
          const nameMatch = player.name.toLowerCase().includes(term);
          const shortNameMatch = player.shortName.toLowerCase().includes(term);
          return nameMatch || shortNameMatch;
        }),
      );
    } else {
    }
  };

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-center">
          Guess the Player - {remainingGuesses} guesses remaining
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
              disabled={gameOver}
            >
              {value || "Select player..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="PopoverContent w-full p-0">
            <Command className="w-full">
              <CommandInput
                placeholder="Search player..."
                value={value}
                onValueChange={handleSearch}
              />
              <CommandEmpty>No player found</CommandEmpty>
              <CommandGroup>
                <ScrollArea className="h-24">
                  <CommandList>
                    {players.map((player) => {
                      return (
                        <CommandItem
                          key={player.id}
                          onSelect={() => {
                            setValue(player.name);
                            setOpen(false);
                            handleGuess(player);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === player.name
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {player.name}
                        </CommandItem>
                      );
                    })}
                  </CommandList>
                </ScrollArea>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        <div className="space-y-2">
          {guesses.map((guess, index) => (
            <div
              key={index}
              className="grid grid-cols-1 items-center gap-2 rounded-lg border p-2 md:grid-cols-7"
            >
              <div className="text-sm font-medium">
                {guess?.player?.name ?? "Unknown"}
              </div>
              <div
                className={cn(
                  "flex h-full items-center justify-center rounded-full px-2 text-center text-sm",
                  guess.matches.nationality
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white",
                )}
              >
                {guess?.player?.country?.name ?? "Unknown"}
              </div>
              <div
                className={cn(
                  "flex h-full items-center justify-center rounded-full px-2 text-center text-sm",
                  guess.matches.team
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white",
                )}
              >
                {guess?.player?.team?.name ?? "Unknown"}
              </div>
              <div
                className={cn(
                  "flex h-full items-center justify-center rounded-full px-2 text-center text-sm",
                  guess.matches.tournament
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white",
                )}
              >
                {guess?.player?.tournament ?? "Unknown"}
              </div>
              <div
                className={cn(
                  "flex h-full items-center justify-center rounded-full px-2 text-center text-sm",
                  guess.matches.position
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white",
                )}
              >
                {guess?.player?.position ?? "Unknown"}
              </div>

              <div
                className={cn(
                  "flex h-full items-center justify-center rounded-full px-2 text-center text-sm",
                  guess.matches.number
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white",
                )}
              >
                <div className="flex items-center">
                  <span>#{guess?.player?.jerseyNumber ?? "?"}</span>
                  {!guess.matches.number && (
                    <div className="ml-1">
                      {guess.comparisons.number === "higher" ? (
                        <ArrowDown className="h-4 w-4" />
                      ) : (
                        <ArrowUp className="h-4 w-4" />
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div
                className={cn(
                  "flex h-full items-center justify-center rounded-full px-2 text-center text-sm",
                  guess.matches.age
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white",
                )}
              >
                {calculateAge(guess.player.dateOfBirthTimestamp)}
                {!guess.matches.age && (
                  <div className="ml-1">
                    {guess.comparisons.age === "older" ? (
                      <ArrowDown className="h-4 w-4" />
                    ) : (
                      <ArrowUp className="h-4 w-4" />
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {gameOver && (
          <div className="rounded-lgp-4 text-center">
            <p className="font-bold">Game Over!</p>
            <p>The player was: {targetPlayer?.name}</p>
            <Button
              className="mt-2"
              onClick={() => {
                const randomIndex = Math.floor(Math.random() * players.length);
                setTargetPlayer(players[randomIndex]);
                setGuesses([]);
                setRemainingGuesses(8);
                setGameOver(false);
                setValue("");
              }}
            >
              Play Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WhoAreAy;
