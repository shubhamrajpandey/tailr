import { describe, it, expect, beforeEach } from "vitest";
import { toast, toastStore } from "./toast";

describe("toast notification system", () => {
  beforeEach(() => {
    // Dismiss all active toasts before each test
    const current = toastStore.getToasts();
    current.forEach((t) => toastStore.dismiss(t.id));
  });

  it("adds success toast with correct variant and properties", () => {
    const id = toast.success("Operation Successful", "Data was saved");
    const active = toastStore.getToasts();

    expect(active.length).toBe(1);
    expect(active[0].id).toBe(id);
    expect(active[0].title).toBe("Operation Successful");
    expect(active[0].description).toBe("Data was saved");
    expect(active[0].type).toBe("success");
  });

  it("adds error toast with error variant", () => {
    const id = toast.error("Error occurred", "Network failed");
    const active = toastStore.getToasts();

    expect(active.length).toBe(1);
    expect(active[0].id).toBe(id);
    expect(active[0].title).toBe("Error occurred");
    expect(active[0].type).toBe("error");
  });

  it("dismisses an active toast by id", () => {
    const id = toast.info("Heads up");
    expect(toastStore.getToasts().length).toBe(1);

    toast.dismiss(id);
    expect(toastStore.getToasts().length).toBe(0);
  });

  it("notifies subscribers when toasts are added or dismissed", () => {
    let callCount = 0;
    const unsubscribe = toastStore.subscribe(() => {
      callCount++;
    });
    expect(callCount).toBe(1); // initial state delivery

    const id = toast.warning("Warning message");
    expect(callCount).toBe(2);

    toast.dismiss(id);
    expect(callCount).toBe(3);

    unsubscribe();
    toast.success("Silent toast");
    expect(callCount).toBe(3); // no further calls after unsubscribe
  });
});
