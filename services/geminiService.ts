import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateText = async (prompt: string, systemInstruction?: string): Promise<string> => {
  console.log("Generating Gemini text for prompt:", prompt);
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: prompt,
    config: {
      ...(systemInstruction && { systemInstruction }),
    }
  });
  return response.text;
};

export const generateContentWithImage = async (prompt: string, base64Image: string, mimeType: string): Promise<string> => {
    console.log("Generating Gemini text with image context...");
    const imagePart = {
        inlineData: {
            mimeType,
            data: base64Image,
        },
    };
    const textPart = {
        text: prompt,
    };
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [textPart, imagePart] },
    });
    return response.text;
}

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

export const generateSpeech = async (text: string): Promise<string> => {
  console.log("Generating Gemini text-to-speech for text:", text);
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: text }] }],
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

export const generateSpeechWithVoice = async (text: string, voiceName: string): Promise<string> => {
  console.log(`Generating Gemini TTS with voice ${voiceName} for text:`, text);
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
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

export const transcribeAudio = async (base64Audio: string, mimeType: string): Promise<string> => {
  console.log("Transcribing audio with Gemini...");
  const audioPart = {
    inlineData: {
      mimeType,
      data: base64Audio,
    },
  };
  const textPart = {
    text: 'Transcribe this audio file accurately.'
  };
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [audioPart, textPart] },
  });
  return response.text;
}

export const editImage = async (base64Image: string, mimeType: string, prompt: string): Promise<string> => {
    console.log("Editing image with Gemini for prompt:", prompt);
    const imagePart = {
        inlineData: {
            data: base64Image,
            mimeType: mimeType,
        },
    };
    const textPart = {
        text: prompt,
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [imagePart, textPart] },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        }
    }

    throw new Error("No image was returned from the API.");
}

export const editAudio = async (base64Audio: string, mimeType: string, prompt: string): Promise<string> => {
    console.log("Editing audio with Gemini for prompt:", prompt);
    const audioPart = {
        inlineData: {
            mimeType,
            data: base64Audio,
        },
    };
    const textPart = {
        text: prompt,
    };
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', // A model that can handle audio input
        contents: { parts: [audioPart, textPart] },
        config: {
            // This is speculative; the model may not support direct audio-to-audio.
            // We are instructing it to return audio.
            responseModalities: [Modality.AUDIO],
        },
    });
    const base64AudioOut = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64AudioOut) {
        throw new Error("No audio data was returned from the API. The model may not support this operation.");
    }
    return base64AudioOut;
};