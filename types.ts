export interface TrackAnalysis {
  animalName: string;
  scientificName: string;
  confidence: 'High' | 'Medium' | 'Low';
  characteristics: string[];
  habitat: string;
  habitatRegion: string;
  behaviorNote: string;
  safetyTip: string;
}

export interface AnalysisState {
  isLoading: boolean;
  result: TrackAnalysis | null;
  error: string | null;
  imagePreview: string | null;
}