import type { WeightUnit } from "../types";

const KG_TO_LBS = 2.20462;

export function kgToLbs(kg: number): number {
  return Math.round(kg * KG_TO_LBS * 10) / 10;
}

export function lbsToKg(lbs: number): number {
  return Math.round((lbs / KG_TO_LBS) * 10) / 10;
}

export function formatWeight(kg: number, unit: WeightUnit): string {
  if (unit === "lbs") {
    return `${kgToLbs(kg)} lbs`;
  }
  return `${kg} kg`;
}

export function displayWeight(kg: number, unit: WeightUnit): number {
  return unit === "lbs" ? kgToLbs(kg) : kg;
}

export function toKg(value: number, unit: WeightUnit): number {
  return unit === "lbs" ? lbsToKg(value) : value;
}
