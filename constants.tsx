import React from 'react';
import { AITool, Category, InputType, OutputType } from './types';
import {
  SpeechToTextIcon, TextToSpeechIcon, VoiceCloningIcon, PodcastSummarizerIcon, AudioNoiseCleanerIcon,
  ChatAssistantIcon, ResumeBuilderIcon, GrammarEnhancerIcon, ContentRewriterIcon, SummarizerIcon,
  TextToImageIcon, ImageUpscalerIcon, BackgroundRemoverIcon, LogoGeneratorIcon, PortraitEnhancerIcon,
  TextToVideoIcon, CaptionGeneratorIcon, AvatarCreatorIcon, ReelGeneratorIcon,
  CodeExplainerIcon, DocumentAnalyzerIcon, TranslatorIcon
} from './components/ui/Icons';
import TextToImageTool from './components/tools/TextToImageTool';
import TextToSpeechTool from './components/tools/TextToSpeechTool';
import VideoGeneratorTool from './components/tools/VideoGeneratorTool';
import ChatAssistantTool from './components/tools/ChatAssistantTool';
import CodeExplainerTool from './components/tools/CodeExplainerTool';
import PlaceholderTool from './components/tools/PlaceholderTool';

export const AI_TOOLS: AITool[] = [
  // Speech & Audio
  {
    id: 'speech-to-text', name: 'Speech-to-Text', description: 'Transcribe audio files into text.', icon: <SpeechToTextIcon />,
    category: Category.SPEECH_AUDIO, inputType: InputType.AUDIO, outputType: OutputType.TEXT, endpoint: '/api/ai/speech-to-text',
    component: () => <PlaceholderTool name="Speech-to-Text" />
  },
  {
    id: 'text-to-speech', name: 'Text-to-Speech', description: 'Convert text into natural-sounding speech.', icon: <TextToSpeechIcon />,
    category: Category.SPEECH_AUDIO, inputType: InputType.TEXT, outputType: OutputType.AUDIO, endpoint: '/api/ai/text-to-speech',
    component: TextToSpeechTool
  },
  {
    id: 'voice-cloning', name: 'Voice Cloning', description: 'Create a digital replica of a voice.', icon: <VoiceCloningIcon />,
    category: Category.SPEECH_AUDIO, inputType: InputType.AUDIO, outputType: OutputType.AUDIO, endpoint: '/api/ai/voice-cloning',
    component: () => <PlaceholderTool name="Voice Cloning" />
  },
  {
    id: 'podcast-summarizer', name: 'Podcast Summarizer', description: 'Get key insights from long podcasts.', icon: <PodcastSummarizerIcon />,
    category: Category.SPEECH_AUDIO, inputType: InputType.AUDIO, outputType: OutputType.TEXT, endpoint: '/api/ai/podcast-summarizer',
    component: () => <PlaceholderTool name="Podcast Summarizer" />
  },
  {
    id: 'audio-cleaner', name: 'Audio Noise Cleaner', description: 'Remove background noise from audio.', icon: <AudioNoiseCleanerIcon />,
    category: Category.SPEECH_AUDIO, inputType: InputType.AUDIO, outputType: OutputType.AUDIO, endpoint: '/api/ai/audio-cleaner',
    component: () => <PlaceholderTool name="Audio Noise Cleaner" />
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
    component: () => <PlaceholderTool name="AI Resume Builder" />
  },
  {
    id: 'grammar-enhancer', name: 'Grammar Enhancer', description: 'Correct grammar and improve style.', icon: <GrammarEnhancerIcon />,
    category: Category.TEXT_WRITING, inputType: InputType.TEXT, outputType: OutputType.TEXT, endpoint: '/api/ai/grammar-enhancer',
    component: () => <PlaceholderTool name="Grammar Enhancer" />
  },
  {
    id: 'content-rewriter', name: 'Content Rewriter', description: 'Paraphrase text in different tones.', icon: <ContentRewriterIcon />,
    category: Category.TEXT_WRITING, inputType: InputType.TEXT, outputType: OutputType.TEXT, endpoint: '/api/ai/content-rewriter',
    component: () => <PlaceholderTool name="Content Rewriter" />
  },
  {
    id: 'summarizer', name: 'Summarizer', description: 'Condense long texts into summaries.', icon: <SummarizerIcon />,
    category: Category.TEXT_WRITING, inputType: InputType.TEXT, outputType: OutputType.TEXT, endpoint: '/api/ai/summarizer',
    component: () => <PlaceholderTool name="Summarizer" />
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
    component: () => <PlaceholderTool name="Image Upscaler" />
  },
  {
    id: 'background-remover', name: 'Background Remover', description: 'Remove image backgrounds in seconds.', icon: <BackgroundRemoverIcon />,
    category: Category.IMAGE_DESIGN, inputType: InputType.IMAGE, outputType: OutputType.IMAGE, endpoint: '/api/ai/background-remover',
    component: () => <PlaceholderTool name="Background Remover" />
  },
  {
    id: 'logo-generator', name: 'Logo Generator', description: 'Design a unique logo for your brand.', icon: <LogoGeneratorIcon />,
    category: Category.IMAGE_DESIGN, inputType: InputType.TEXT, outputType: OutputType.IMAGE, endpoint: '/api/ai/logo-generator',
    component: () => <PlaceholderTool name="Logo Generator" />
  },
  {
    id: 'portrait-enhancer', name: 'Portrait Enhancer', description: 'Retouch and enhance face photos.', icon: <PortraitEnhancerIcon />,
    category: Category.IMAGE_DESIGN, inputType: InputType.IMAGE, outputType: OutputType.IMAGE, endpoint: '/api/ai/portrait-enhancer',
    component: () => <PlaceholderTool name="Portrait Enhancer" />
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
    component: () => <PlaceholderTool name="Caption Generator" />
  },
  {
    id: 'avatar-creator', name: 'Avatar Creator', description: 'Create a talking head from text.', icon: <AvatarCreatorIcon />,
    category: Category.VIDEO_MEDIA, inputType: InputType.TEXT, outputType: OutputType.VIDEO, endpoint: '/api/ai/avatar-creator',
    component: () => <PlaceholderTool name="Avatar Creator" />
  },
  {
    id: 'reel-generator', name: 'AI Reel Generator', description: 'Generate short videos from scripts.', icon: <ReelGeneratorIcon />,
    category: Category.VIDEO_MEDIA, inputType: InputType.TEXT, outputType: OutputType.VIDEO, endpoint: '/api/ai/reel-generator',
    component: () => <PlaceholderTool name="Reel Generator" />
  },
  // Utility
  {
    id: 'code-explainer', name: 'AI Code Explainer', description: 'Understand code in plain English.', icon: <CodeExplainerIcon />,
    category: Category.UTILITY, inputType: InputType.TEXT, outputType: OutputType.TEXT, endpoint: '/api/ai/code-explainer',
    component: CodeExplainerTool
  },
  {
    id: 'document-analyzer', name: 'Document Analyzer', description: 'Extract insights from documents.', icon: <DocumentAnalyzerIcon />,
    category: Category.UTILITY, inputType: InputType.DOCUMENT, outputType: OutputType.TEXT, endpoint: '/api/ai/document-analyzer',
    component: () => <PlaceholderTool name="Document Analyzer" />
  },
  {
    id: 'translator', name: 'AI Translator', description: 'Translate text between languages.', icon: <TranslatorIcon />,
    category: Category.UTILITY, inputType: InputType.TEXT, outputType: OutputType.TEXT, endpoint: '/api/ai/translator',
    component: () => <PlaceholderTool name="Translator" />
  },
];
