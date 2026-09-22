/**
 * Typed hooks for Redux — use these everywhere instead of plain
 * useDispatch / useSelector so TypeScript knows the exact store shape.
 */
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./index";

/** Pre-typed dispatch — knows about all action types. */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

/** Pre-typed selector — receives the full RootState. */
export const useAppSelector = useSelector.withTypes<RootState>();
