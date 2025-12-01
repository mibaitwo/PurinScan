export enum PurineLevel {
  LOW = "Low",
  MODERATE = "Moderate",
  HIGH = "High",
  UNKNOWN = "Unknown"
}

export type Language = 'en' | 'zh';

export interface AnalysisResult {
  foodName: string;
  purineLevel: PurineLevel;
  estimatedPurineContent: string; // e.g., "150mg/100g"
  calories: string; // e.g., "200 kcal/100g"
  riskAssessment: string; // Brief explanation
  recommendation: string; // Actionable advice
  alternatives?: string[]; // Safer alternatives if high
}

export interface HistoryItem extends AnalysisResult {
  id: string;
  timestamp: number;
  imageUrl: string;
}
