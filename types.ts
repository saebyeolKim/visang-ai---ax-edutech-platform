
export enum VideoCategory {
  BRAND = 'Brand Identity',
  USE_CASE = 'AI Service Use Case',
  VISION = 'AX Vision Film'
}

export interface VideoAsset {
  id: string;
  title: string;
  category: VideoCategory;
  url: string; // Blob URL or S3 URL
  posterUrl: string;
  version: number;
  updatedAt: string;
  description?: string;
  views?: number; // Analytics: Total play count
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  tag: string; // Changed to string for dynamic categories
  summary: string;
  content?: string; // New field for detailed view
  linkUrl?: string; // New field for external links (Teams, etc.)
}

export interface ResearchItem {
  id: string;
  title: string;
  status: 'In Progress' | 'Completed';
  model: string;
  description: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  type: 'PDF' | 'ZIP';
  size: string;
}

export enum TabType {
  NEWSROOM = 'newsroom',
  RND = 'rnd',
  RESOURCES = 'resources'
}