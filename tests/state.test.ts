import { expect, it } from "vite-plus/test";
import { CommandStateStore } from "../src/command-palette/state.ts";

it("initial state", () => {
  const store = new CommandStateStore();

  expect(store.getState()).toEqual({
    query: "",
    isOpen: false,
  });
});

it("setQuery updates query", () => {
  const store = new CommandStateStore();

  store.setQuery("foo");

  expect(store.getState().query).toBe("foo");
});

it("open sets isOpen to true", () => {
  const store = new CommandStateStore();

  store.open();

  expect(store.getState().isOpen).toBe(true);
});

it("close sets isOpen to false", () => {
  const store = new CommandStateStore();

  store.open();
  store.close();

  expect(store.getState().isOpen).toBe(false);
});

it("toggle switches isOpen", () => {
  const store = new CommandStateStore();

  store.toggle();
  expect(store.getState().isOpen).toBe(true);

  store.toggle();
  expect(store.getState().isOpen).toBe(false);
});

it("subscribe notifies listeners on change", () => {
  const store = new CommandStateStore();
  let callCount = 0;

  store.subscribe(() => {
    callCount += 1;
  });

  store.setQuery("foo");
  store.open();

  expect(callCount).toBe(2);
});

it("subscribe returns an unsubscribe function", () => {
  const store = new CommandStateStore();
  let callCount = 0;

  const unsubscribe = store.subscribe(() => {
    callCount += 1;
  });

  store.setQuery("foo");
  unsubscribe();
  store.setQuery("bar");

  expect(callCount).toBe(1);
});
