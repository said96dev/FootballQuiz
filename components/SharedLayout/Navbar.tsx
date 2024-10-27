import { Search, Settings } from "lucide-react";
import React from "react";
import { Input } from "../ui/input";
import Link from "next/link";
import { Button } from "../ui/button";
import { Separator } from "@/components/ui/separator";
import ModeToggle from "./ThemeToggle";

const Navbar = () => {
  return (
    <div className="flex w-full items-center justify-between px-4 py-3">
      <div className="flex items-center gap-8">
        <div className="relative hidden h-10 w-full">
          <Search className="h absolute left-3 top-1/2 z-10 h-[16px] w-[16px] -translate-y-1/2 transform" />
          <Input
            className="text-md w-full rounded border border-gray-300 py-2 pl-10 pr-3 shadow-sm"
            placeholder="Search..."
            type="search"
          />
        </div>
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
