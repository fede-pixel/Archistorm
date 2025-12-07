import React from 'react';
import { Presentation, LayoutGrid, Printer } from 'lucide-react';

interface HeaderProps {
  isPresentationMode: boolean;
  toggleMode: () => void;
  projectTitle: string;
  setProjectTitle: (title: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  isPresentationMode, 
  toggleMode, 
  projectTitle, 
  setProjectTitle 
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="bg-white border-b border-black sticky top-0 z-50 no-print">
      <div className="w-full px-6 py-6 flex items-start justify-between">
        <div className="flex-1">
          {isPresentationMode ? (
             <h1 className="text-4xl font-bold uppercase tracking-tighter text-black leading-none">{projectTitle}</h1>
          ) : (
            <input 
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="text-4xl font-bold uppercase tracking-tighter text-black border-none focus:ring-0 bg-transparent placeholder-gray-300 w-full p-0 leading-none"
              placeholder="NOME PROGETTO"
            />
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className="h-[1px] w-8 bg-black"></span>
            <p className="text-[10px] font-mono uppercase tracking-widest text-black">
              Baccano & Partners Studio // Internal Tool
            </p>
          </div>
        </div>

        <div className="flex items-center gap-0 border border-black">
          <button 
            onClick={toggleMode}
            className={`flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
              isPresentationMode 
                ? 'bg-black text-white hover:bg-white hover:text-black' 
                : 'bg-white text-black hover:bg-black hover:text-white'
            }`}
          >
            {isPresentationMode ? (
              <>
                <LayoutGrid size={14} />
                Editor
              </>
            ) : (
              <>
                <Presentation size={14} />
                Presentazione
              </>
            )}
          </button>
          
          <div className="w-[1px] bg-black self-stretch"></div>

          <button 
            onClick={handlePrint}
            className="px-4 py-3 text-black hover:bg-black hover:text-white transition-colors"
            title="Stampa"
          >
            <Printer size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};