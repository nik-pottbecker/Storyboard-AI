
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ScriptInput } from './components/ScriptInput';
import { StoryboardDisplay } from './components/StoryboardDisplay';
import { Chatbot } from './components/Chatbot';
import { parseScriptIntoScenes, generateImageForScene } from './services/geminiService';
import type { StoryboardImage, Scene } from './types';
import { Tab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.GENERATOR);
  const [storyboard, setStoryboard] = useState<StoryboardImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateStoryboard = useCallback(async (script: string) => {
    setIsLoading(true);
    setError(null);
    setStoryboard([]);

    try {
      const scenes = await parseScriptIntoScenes(script);
      if (!scenes || scenes.length === 0) {
        throw new Error("Could not parse any scenes from the script.");
      }

      const initialStoryboard: StoryboardImage[] = scenes.map(scene => ({
        scene,
        imageUrl: null,
        isLoading: true,
        error: null,
      }));
      setStoryboard(initialStoryboard);
      setIsLoading(false); // Done with main loading, now loading images individually

      // Generate images sequentially to avoid rate limiting and show progress
      for (let i = 0; i < scenes.length; i++) {
        try {
          const imageUrl = await generateImageForScene(scenes[i].visualPrompt);
          setStoryboard(prev =>
            prev.map((item, index) =>
              index === i ? { ...item, imageUrl, isLoading: false } : item
            )
          );
        } catch (imageError) {
            console.error(`Failed to generate image for scene ${i + 1}:`, imageError);
            setStoryboard(prev =>
              prev.map((item, index) =>
                index === i ? { ...item, isLoading: false, error: 'Failed to generate image.' } : item
              )
            );
        }
      }

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-base-100 font-sans">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="p-4 sm:p-6 lg:p-8">
        {activeTab === Tab.GENERATOR && (
          <div className="space-y-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-center text-text-primary tracking-tight">
              AI Storyboard Generator
            </h1>
            <p className="text-center text-lg text-text-secondary max-w-2xl mx-auto">
              Paste your script below. Our AI will break it down into scenes and generate a visual storyboard for you.
            </p>
            <ScriptInput onGenerate={handleGenerateStoryboard} isLoading={isLoading} />
            {error && (
              <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">
                <strong>Error:</strong> {error}
              </div>
            )}
            <StoryboardDisplay storyboard={storyboard} />
          </div>
        )}
        {activeTab === Tab.CHATBOT && <Chatbot />}
      </main>
    </div>
  );
};

export default App;
