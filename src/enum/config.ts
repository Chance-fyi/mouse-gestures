import type { GestureMatchConfigCustomOptions } from "~config/config-interface"

export enum GestureStrictness {
  Strict = "strict",
  Normal = "normal",
  Loose = "loose",
  Custom = "custom"
}

export const StrictOptions: GestureMatchConfigCustomOptions = {
  angleThreshold: 30,
  lengthTolerance: 0.3,
  minSimilarity: 0.8
}

export const NormalOptions: GestureMatchConfigCustomOptions = {
  angleThreshold: 60,
  lengthTolerance: 0.5,
  minSimilarity: 0.7
}

export const LooseOptions: GestureMatchConfigCustomOptions = {
  angleThreshold: 90,
  lengthTolerance: 0.6,
  minSimilarity: 0.6
}
