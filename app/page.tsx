import FussballQuiz from "@/components/quiz";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

export default function Home() {
  return (
    <div className="flex h-screen items-center justify-center">
      <FussballQuiz />
      <Button variant="outline" size="icon">
        <Camera />
      </Button>
    </div>
  );
}
