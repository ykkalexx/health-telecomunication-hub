export enum GoalType {
  Weight = 0,
  HeartRate = 1,
  BloodPressureSystolic = 2,
  BloodPressureDiastolic = 3,
}

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
