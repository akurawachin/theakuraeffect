/**
 * Gallery item inside a project's detailed case study view.
 */
export interface ProjectGalleryItem {
  /** 'image' for stills/renders or 'video' for playable clips */
  type: 'video' | 'image';
  /** Direct URL or imported asset path */
  url: string;
  /** Optional caption displayed underneath */
  caption?: string;
  /** Optional custom aspect ratio override, e.g. '16/9' or '4/3' */
  aspect?: string;
}

/**
 * Portfolio project definition.
 * Edit, add, or reorder these in `src/data/portfolio.ts`.
 */
export interface ProjectItem {
  /** Unique slug identifier, e.g. 'my-project-name' */
  id: string;
  /** Display number index, e.g. '01', '02', '03' */
  number: string;
  /** Project or case study title */
  title: string;
  /** Client or organization name */
  client: string;
  /** Optional event or keynote context, e.g. 'AWE 2024' */
  event?: string;
  /** Optional venue context, e.g. 'Main Stage' */
  venue?: string;
  /** Primary service category (used by the Services dropdown filter) */
  service: string;
  /** Release or completion year, e.g. '2026' */
  year: string;
  /**
   * Main thumbnail image URL or imported asset path.
   * Renders in 4:3 landscape across Grid, Archive, and List views.
   */
  posterUrl: string;
  /**
   * Optional short video clip URL (MP4 / WebM).
   * Autoplays on hover in Grid/List and loops in Archive view.
   */
  previewVideoUrl?: string;
  /** Case study paragraph or synopsis */
  description?: string;
  /** List of deliverables/disciplines (e.g. ['2D Motion', 'Art Direction']) */
  services?: string[];
  /** Software/tools used (e.g. ['After Effects', 'Photoshop', 'Toon Boom']) */
  tools?: string[];
  /** Detailed images and videos shown in the case study detail page */
  gallery?: ProjectGalleryItem[];
  /** Optional pill label badge (e.g. 'First IP', 'Keynote', 'Featured') */
  badge?: string;
  /** Featured flag (true to prioritize) */
  featured?: boolean;
}

export type ViewMode = 'archive' | 'grid' | 'list';

export interface ClientLogo {
  name: string;
  sector?: string;
}
