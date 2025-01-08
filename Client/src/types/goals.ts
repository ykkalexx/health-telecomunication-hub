export type GoalType =
  | "Weight"
  | "HeartRate"
  | "BloodPressureSystolic"
  | "BloodPressureDiastolic";

export interface Goal {
  id: string;
  type: GoalType;
  currentValue: number;
  targetValue: number;
  startDate: string;
  targetDate: string;
  isCompleted: boolean;
  aiGeneratedAdvice: string;
}

export interface CreateGoalRequest {
  type: GoalType;
  currentValue: number;
  targetValue: number;
  targetDate: string;
}
