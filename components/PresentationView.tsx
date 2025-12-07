import React from 'react';
import { SlideItem } from '../types';

interface PresentationViewProps {
  slides: SlideItem[];
  projectTitle: string;
  projectDescription: string;
}

export const PresentationView: React.FC<PresentationViewProps> = ({ 
  slides, 
  projectTitle,
  projectDescription 
}) => {
  return (
    <div className="w-full bg-white min-h-screen">
      {/* Cover Page */}
      <div className="min-h-[80vh] flex flex-col justify-between p-12 border-b border-black">
        <div className="flex justify-between items-start">
          <span className="font-mono text-xs uppercase tracking-widest">Baccano & Partners</span>
          <span className="font-mono text-xs uppercase tracking-widest">{new Date().toLocaleDateString('it-IT')}</span>
        </div>
        
        <div className="max-w-4xl">
          <h1 className="text-8xl font-bold uppercase tracking-tighter leading-[0.85] mb-8">{projectTitle}</h1>
          <p className="text-xl font-normal text-gray-500 max-w-2xl leading-relaxed">{projectDescription}</p>
        </div>

        <div className="flex gap-12 font-mono text-xs uppercase tracking-widest">
          <div>
            <span className="block text-gray-400 mb-1">Status</span>
            <span>Concept</span>
          </div>
          <div>
            <span className="block text-gray-400 mb-1">Fase</span>
            <span>Brainstorming</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        {slides.map((slide, index) => (
          <div key={slide.id} className="grid grid-cols-12 min-h-screen border-b border-black last:border-0 page-break">
            
            {/* Index Column */}
            <div className="col-span-1 border-r border-black p-4 flex flex-col justify-between items-center">
               <span className="font-mono text-xl font-bold">0{index + 1}</span>
               <div className="h-full w-[1px] bg-black my-4"></div>
            </div>

            {/* Image Column */}
            <div className="col-span-7 border-r border-black relative bg-gray-50">
               <img 
                  src={slide.imageUrl} 
                  alt="Reference" 
                  className="w-full h-full object-cover"
                />
            </div>

            {/* Data Column */}
            <div className="col-span-4 p-12 flex flex-col justify-between">
              <div>
                <div className="mb-12">
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] mb-4 text-gray-400">Input Cliente</h3>
                  <p className="text-2xl font-bold uppercase leading-tight tracking-tight">
                    {slide.userCaption || "N/D"}
                  </p>
                </div>

                {slide.aiAnalysis && (
                  <div className="animate-fade-in">
                    <div className="mb-8">
                      <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] mb-4 text-black border-b border-black pb-2 inline-block">Analisi</h3>
                      <p className="text-sm font-mono leading-relaxed text-justify">
                        {slide.aiAnalysis.technicalDescription}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] mb-4 text-black border-b border-black pb-2 inline-block">Domande</h3>
                      <ul className="space-y-4">
                        {slide.aiAnalysis.brainstormingQuestions.map((q, idx) => (
                          <li key={idx} className="text-sm border-l-2 border-black pl-4">
                            {q}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="font-mono text-[10px] uppercase text-gray-400 text-right">
                Ref ID: {slide.id}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-12 border-t-8 border-black text-center">
        <p className="font-mono text-xs uppercase tracking-widest">Baccano & Partners Studio © {new Date().getFullYear()}</p>
      </div>
    </div>
  );
};