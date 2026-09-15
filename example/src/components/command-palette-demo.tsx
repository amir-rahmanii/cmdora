import type { ReactNode } from "react";
import { CommandEmpty, CommandInput, CommandList, CommandPalette, type Command } from "cmdora";
import { SearchIcon } from "./search-icon.tsx";

export interface CommandPaletteDemoProps {
  commands: Command[];
}

export function CommandPaletteDemo({ commands }: CommandPaletteDemoProps): ReactNode {
  return (
    <CommandPalette
      commands={commands}
      className="dark:border-white/10 dark:bg-[#1c1c1f] dark:text-[#f5f5f5]"
      backdropClassName="dark:bg-black/60"
    >
      <div className="flex items-center gap-[0.6rem] border-b border-[rgba(128,128,128,0.2)] px-4 dark:border-white/10">
        <SearchIcon />
        <CommandInput
          className="w-auto min-w-0 flex-1 border-b-0 px-0 dark:placeholder:text-white/40"
          placeholder="Search commands..."
        />
      </div>
      <CommandList itemClassName="dark:hover:bg-white/10 dark:focus-visible:bg-white/10 dark:data-[active=true]:bg-white/10">
        <CommandEmpty className="dark:text-white/45">
          No matching commands. Try a different search.
        </CommandEmpty>
      </CommandList>
    </CommandPalette>
  );
}
