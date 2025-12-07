export interface AIAnalysis {
  technicalDescription: string;
  brainstormingQuestions: string[];
}

export interface SlideItem {
  id: string;
  imageUrl: string;
  userCaption: string;
  aiAnalysis?: AIAnalysis;
  isAnalyzing: boolean;
  isCropping: boolean;
}

export interface ProjectState {
  title: string;
  description: string;
  slides: SlideItem[];
}