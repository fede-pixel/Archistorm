import React, { useState } from 'react';
import { ProjectState, SlideItem } from './types';
import { analyzeImageForArchitect, detectPhotoBounds } from './services/geminiService';
import { Header } from './components/Header';
import { SlideCard } from './components/SlideCard';
import { PresentationView } from './components/PresentationView';
import { Upload } from 'lucide-react';

const App: React.FC = () => {
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [projectState, setProjectState] = useState<ProjectState>({
    title: "Ristrutturazione Casa Milano",
    description: "Analisi preliminare per la ridefinizione degli spazi interni. Focus su materiali naturali e luce.",
    slides: [
      {
        id: 'demo-1',
        imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
        userCaption: 'Soggiorno doppia altezza con boiserie in legno e parete in marmo.',
        isAnalyzing: false,
        isCropping: false
      },
      {
        id: 'demo-2',
        imageUrl: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=1200&q=80',
        userCaption: 'Dettaglio illuminazione a sospensione e contrasti materici.',
        isAnalyzing: false,
        isCropping: false
      },
      {
        id: 'demo-3',
        imageUrl: 'https://images.unsplash.com/photo-1505624198937-c704aff7260c?auto=format&fit=crop&w=1200&q=80',
        userCaption: 'Scala moderna con rivestimento in legno e illuminazione integrata.',
        isAnalyzing: false,
        isCropping: false
      },
      {
        id: 'demo-4',
        imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
        userCaption: 'Parete TV in marmo con design minimalista.',
        isAnalyzing: false,
        isCropping: false
      }
    ]
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const newSlide: SlideItem = {
        id: crypto.randomUUID(),
        imageUrl: reader.result as string,
        userCaption: "",
        isAnalyzing: false,
        isCropping: false
      };

      setProjectState(prev => ({
        ...prev,
        slides: [...prev.slides, newSlide]
      }));
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const updateSlideCaption = (id: string, caption: string) => {
    setProjectState(prev => ({
      ...prev,
      slides: prev.slides.map(s => s.id === id ? { ...s, userCaption: caption } : s)
    }));
  };

  const deleteSlide = (id: string) => {
    setProjectState(prev => ({
      ...prev,
      slides: prev.slides.filter(s => s.id !== id)
    }));
  };

  const handleAutoCrop = async (id: string) => {
    const slide = projectState.slides.find(s => s.id === id);
    if (!slide) return;

    setProjectState(prev => ({
      ...prev,
      slides: prev.slides.map(s => s.id === id ? { ...s, isCropping: true } : s)
    }));

    try {
      const bounds = await detectPhotoBounds(slide.imageUrl);
      const img = new Image();
      img.src = slide.imageUrl;
      img.crossOrigin = "anonymous"; 
      await new Promise((resolve, reject) => { 
        img.onload = resolve; 
        img.onerror = reject;
      });

      const originalWidth = img.naturalWidth;
      const originalHeight = img.naturalHeight;
      const cropX = bounds.xmin * originalWidth;
      const cropY = bounds.ymin * originalHeight;
      const cropWidth = (bounds.xmax - bounds.xmin) * originalWidth;
      const cropHeight = (bounds.ymax - bounds.ymin) * originalHeight;

      const canvas = document.createElement('canvas');
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Canvas context failed");

      ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
      const croppedBase64 = canvas.toDataURL('image/jpeg', 0.95);

      setProjectState(prev => ({
        ...prev,
        slides: prev.slides.map(s => s.id === id ? { ...s, isCropping: false, imageUrl: croppedBase64 } : s)
      }));

    } catch (error) {
      console.error("Auto crop failed", error);
      alert("Impossibile ritagliare automaticamente.");
      setProjectState(prev => ({
        ...prev,
        slides: prev.slides.map(s => s.id === id ? { ...s, isCropping: false } : s)
      }));
    }
  };

  const handleAIAnalysis = async (id: string) => {
    const slide = projectState.slides.find(s => s.id === id);
    if (!slide) return;

    setProjectState(prev => ({
      ...prev,
      slides: prev.slides.map(s => s.id === id ? { ...s, isAnalyzing: true } : s)
    }));

    try {
      const analysis = await analyzeImageForArchitect(slide.imageUrl, slide.userCaption);
      setProjectState(prev => ({
        ...prev,
        slides: prev.slides.map(s => s.id === id ? { ...s, isAnalyzing: false, aiAnalysis: analysis } : s)
      }));
    } catch (error) {
      setProjectState(prev => ({
        ...prev,
        slides: prev.slides.map(s => s.id === id ? { ...s, isAnalyzing: false } : s)
      }));
      alert("Errore AI.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Header 
        isPresentationMode={isPresentationMode}
        toggleMode={() => setIsPresentationMode(!isPresentationMode)}
        projectTitle={projectState.title}
        setProjectTitle={(t) => setProjectState(prev => ({ ...prev, title: t }))}
      />

      {isPresentationMode ? (
        <PresentationView 
          slides={projectState.slides}
          projectTitle={projectState.title}
          projectDescription={projectState.description}
        />
      ) : (
        <main className="w-full px-6 py-12">
          
          <div className="mb-12 max-w-4xl">
            <textarea
              value={projectState.description}
              onChange={(e) => setProjectState(prev => ({ ...prev, description: e.target.value }))}
              className="w-full border-b border-black p-0 py-4 text-2xl font-normal focus:ring-0 bg-transparent resize-none placeholder-gray-300 rounded-none leading-relaxed"
              placeholder="INSERIRE DESCRIZIONE PROGETTO..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Upload Card */}
            <div className="aspect-[4/3] border border-black border-dashed hover:bg-black hover:text-white transition-all flex flex-col items-center justify-center cursor-pointer group relative">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="mb-4">
                <Upload size={32} strokeWidth={1} />
              </div>
              <p className="font-mono text-xs uppercase tracking-widest">Carica Immagine</p>
              <p className="text-[10px] font-mono mt-2 opacity-50">DRAG & DROP OR CLICK</p>
            </div>

            {/* Slides */}
            {projectState.slides.map(slide => (
              <SlideCard 
                key={slide.id}
                slide={slide}
                onUpdateCaption={updateSlideCaption}
                onAnalyze={handleAIAnalysis}
                onCrop={handleAutoCrop}
                onDelete={deleteSlide}
              />
            ))}
          </div>

          {projectState.slides.length === 0 && (
            <div className="fixed bottom-12 right-12 text-right opacity-30 pointer-events-none">
              <p className="text-9xl font-bold uppercase tracking-tighter">Empty</p>
            </div>
          )}
        </main>
      )}
    </div>
  );
};

export default App;