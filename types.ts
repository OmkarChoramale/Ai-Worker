import { FC, ReactElement } from 'react';

export enum Category {
  SPEECH_AUDIO = 'Speech & Audio',
  TEXT_WRITING = 'Text & Writing',
  IMAGE_DESIGN = 'Image & Design',
  VIDEO_MEDIA = 'Video & Media',
  UTILITY = 'Utility',
}

export enum InputType {
  TEXT = 'text',
  AUDIO = 'audio',
  IMAGE = 'image',
  DOCUMENT = 'document',
}

export enum OutputType {
  TEXT = 'text',
  AUDIO = 'audio',
  IMAGE = 'image',
  VIDEO = 'video',
}

export interface AITool {
  id: string;
  name: string;
  description: string;
  // Fix: Use ReactElement instead of JSX.Element to avoid namespace error in .ts file.
  icon: ReactElement;
  category: Category;
  inputType: InputType;
  outputType: OutputType;
  endpoint: string;
  component: FC;
}
