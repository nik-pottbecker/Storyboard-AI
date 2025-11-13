
import React from 'react';
import type { StoryboardImage } from '../types';
import { Loader } from './Loader';

interface StoryboardDisplayProps {
  storyboard: StoryboardImage[];
}

const SkeletonCard: React.FC = () => (
  <div className="bg-base-200 rounded-lg shadow-lg overflow-hidden animate-pulse">
    <div className="aspect-video bg-base-300 w-full flex items-center justify-center">
      <Loader className="w-8 h-8 text-base-100" />
    </div>
    <div className="p-4 space-y-2">
      <div className="h-4 bg-base-300 rounded w-1/4"></div>
      <div className="h-4 bg-base-300 rounded w-full"></div>
      <div className="h-4 bg-base-300 rounded w-3/4"></div>
    </div>
  </div>
);

const StoryboardCard: React.FC<{ item: StoryboardImage }> = ({ item }) => {
  if (item.isLoading) {
    return <SkeletonCard />;
  }

  return (
    <div className="bg-base-200 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105">
      <div className="aspect-video bg-base-300 w-full flex items-center justify-center">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={`Scene ${item.scene.sceneNumber}`} className="w-full h-full object-cover" />
        ) : (
          <div className="p-4 text-center text-red-400">
            <p><strong>Error</strong></p>
            <p>{item.error || 'Could not generate image.'}</p>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-text-primary">Scene {item.scene.sceneNumber}</h3>
        <p className="text-sm text-text-secondary mt-1">{item.scene.visualPrompt}</p>
      </div>
    </div>
  );
};


export const StoryboardDisplay: React.FC<StoryboardDisplayProps> = ({ storyboard }) => {
  if (storyboard.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-text-primary mb-8">Your Storyboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {storyboard.map((item, index) => (
          <StoryboardCard key={index} item={item} />
        ))}
      </div>
    </div>
  );
};
