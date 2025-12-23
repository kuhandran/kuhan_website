/**
 * JSON-Driven Layout Configuration Types
 * Allows rendering any section and component based on JSON configuration
 */

// ============================================
// ELEMENT/COMPONENT TYPES
// ============================================

export type ComponentType = 
  | 'ProjectCard'
  | 'TimelineItem'
  | 'SkillBar'
  | 'Badge'
  | 'StatCard'
  | 'Card'
  | 'TechTag'
  | 'AchievementCard'
  | 'EducationCard'
  | 'FormInput'
  | 'FormButton'
  | 'FormSelect'
  | 'FormCheckbox'
  | 'FormRadio'
  | 'FormTextarea';

export type InputType = 
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'date'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'file';

export interface FormInputConfig {
  type: 'FormInput' | 'FormTextarea' | 'FormSelect' | 'FormCheckbox' | 'FormRadio';
  inputType: InputType;
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  validation?: string; // regex pattern
  options?: Array<{ label: string; value: string }>; // for select, radio, checkbox
  defaultValue?: string;
  className?: string;
  errorMessage?: string;
}

export interface FormButtonConfig {
  type: 'FormButton';
  label: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: string;
  onClick?: string; // action name
}

export interface ElementConfig {
  type: ComponentType;
  props: Record<string, any>;
  key?: string | number;
}

// ============================================
// SECTION TYPES
// ============================================

export type SectionType = 
  | 'Hero'
  | 'About'
  | 'Skills'
  | 'Experience'
  | 'Projects'
  | 'Achievements'
  | 'Education'
  | 'Contact'
  | 'Custom';

export interface SectionHeader {
  subtitle?: string;
  title?: string;
  description?: string;
}

export interface SectionConfig {
  id?: string;
  type: SectionType;
  header?: SectionHeader;
  backgroundColor?: string;
  className?: string;
  layout?: 'grid' | 'list' | 'flex' | 'single' | 'custom';
  gridCols?: string; // e.g., 'md:grid-cols-2 lg:grid-cols-3'
  elements?: ElementConfig[];
  data?: any[];
  elementRenderer?: (item: any, index: number) => ElementConfig;
  custom?: any; // For additional custom properties
}

// ============================================
// PAGE LAYOUT TYPES
// ============================================

export interface PageLayoutConfig {
  sections: SectionConfig[];
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
  };
}

// ============================================
// COMPONENT PROPS TYPES
// ============================================

export interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  techStack: string[];
  metrics?: string;
  liveUrl?: string;
  githubUrl?: string;
}

export interface TimelineItemProps {
  title: string;
  company: string;
  duration: string;
  location: string;
  description: string[];
  techStack: string[];
  logo?: string;
  isLeft?: boolean;
}

export interface SkillBarProps {
  name: string;
  level: number;
  category?: string;
}

export interface StatCardProps {
  icon: string;
  label: string;
  value: string;
}

export interface AchievementCardProps {
  title: string;
  description: string;
  date: string;
  icon: string;
}

export interface EducationCardProps {
  school: string;
  degree: string;
  field: string;
  graduationDate: string;
  cgpa?: string;
  activities?: string[];
}
