import { expect, test } from "vite-plus/test";
import { CommandStateStore } from "../src/state.ts";

test("initial state", () => {
  const store = new CommandStateStore();

  expect(store.getState()).toEqual({
    query: "",
    selectedIndex: 0,
    isOpen: false,
  });
});

test("setQuery updates query and resets selectedIndex", () => {
  const store = new CommandStateStore();

  store.setSelectedIndex(3);
  store.setQuery("foo");

  expect(store.getState().query).toBe("foo");
  expect(store.getState().selectedIndex).toBe(0);
});

test("setSelectedIndex updates selectedIndex", () => {
  const store = new CommandStateStore();

  store.setSelectedIndex(2);

  expect(store.getState().selectedIndex).toBe(2);
});

test("setOpen updates isOpen", () => {
  const store = new CommandStateStore();

  store.setOpen(true);

  expect(store.getState().isOpen).toBe(true);
});

test("reset restores initial state", () => {
  const store = new CommandStateStore();

  store.setQuery("foo");
  store.setSelectedIndex(2);
  store.setOpen(true);
  store.reset();

  expect(store.getState()).toEqual({
    query: "",
    selectedIndex: 0,
    isOpen: false,
  });
});

test("subscribe notifies listeners on change", () => {
  const store = new CommandStateStore();
  let callCount = 0;

  store.subscribe(() => {
    callCount++;
  });

  store.setQuery("foo");
  store.setOpen(true);

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
