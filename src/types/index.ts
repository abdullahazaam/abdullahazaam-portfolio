export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  architecturalHighlights: string[];
  tags: string[];
  liveUrl?: string;
  githubUrl: string;
  featured: boolean;
  accentColor: string;
  badge: string;
  previewGraphic: 'nexus' | 'commerce' | 'career' | 'greetings' | 'logistics';
}

export type SkillCategory = 'all' | 'backend' | 'frontend' | 'data-tools';

export interface Skill {
  name: string;
  category: 'backend' | 'frontend' | 'data-tools';
  categoryLabel: string;
  proficiency: string;
  description: string;
  tag: string;
}

export interface JourneyStage {
  id: string;
  phase: string;
  stageNumber: string;
  title: string;
  subtitle: string;
  description: string;
  coreTechnologies: string[];
  architectureFocus: string;
  status: 'Mastered' | 'Active Production' | 'Advanced Innovation';
}
