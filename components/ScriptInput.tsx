
import React, { useState } from 'react';
import { Loader } from './Loader';

interface ScriptInputProps {
  onGenerate: (script: string) => void;
  isLoading: boolean;
}

const sampleScript = `
INT. DINER - NIGHT

A classic, slightly worn-out American diner. Rain streaks down the large windows.

ARTHUR (40s), haggard and tired, sits in a booth, nursing a cup of coffee. He stares out the window, lost in thought.

A WAITRESS (60s), kind-faced but weary, approaches his table.

WAITRESS
Another refill, hon?

Arthur looks up, startled. He forces a smile.

ARTHUR
No, thanks. I should get going.

He fumbles in his pockets, pulling out a few crumpled bills. He leaves them on the table and stands up, pulling his trench coat tighter. As he walks towards the door, his eyes lock on a mysterious figure sitting in the corner, shrouded in shadows.
`.trim();

export const ScriptInput: React.FC<ScriptInputProps> = ({ onGenerate, isLoading }) => {
  const [script, setScript] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(script);
  };
  
  const handleUseSample = () => {
    setScript(sampleScript);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          placeholder="Paste your script here..."
          className="w-full h-64 p-4 bg-base-200 border border-base-300 rounded-lg text-text-primary focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-200 resize-y"
          disabled={isLoading}
        />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleUseSample}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-brand-primary bg-transparent border border-brand-primary rounded-lg hover:bg-brand-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              Use Sample Script
            </button>
            <button
            type="submit"
            disabled={isLoading || !script.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-gradient-to-r from-brand-primary to-brand-secondary rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg"
            >
            {isLoading ? (
                <>
                <Loader className="w-5 h-5" />
                Analyzing Script...
                </>
            ) : (
                'Generate Storyboard'
            )}
            </button>
        </div>
      </form>
    </div>
  );
};
