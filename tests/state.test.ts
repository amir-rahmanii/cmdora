import { expect, test } from "vite-plus/test";
import { CommandStateStore } from "../src/state.ts";

test("initial state", () => {
  const store = new CommandStateStore();

  expect(store.getState()).toEqual({
    query: "",
    isOpen: false,
  });
});

test("setQuery updates query", () => {
  const store = new CommandStateStore();

  store.setQuery("foo");

  expect(store.getState().query).toBe("foo");
});

test("open sets isOpen to true", () => {
  const store = new CommandStateStore();

  store.open();

  expect(store.getState().isOpen).toBe(true);
});

test("close sets isOpen to false", () => {
  const store = new CommandStateStore();

  store.open();
  store.close();

  expect(store.getState().isOpen).toBe(false);
});

test("toggle switches isOpen", () => {
  const store = new CommandStateStore();

  store.toggle();
  expect(store.getState().isOpen).toBe(true);

  store.toggle();
  expect(store.getState().isOpen).toBe(false);
});

test("subscribe notifies listeners on change", () => {
  const store = new CommandStateStore();
  let callCount = 0;

  store.subscribe(() => {
    callCount++;
  });

  store.setQuery("foo");
  store.open();

  expect(callCount).toBe(2);
});

test("subscribe returns an unsubscribe function", () => {
  const store = new CommandStateStore();
  let callCount = 0;

  const unsubscribe = store.subscribe(() => {
    callCount++;
  });

  store.setQuery("foo");
  unsubscribe();
  store.setQuery("bar");

  expect(callCount).toBe(1);
});
