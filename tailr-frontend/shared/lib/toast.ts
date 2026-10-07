export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  createdAt: number;
}

type ToastListener = (toasts: ToastItem[]) => void;

class ToastStore {
  private toasts: ToastItem[] = [];
  private listeners: Set<ToastListener> = new Set();
  private maxToasts = 5;

  public subscribe(listener: ToastListener): () => void {
    this.listeners.add(listener);
    listener([...this.toasts]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const copy = [...this.toasts];
    this.listeners.forEach((listener) => listener(copy));
  }

  public add(type: ToastType, title: string, description?: string, duration: number = 4500): string {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastItem = {
      id,
      type,
      title,
      description,
      duration,
      createdAt: Date.now(),
    };

    // Keep up to maxToasts, newest first
    this.toasts = [newToast, ...this.toasts.slice(0, this.maxToasts - 1)];
    this.notify();

    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }

    return id;
  }

  public dismiss(id: string): void {
    const initialLen = this.toasts.length;
    this.toasts = this.toasts.filter((t) => t.id !== id);
    if (this.toasts.length !== initialLen) {
      this.notify();
    }
  }

  public clear(): void {
    this.toasts = [];
    this.notify();
  }

  public getToasts(): ToastItem[] {
    return [...this.toasts];
  }
}

export const toastStore = new ToastStore();

export const toast = {
  success: (title: string, description?: string, duration?: number) =>
    toastStore.add("success", title, description, duration),
  error: (title: string, description?: string, duration?: number) =>
    toastStore.add("error", title, description, duration ?? 6000),
  warning: (title: string, description?: string, duration?: number) =>
    toastStore.add("warning", title, description, duration),
  info: (title: string, description?: string, duration?: number) =>
    toastStore.add("info", title, description, duration),
  dismiss: (id: string) => toastStore.dismiss(id),
  clear: () => toastStore.clear(),
};
