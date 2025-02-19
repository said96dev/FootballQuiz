import { Settings } from "lucide-react";
import React from "react";
import { IoIosFootball } from "react-icons/io";
import Link from "next/link";
import { Button } from "../ui/button";
import { Separator } from "@/components/ui/separator";
import ModeToggle from "./ThemeToggle";

const Navbar = () => {
  return (
    <div className="flex w-full items-center justify-between px-4 py-3">
      <div className="flex items-center gap-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-extrabold tracking-wider text-primary-foreground"
        >
          <span className="flex items-center">
            F <IoIosFootball size={20} className="text-yellow-400" />
            <IoIosFootball size={20} className="text-yellow-400" /> tball Quiz
          </span>
        </Link>
      </div>
      <div className="item-center flex">
        <div className="flex justify-between gap-2">
          <ModeToggle />
          <Button variant="outline" size="icon" className="sr-only">
            <Link href="/" className="h-min w-min rounded">
              <Settings className="sr-only cursor-pointer" />
            </Link>
          </Button>
        </div>
        <Separator
          orientation="vertical"
          className="ml-2 mr-5 hidden min-h-[2rem] w-[0.1rem] md:inline-block"
        />
      </div>
    </div>
  );
};

export default Navbar;
