import { GoogleGenAI, Modality } from "@google/genai";

// Fix: Initialize the GoogleGenAI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Fix: Implement text generation using the Gemini API.
export const generateText = async (prompt: string): Promise<string> => {
  console.log("Generating Gemini text for prompt:", prompt);
  const response = await ai.models.generateContent({ model: 'gemini-2.5-pro', contents: prompt });
  return response.text;
};

// Fix: Implement image generation using the Gemini API.
export const generateImage = async (prompt: string): Promise<string> => {
  console.log("Generating Gemini image for prompt:", prompt);
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: prompt,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/png',
    },
  });

  const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
  return `data:image/png;base64,${base64ImageBytes}`;
};

// Fix: Implement speech generation using the Gemini API.
export const generateSpeech = async (text: string): Promise<string> => {
  console.log("Generating Gemini text-to-speech for text:", text);
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Say cheerfully: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
      },
    },
  });
  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) {
    throw new Error("No audio data was returned from the API.");
  }
  return base64Audio;
};

// Fix: Implement video generation using the Gemini API.
export const generateVideo = async (prompt: string): Promise<string> => {
    console.log("Generating Gemini video for prompt:", prompt);
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });
    
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("Video generation failed or did not return a download link.");
    }
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const videoBlob = await response.blob();
    return URL.createObjectURL(videoBlob);
};
