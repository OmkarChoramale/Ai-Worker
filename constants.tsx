import React from 'react';
import { AITool, Category, InputType, OutputType } from './types';
import {
  SpeechToTextIcon, TextToSpeechIcon, VoiceCloningIcon, PodcastSummarizerIcon, AudioNoiseCleanerIcon,
  ChatAssistantIcon, ResumeBuilderIcon, GrammarEnhancerIcon, ContentRewriterIcon, SummarizerIcon,
  TextToImageIcon, ImageUpscalerIcon, BackgroundRemoverIcon, LogoGeneratorIcon, PortraitEnhancerIcon,
  TextToVideoIcon, CaptionGeneratorIcon, AvatarCreatorIcon, ReelGeneratorIcon,
  CodeExplainerIcon, DocumentAnalyzerIcon, TranslatorIcon, MeetingCopilotIcon, LiveMeetingCopilotIcon
} from './components/ui/Icons';

import TextToImageTool from './components/tools/TextToImageTool';
import TextToSpeechTool from './components/tools/TextToSpeechTool';
import VideoGeneratorTool from './components/tools/VideoGeneratorTool';
import ChatAssistantTool from './components/tools/ChatAssistantTool';
import CodeExplainerTool from './components/tools/CodeExplainerTool';
import GenericTextTool from './components/tools/GenericTextTool';
import SpeechToTextTool from './components/tools/SpeechToTextTool';
import ImageEditingTool from './components/tools/ImageEditingTool';
import PodcastSummarizerTool from './components/tools/PodcastSummarizerTool';
import VoiceCloningTool from './components/tools/VoiceCloningTool';
import AudioEditingTool from './components/tools/AudioEditingTool';
import AvatarCreatorTool from './components/tools/AvatarCreatorTool';
import MeetingCopilotTool from './components/tools/MeetingCopilotTool';
import LiveMeetingCopilotTool from './components/tools/LiveMeetingCopilotTool';

