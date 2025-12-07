import React from 'react';
import { SlideItem } from '../types';
import { Sparkles, Trash2, ArrowRight, Crop, Loader2 } from 'lucide-react';

interface SlideCardProps {
  slide: SlideItem;
  onUpdateCaption: (id: string, caption: string) => void;
  onAnalyze: (id: string) => void;
  onCrop: (id: string) => void;
  onDelete: (id: string) => void;
}

export const SlideCard: React.FC<SlideCardProps> = ({ 
  slide, 
  onUpdateCaption, 
  onAnalyze,
  onCrop,
  onDelete
}) => {
  return (
    <div className="bg-white border border-black flex flex-col h-full group relative">
      {/* Image Section */}
      <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden border-b border-black">
        <img 
          src={slide.imageUrl} 
          alt="Architectural detail" 
          className="w-full h-full object-cover transition-all duration-500"
        />
        
        {/* Hover Actions */}
        <div className="absolute top-0 right-0 p-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={() => onCrop(slide.id)}
            disabled={slide.isCropping}
            className="p-2 bg-white border border-black text-black hover:bg-black hover:text-white transition-colors"
          >
            {slide.isCropping ? <Loader2 size={16} className="animate-spin" /> : <Crop size={16} />}
          </button>
          
          <button 
            onClick={() => onDelete(slide.id)}
            className="p-2 bg-black text-white hover:bg-red-600 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {slide.isCropping && (
           <div className="absolute inset-0 bg-white/90 flex items-center justify-center border-b border-black">
             <span className="font-mono text-xs uppercase tracking-widest animate-pulse">Processing Crop...</span>
           </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400">Didascalia</span>
            <span className="font-mono text-[10px] text-gray-400">ID: {slide.id.slice(0,4)}</span>
          </div>
          <textarea
            value={slide.userCaption}
            onChange={(e) => onUpdateCaption(slide.id, e.target.value)}
            placeholder="INSERIRE NOTE PROGETTUALI..."
            className="w-full bg-transparent border-b border-gray-200 focus:border-black rounded-none p-0 pb-2 text-sm font-medium focus:ring-0 placeholder-gray-300 resize-none h-20 leading-relaxed"
          />
        </div>

        <div className="mt-8">
          {!slide.aiAnalysis ? (
            <button
              onClick={() => onAnalyze(slide.id)}
              disabled={slide.isAnalyzing || slide.isCropping}
              className="w-full py-4 border border-black flex items-center justify-between px-4 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {slide.isAnalyzing ? "Analisi in corso..." : "Genera Analisi AI"}
              <Sparkles size={14} />
            </button>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-widest mb-2 border-b border-gray-100 pb-1">Descrizione Tecnica</h4>
                <p className="text-xs leading-5 text-gray-800 font-normal">
                  {slide.aiAnalysis.technicalDescription}
                </p>
              </div>

              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-widest mb-2 border-b border-gray-100 pb-1">Spunti Discussione</h4>
                <ul className="space-y-2">
                  {slide.aiAnalysis.brainstormingQuestions.map((q, idx) => (
                    <li key={idx} className="flex gap-3 text-xs items-start group/item">
                      <span className="font-mono text-gray-300">0{idx + 1}</span>
                      <span className="text-black group-hover/item:underline">{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};