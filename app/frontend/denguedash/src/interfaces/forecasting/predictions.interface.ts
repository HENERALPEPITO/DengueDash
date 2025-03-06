interface ConfidenceInterval {
  lower: number;
  upper: number;
}

interface PredictionData {
  confidence_interval: ConfidenceInterval;
  date: string;
  predicited_cases: number;
  week: number;
}

export type ModelPredictions = PredictionData[];

interface PredictionMetadata {
  model_window_size: number;
  prediction_generated_at: string;
}

export interface ModelPredictionResponse {
  predictions: ModelPredictions;
  metadata: PredictionMetadata;
}
