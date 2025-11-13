
import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { Scene } from '../types';

const getAIClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY environment variable not set.");
    }
    return new GoogleGenAI({ apiKey });
};


export const parseScriptIntoScenes = async (script: string): Promise<Scene[]> => {
  if (!script.trim()) {
    throw new Error("Script content cannot be empty.");
  }
  const ai = getAIClient();
  const model = 'gemini-2.5-flash';
  
  const prompt = `
    You are a screenplay analysis expert. Your task is to read the following script and break it down into distinct scenes. For each scene, provide a concise, one-sentence visual description that can be used as a prompt for an AI image generator. The description should capture the key action, setting, and mood of the scene.

    Output the result as a JSON array of objects. Each object must have two properties: "sceneNumber" (an integer, starting from 1) and "visualPrompt" (a string). Do not include any other text or explanations outside of the JSON array.

    Example Script:
    [SCENE START]
    INT. COFFEE SHOP - DAY
    JANE sits at a table, nervously stirring her coffee. The shop is bustling. MARK enters, looking for her.
    [SCENE END]

    Expected JSON Output:
    [
      {
        "sceneNumber": 1,
        "visualPrompt": "A woman nervously stirs her coffee in a bustling coffee shop as a man scans the room for her."
      }
    ]

    Now, process the following script:
    ---
    ${script}
    ---
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              sceneNumber: { type: Type.NUMBER, description: "The sequential number of the scene." },
              visualPrompt: { type: Type.STRING, description: "The visual prompt for the image generator." },
            },
            required: ['sceneNumber', 'visualPrompt'],
          },
        },
      },
    });

    const jsonText = response.text.trim();
    const parsedScenes: Scene[] = JSON.parse(jsonText);
    return parsedScenes;
  } catch (error) {
    console.error("Error parsing script:", error);
    throw new Error("Failed to analyze the script. The AI may have returned an unexpected format. Please try again with a different script.");
  }
};


export const generateImageForScene = async (prompt: string): Promise<string> => {
  const ai = getAIClient();
  const model = 'imagen-4.0-generate-001';

  const fullPrompt = `cinematic storyboard, movie still, color-graded, detailed, hyper-realistic, 16:9 aspect ratio. ${prompt}`;

  const response = await ai.models.generateImages({
    model,
    prompt: fullPrompt,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/jpeg',
      aspectRatio: '16:9',
    },
  });

  if (response.generatedImages && response.generatedImages.length > 0) {
    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;
  } else {
    throw new Error("Image generation failed or returned no images.");
  }
};

export const createChat = (): Chat => {
    const ai = getAIClient();
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: "You are a friendly and helpful assistant for writers and filmmakers. Answer questions concisely and clearly.",
        },
    });
};