export const AI_TOOLS: AITool[] = [
  // Speech & Audio
  {
    id: 'speech-to-text', name: 'Speech-to-Text', description: 'Transcribe audio files into text.', icon: <SpeechToTextIcon />,
    category: Category.SPEECH_AUDIO, inputType: InputType.AUDIO, outputType: OutputType.TEXT, endpoint: '/api/ai/speech-to-text',
    component: SpeechToTextTool
  },
  {
    id: 'text-to-speech', name: 'Text-to-Speech', description: 'Convert text into natural-sounding speech.', icon: <TextToSpeechIcon />,
    category: Category.SPEECH_AUDIO, inputType: InputType.TEXT, outputType: OutputType.AUDIO, endpoint: '/api/ai/text-to-speech',
    component: TextToSpeechTool
  },
  {
    id: 'voice-cloning', name: 'Custom Voice Builder', description: 'Generate speech using different voices.', icon: <VoiceCloningIcon />,
    category: Category.SPEECH_AUDIO, inputType: InputType.TEXT, outputType: OutputType.AUDIO, endpoint: '/api/ai/voice-cloning',
    component: VoiceCloningTool
  },
  {
    id: 'podcast-summarizer', name: 'Podcast Summarizer', description: 'Get key insights from long podcasts.', icon: <PodcastSummarizerIcon />,
    category: Category.SPEECH_AUDIO, inputType: InputType.AUDIO, outputType: OutputType.TEXT, endpoint: '/api/ai/podcast-summarizer',
    component: PodcastSummarizerTool
  },
  {
    id: 'audio-cleaner', name: 'Audio Noise Cleaner', description: 'Remove background noise from audio.', icon: <AudioNoiseCleanerIcon />,
    category: Category.SPEECH_AUDIO, inputType: InputType.AUDIO, outputType: OutputType.AUDIO, endpoint: '/api/ai/audio-cleaner',
    component: AudioEditingTool
  },
  // Text & Writing
  {
    id: 'chat-assistant', name: 'AI Chat Assistant', description: 'Your creative partner for any task.', icon: <ChatAssistantIcon />,
    category: Category.TEXT_WRITING, inputType: InputType.TEXT, outputType: OutputType.TEXT, endpoint: '/api/ai/chat',
    component: ChatAssistantTool
  },
  {
    id: 'resume-builder', name: 'AI Resume Builder', description: 'Craft the perfect resume instantly.', icon: <ResumeBuilderIcon />,
    category: Category.TEXT_WRITING, inputType: InputType.TEXT, outputType: OutputType.TEXT, endpoint: '/api/ai/resume-builder',
    component: () => <GenericTextTool
      inputLabel="Your Experience & Skills"
      outputLabel="Generated Resume"
      placeholder="Paste your job history, skills, and the job description you're applying for..."
      systemInstruction="You are an expert resume writer. Take the user's information and the target job description to create a compelling, professional resume formatted in Markdown."
    />
  },
  {
    id: 'grammar-enhancer', name: 'Grammar Enhancer', description: 'Correct grammar and improve style.', icon: <GrammarEnhancerIcon />,
    category: Category.TEXT_WRITING, inputType: InputType.TEXT, outputType: OutputType.TEXT, endpoint: '/api/ai/grammar-enhancer',
    component: () => <GenericTextTool
      inputLabel="Original Text"
      outputLabel="Corrected Text"
      placeholder="Enter the text you want to check and improve..."
      systemInstruction="You are a grammar and style expert. Correct any grammatical errors, spelling mistakes, and awkward phrasing in the user's text. Explain the corrections briefly if necessary."
    />
  },
  {
    id: 'content-rewriter', name: 'Content Rewriter', description: 'Paraphrase text in different tones.', icon: <ContentRewriterIcon />,
    category: Category.TEXT_WRITING, inputType: InputType.TEXT, outputType: OutputType.TEXT, endpoint: '/api/ai/content-rewriter',
    component: () => <GenericTextTool
      inputLabel="Original Content"
      outputLabel="Rewritten Content"
      placeholder="Enter the content you want to rewrite..."
      systemInstruction="You are a content rewriter. Paraphrase the user's text to make it unique, clear, and engaging, while preserving the original meaning."
    />
  },
  {
    id: 'summarizer', name: 'Summarizer', description: 'Condense long texts into summaries.', icon: <SummarizerIcon />,
    category: Category.TEXT_WRITING, inputType: InputType.TEXT, outputType: OutputType.TEXT, endpoint: '/api/ai/summarizer',
    component: () => <GenericTextTool
      inputLabel="Text to Summarize"
      outputLabel="Summary"
      placeholder="Paste a long article, report, or document here..."
      systemInstruction="You are an expert summarizer. Read the user's text and provide a concise, easy-to-read summary that captures the main points."
    />
  },
  // Image & Design
  {
    id: 'text-to-image', name: 'Text-to-Image', description: 'Generate stunning images from text.', icon: <TextToImageIcon />,
    category: Category.IMAGE_DESIGN, inputType: InputType.TEXT, outputType: OutputType.IMAGE, endpoint: '/api/ai/text-to-image',
    component: TextToImageTool
  },
  {
    id: 'image-upscaler', name: 'Image Upscaler', description: 'Enhance image resolution with AI.', icon: <ImageUpscalerIcon />,
    category: Category.IMAGE_DESIGN, inputType: InputType.IMAGE, outputType: OutputType.IMAGE, endpoint: '/api/ai/image-upscaler',
    component: () => <ImageEditingTool 
      actionText="Upscale Image"
      promptPlaceholder="Describe any specific enhancements..."
      initialPrompt="Upscale this image, enhance details, and improve clarity without altering the content."
    />
  },
  {
    id: 'background-remover', name: 'Background Remover', description: 'Remove image backgrounds in seconds.', icon: <BackgroundRemoverIcon />,
    category: Category.IMAGE_DESIGN, inputType: InputType.IMAGE, outputType: OutputType.IMAGE, endpoint: '/api/ai/background-remover',
    component: () => <ImageEditingTool
      actionText="Remove Background"
      promptPlaceholder="e.g., make the background transparent"
      initialPrompt="Remove the background from this image, leaving only the main subject with clean edges. The new background should be transparent."
    />
  },
  {
    id: 'logo-generator', name: 'Logo Generator', description: 'Design a unique logo for your brand.', icon: <LogoGeneratorIcon />,
    category: Category.IMAGE_DESIGN, inputType: InputType.TEXT, outputType: OutputType.IMAGE, endpoint: '/api/ai/logo-generator',
    component: TextToImageTool
  },
  {
    id: 'portrait-enhancer', name: 'Portrait Enhancer', description: 'Retouch and enhance face photos.', icon: <PortraitEnhancerIcon />,
    category: Category.IMAGE_DESIGN, inputType: InputType.IMAGE, outputType: OutputType.IMAGE, endpoint: '/api/ai/portrait-enhancer',
    component: () => <ImageEditingTool
      actionText="Enhance Portrait"
      promptPlaceholder="e.g., improve lighting, soften skin"
      initialPrompt="Enhance this portrait. Improve lighting, smooth skin texture naturally, sharpen the eyes, and make the overall image more vibrant."
    />
  },
  // Video & Media
  {
    id: 'text-to-video', name: 'Text-to-Video', description: 'Create videos from text prompts.', icon: <TextToVideoIcon />,
    category: Category.VIDEO_MEDIA, inputType: InputType.TEXT, outputType: OutputType.VIDEO, endpoint: '/api/ai/text-to-video',
    component: VideoGeneratorTool
  },
  {
    id: 'caption-generator', name: 'Caption Generator', description: 'Automatically generate video captions.', icon: <CaptionGeneratorIcon />,
    category: Category.VIDEO_MEDIA, inputType: InputType.AUDIO, outputType: OutputType.TEXT, endpoint: '/api/ai/caption-generator',
    component: SpeechToTextTool
  },
  {
    id: 'avatar-creator', name: 'Avatar Creator', description: 'Create a talking head from text.', icon: <AvatarCreatorIcon />,
    category: Category.VIDEO_MEDIA, inputType: InputType.TEXT, outputType: OutputType.VIDEO, endpoint: '/api/ai/avatar-creator',
    component: AvatarCreatorTool
  },
  {
    id: 'reel-generator', name: 'AI Reel Generator', description: 'Generate short videos from scripts.', icon: <ReelGeneratorIcon />,
    category: Category.VIDEO_MEDIA, inputType: InputType.TEXT, outputType: OutputType.VIDEO, endpoint: '/api/ai/reel-generator',
    component: VideoGeneratorTool
  },
  // Utility
  {
    id: 'meeting-copilot', name: 'Meeting Co-Pilot', description: 'Get live AI assistance during meetings.', icon: <MeetingCopilotIcon />,
    category: Category.UTILITY, inputType: InputType.TEXT, outputType: OutputType.TEXT, endpoint: '/api/ai/meeting-copilot',
    component: MeetingCopilotTool
  },
  {
    id: 'live-meeting-copilot', name: 'Live Meeting Co-Pilot', description: 'Continuous, real-time meeting analysis.', icon: <LiveMeetingCopilotIcon />,
    category: Category.UTILITY, inputType: InputType.TEXT, outputType: OutputType.TEXT, endpoint: '/api/ai/live-meeting-copilot',
    component: LiveMeetingCopilotTool
  },
  {
    id: 'code-explainer', name: 'AI Code Explainer', description: 'Understand code in plain English.', icon: <CodeExplainerIcon />,
    category: Category.UTILITY, inputType: InputType.TEXT, outputType: OutputType.TEXT, endpoint: '/api/ai/code-explainer',
    component: CodeExplainerTool
  },
  {
    id: 'document-analyzer', name: 'Document Analyzer', description: 'Extract insights from documents.', icon: <DocumentAnalyzerIcon />,
    category: Category.UTILITY, inputType: InputType.DOCUMENT, outputType: OutputType.TEXT, endpoint: '/api/ai/document-analyzer',
    component: () => <GenericTextTool
      inputLabel="Document Text"
      outputLabel="Analysis & Insights"
      placeholder="Paste the text from your document here..."
      systemInstruction="You are a document analysis expert. Analyze the provided text and extract key insights, main topics, and any actionable items. Present the analysis in a clear, structured format."
    />
  },
  {
    id: 'translator', name: 'AI Translator', description: 'Translate text between languages.', icon: <TranslatorIcon />,
    category: Category.UTILITY, inputType: InputType.TEXT, outputType: OutputType.TEXT, endpoint: '/api/ai/translator',
    component: () => <GenericTextTool
      inputLabel="Text to Translate"
      outputLabel="Translation"
      placeholder="Enter text and specify the target language, e.g., 'Translate this to Spanish: Hello, world!'"
      systemInstruction="You are an expert multilingual translator. Translate the user's text into the specified language accurately and naturally."
    />
  },
];