import { useSyncExternalStore, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { useCommandState } from "./state-context.ts";
import { cn } from "./cn.ts";

export interface CommandInputProps extends Omit<ComponentPropsWithoutRef<"input">, "value"> {}

export function CommandInput({
  onChange,
  type = "text",
  className,
  ...rest
}: CommandInputProps): ReactNode {
  const state = useCommandState();
  const query = useSyncExternalStore(
    (listener) => state.subscribe(listener),
    () => state.getState().query,
  );

  return (
    <input
      {...rest}
      type={type}
      value={query}
      className={cn("cmdora-input", className)}
      onChange={(event) => {
        state.setQuery(event.target.value);
        onChange?.(event);
      }}
    />
  );
}
