# cmdora

A simple and customizable React command palette powered by `Ctrl + K` / `Cmd + K`.

**[Live Example](https://amir-rahmanii.github.io/cmdora/)**

## Install

```bash
npm install cmdora
```

```bash
pnpm add cmdora
```

## Usage

```tsx
import { CmdoraProvider, CommandPalette, CommandInput, CommandList } from "cmdora";

import "cmdora/style.css";

const commands = [
  {
    id: "dashboard",
    name: "Go to Dashboard",
    execute: () => navigate("/"),
  },
  {
    id: "settings",
    name: "Open Settings",
    execute: () => navigate("/settings"),
  },
];

function App() {
  return (
    <CmdoraProvider>
      <CommandPalette commands={commands} backdropClassName="my-backdrop">
        <CommandInput placeholder="Search commands..." />
        <CommandList />
      </CommandPalette>
    </CmdoraProvider>
  );
}
```

Press `Ctrl + K` on Windows/Linux or `Cmd + K` on macOS to open the palette.

`CommandList` shows a default "No commands found" message when there are no matches. Pass `CommandEmpty` as a child to customize it:

```tsx
<CommandList>
  <CommandEmpty>No matching commands. Try a different search.</CommandEmpty>
</CommandList>
```

## Customization

Cmdora includes default styles out of the box and is fully customizable. Override the default styles or use Tailwind CSS, CSS Modules, plain CSS, or any other styling solution you prefer.

`CommandPalette` supports `className` and `backdropClassName` for customizing the dialog and backdrop. `CommandList` supports `itemClassName` for overriding command item styles.

All components support their relevant native HTML props and customization options.

## API

- `CmdoraProvider`
- `useCommandPalette`
- `CommandPalette`
- `CommandInput`
- `CommandList`
- `CommandEmpty`

## License

MIT
