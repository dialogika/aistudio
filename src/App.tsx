import React, { useState, useRef, useEffect } from 'react';
import { 
  Download, 
  Upload, 
  RotateCcw, 
  Image as ImageIcon, 
  Type, 
  Palette, 
  Sliders, 
  Globe, 
  Instagram, 
  Facebook, 
  Twitter, 
  Sparkles,
  RefreshCw,
  Maximize2,
  Minimize2,
  Move,
  Check,
  Eye
} from 'lucide-react';
import { toPng, toJpeg } from 'html-to-image';

// Pre-defined color motifs for creative inspiration
interface PresetTheme {
  id: string;
  name: string;
  skyColor: string;
  skyGradientEnd: string;
  backHillColor: string;
  frontHillColor: string;
  headlineColor: string;
  textColor: string;
  accentColor: string;
}

const PRESETS: PresetTheme[] = [
  {
    id: 'original',
    name: 'Original Sky',
    skyColor: '#D9EFFF',
    skyGradientEnd: '#EBF5FF',
    backHillColor: '#C0E055',
    frontHillColor: '#7CB324',
    headlineColor: '#103F68', // Deep Dialogika Navy Blue
    textColor: '#5783A3',
    accentColor: '#103F68',
  },
  {
    id: 'sunset',
    name: 'Twilight Gold',
    skyColor: '#FEE2E2',
    skyGradientEnd: '#FEF3C7',
    backHillColor: '#F59E0B',
    frontHillColor: '#D97706',
    headlineColor: '#78350F',
    textColor: '#B45309',
    accentColor: '#D97706',
  },
  {
    id: 'cool-mint',
    name: 'Mint Meadow',
    skyColor: '#E0F2FE',
    skyGradientEnd: '#ECFDF5',
    backHillColor: '#34D399',
    frontHillColor: '#059669',
    headlineColor: '#064E3B',
    textColor: '#047857',
    accentColor: '#059669',
  },
  {
    id: 'lavender',
    name: 'Dreamy Purple',
    skyColor: '#EDE9FE',
    skyGradientEnd: '#FAE8FF',
    backHillColor: '#C084FC',
    frontHillColor: '#9333EA',
    headlineColor: '#4A044E',
    textColor: '#701A75',
    accentColor: '#9333EA',
  }
];

export default function App() {
  // Post content state
  const [headlineLine1, setHeadlineLine1] = useState('Lorem ipsum dolor sit amet');
  const [headlineLine2, setHeadlineLine2] = useState('(headline taruh di sini)');
  const [imageSource, setImageSource] = useState('Sumber Gambar : Lorem Ipsum Dolor Sit Amet');
  
  // Visual Theme States
  const [selectedPreset, setSelectedPreset] = useState<string>('original');
  const [skyColor, setSkyColor] = useState('#D9EFFF');
  const [skyGradientEnd, setSkyGradientEnd] = useState('#EBF5FF');
  const [backHillColor, setBackHillColor] = useState('#C0E055');
  const [frontHillColor, setFrontHillColor] = useState('#7CB324');
  const [headlineColor, setHeadlineColor] = useState('#103F68');
  const [imageSourceColor, setImageSourceColor] = useState('#5783A3');
  const [showCloud, setShowCloud] = useState(true);

  // User uploaded image states
  const [circleImage, setCircleImage] = useState<string | null>(null);
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [footerImage, setFooterImage] = useState<string | null>(null);

  // System Image File Paths (References to physical images provided in workspace)
  const [systemLogoUrl] = useState('/logo.png');
  const [systemFooterUrl] = useState('/footer.png');

  // Fallback triggers if system images error/fail to load
  const [logoLoadError, setLogoLoadError] = useState(false);
  const [footerLoadError, setFooterLoadError] = useState(false);

  // Logo & Footer Mode toggles
  const [logoMode, setLogoMode] = useState<'system' | 'custom' | 'fallback'>('system');
  const [footerMode, setFooterMode] = useState<'system' | 'custom' | 'dynamic'>('system');

  // Interactive Social Handles (for Dynamic Footer generation)
  const [igHandle, setIgHandle] = useState('dialogika.co');
  const [twHandle, setTwHandle] = useState('dialogika_co');
  const [fbHandle, setFbHandle] = useState('dialogika.co');
  const [webHandle, setWebHandle] = useState('dialogika.co');

  // Typography controls
  const [headlineSize, setHeadlineSize] = useState<number>(32);
  const [sourceTextSize, setSourceTextSize] = useState<number>(11);
  const [boldness, setBoldness] = useState<string>('font-bold');

  // Circular placeholder image adjustment controls
  const [imgScale, setImgScale] = useState<number>(1.2);
  const [imgX, setImgX] = useState<number>(0);
  const [imgY, setImgY] = useState<number>(0);
  const [imgRotate, setImgRotate] = useState<number>(0);
  const [imgBrightness, setImgBrightness] = useState<number>(100);
  const [imgContrast, setImgContrast] = useState<number>(100);
  const [imgGrayscale, setImgGrayscale] = useState<number>(0);

  // Poster element reference for downloading
  const posterRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const footerInputRef = useRef<HTMLInputElement>(null);

  // Active adjustment tab ("text" | "image" | "brand" | "theme")
  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'brand' | 'theme'>('image');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);
  const [downloadScale, setDownloadScale] = useState<number>(2); // 2x default for high-res download

  // Listen for preset shifts
  useEffect(() => {
    const preset = PRESETS.find(p => p.id === selectedPreset);
    if (preset) {
      setSkyColor(preset.skyColor);
      setSkyGradientEnd(preset.skyGradientEnd);
      setBackHillColor(preset.backHillColor);
      setFrontHillColor(preset.frontHillColor);
      setHeadlineColor(preset.headlineColor);
      setImageSourceColor(preset.textColor);
    }
  }, [selectedPreset]);

  // Handle uploaded placeholder circle image
  const handleCircleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setCircleImage(uploadEvent.target.result as string);
          // Set to custom state
          setActiveTab('image');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setLogoImage(uploadEvent.target.result as string);
          setLogoMode('custom');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle footer upload
  const handleFooterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setFooterImage(uploadEvent.target.result as string);
          setFooterMode('custom');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Clear images
  const resetCircleImage = () => {
    setCircleImage(null);
    setImgScale(1.2);
    setImgX(0);
    setImgY(0);
    setImgRotate(0);
    setImgBrightness(100);
    setImgContrast(100);
    setImgGrayscale(0);
  };

  // Run poster download as JPEG/PNG
  const downloadPoster = async (format: 'png' | 'jpeg') => {
    if (!posterRef.current) return;
    setIsDownloading(true);
    setDownloadSuccessMessage(null);

    try {
      // Small timeout to allow state rendering
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const captureOptions = {
        quality: 0.98,
        pixelRatio: downloadScale, // Scale multiplier (e.g., 2 accounts for ultra sharp output)
        style: {
          transform: 'scale(1)',
          borderRadius: '0px', // Crisp square borders for output file
          boxShadow: 'none'
        }
      };

      let dataUrl = '';
      if (format === 'png') {
        dataUrl = await toPng(posterRef.current, captureOptions);
      } else {
        dataUrl = await toJpeg(posterRef.current, captureOptions);
      }

      // Create download trigger
      const link = document.createElement('a');
      const sanitizedName = headlineLine1.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 20);
      link.download = `dialogika_poster_${sanitizedName || 'poster'}.${format}`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccessMessage(`Yey! Poster berhasil diunduh pada resolusi ${downloadScale * 100}% (${format.toUpperCase()})`);
      setTimeout(() => setDownloadSuccessMessage(null), 5000);
    } catch (error) {
      console.error('Error generating image download:', error);
      alert('Gagal membuat unduhan gambar. Silakan coba lagi.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased flex flex-col">
      {/* Dynamic Header */}
      <header className="bg-white border-b border-slate-200/80 px-6 py-4 px-auto sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-600 rounded-lg text-white">
                <Sparkles size={20} className="animate-pulse" />
              </span>
              <h1 className="text-xl font-bold text-slate-950 tracking-tight">Dialogika Poster Editor</h1>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              Sesuaikan teks, ugah placeholder gambar, dan unduh selebaran promosi berskala 4:5 yang profesional.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
              Ratio 4:5
            </span>
            <span className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping"></span>
              Siap Unduh
            </span>
          </div>
        </div>
      </header>

      {/* Main App Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Controls Side-Panel (5 cols on lg) */}
        <section className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-auto max-h-[calc(100vh-140px)] min-h-[500px]">
          
          {/* Controls Tab Selector */}
          <div className="flex border-b border-slate-200 bg-slate-50/50">
            <button
              onClick={() => setActiveTab('image')}
              className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
                activeTab === 'image'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
              }`}
            >
              <ImageIcon size={16} />
              <span>Gambar</span>
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
                activeTab === 'text'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
              }`}
            >
              <Type size={16} />
              <span>Teks</span>
            </button>
            <button
              onClick={() => setActiveTab('brand')}
              className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
                activeTab === 'brand'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
              }`}
            >
              <Globe size={16} />
              <span>Brand</span>
            </button>
            <button
              onClick={() => setActiveTab('theme')}
              className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
                activeTab === 'theme'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
              }`}
            >
              <Palette size={16} />
              <span>Warna</span>
            </button>
          </div>

          {/* Active Tab Configuration Blocks */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            
            {/* TABS 1: IMAGE PLACEHOLDER PRECISE CONTROLS */}
            {activeTab === 'image' && (
              <div className="space-y-5 animate-in fade-in transition-all">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-1">
                    <span>Unggah Gambar Placeholder</span>
                    <span className="text-red-500">*</span>
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">
                    Mengganti lingkaran ilustrasi placeholder dengan potret pilihan Anda.
                  </p>

                  {/* Drag and Drop Box */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                      circleImage 
                        ? 'border-blue-400 bg-blue-50/20 hover:bg-blue-50/40' 
                        : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50'
                    }`}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleCircleImageUpload} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    {circleImage ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-200">
                          <img src={circleImage} alt="Uploaded thumbnail" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs font-semibold text-blue-600">Gambar Dipasang - Klik untuk ganti</span>
                        <span className="text-[10px] text-slate-400">Seret gambar baru ke sini juga bisa</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-3 bg-slate-100 rounded-full text-slate-400">
                          <Upload size={20} />
                        </div>
                        <span className="text-sm font-medium text-slate-700">Klik atau letakkan foto di sini</span>
                        <span className="text-xs text-slate-400">Mendukung format PNG, JPG, WebP</span>
                      </div>
                    )}
                  </div>

                  {circleImage && (
                    <button 
                      onClick={resetCircleImage}
                      className="mt-2.5 w-full py-1.5 px-3 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <RotateCcw size={13} />
                      Kembalikan ke Ilustrasi Default
                    </button>
                  )}
                </div>

                {/* Picture Manipulation Sliders (Active when image selected) */}
                <div className={`space-y-4 pt-4 border-t border-slate-100 ${!circleImage ? 'opacity-45 pointer-events-none' : ''}`}>
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Sliders size={14} />
                      Penyesuaian Posisi Foto
                    </h4>
                    {!circleImage && (
                      <span className="text-[10px] text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded">
                        Pilih foto terlebih dahulu
                      </span>
                    )}
                  </div>

                  {/* Zoom Scale */}
                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-600 mb-1.5">
                      <span>Perbesar / Zoom: <span className="font-bold text-slate-900">{imgScale.toFixed(2)}x</span></span>
                      <button onClick={() => setImgScale(1.2)} className="text-[10px] text-blue-600 hover:underline">Reset</button>
                    </div>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="3.5" 
                      step="0.05" 
                      value={imgScale} 
                      onChange={(e) => setImgScale(parseFloat(e.target.value))} 
                      className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                    />
                  </div>

                  {/* Offset X Slider */}
                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-600 mb-1.5">
                      <span>Geser Kiri/Kanan (X): <span className="font-bold text-slate-900">{imgX}px</span></span>
                      <button onClick={() => setImgX(0)} className="text-[10px] text-blue-600 hover:underline">Reset</button>
                    </div>
                    <input 
                      type="range" 
                      min="-200" 
                      max="200" 
                      step="1" 
                      value={imgX} 
                      onChange={(e) => setImgX(parseInt(e.target.value))} 
                      className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                    />
                  </div>

                  {/* Offset Y Slider */}
                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-600 mb-1.5">
                      <span>Geser Atas/Bawah (Y): <span className="font-bold text-slate-900">{imgY}px</span></span>
                      <button onClick={() => setImgY(0)} className="text-[10px] text-blue-600 hover:underline">Reset</button>
                    </div>
                    <input 
                      type="range" 
                      min="-200" 
                      max="200" 
                      step="1" 
                      value={imgY} 
                      onChange={(e) => setImgY(parseInt(e.target.value))} 
                      className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                    />
                  </div>

                  {/* Rotation Slider */}
                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-600 mb-1.5">
                      <span>Rotasi Gambar: <span className="font-bold text-slate-900">{imgRotate}°</span></span>
                      <button onClick={() => setImgRotate(0)} className="text-[10px] text-blue-600 hover:underline">Reset</button>
                    </div>
                    <input 
                      type="range" 
                      min="-180" 
                      max="180" 
                      step="1.5" 
                      value={imgRotate} 
                      onChange={(e) => setImgRotate(parseInt(e.target.value))} 
                      className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                    />
                  </div>

                  {/* Visual Quality Filters */}
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Filter Kecerahan & Kontras</h5>
                    
                    {/* Brightness */}
                    <div>
                      <div className="flex justify-between text-xs text-slate-600 mb-1">
                        <span>Kecerahan (Brightness)</span>
                        <span className="font-semibold">{imgBrightness}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="50" 
                        max="150" 
                        value={imgBrightness} 
                        onChange={(e) => setImgBrightness(parseInt(e.target.value))} 
                        className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                      />
                    </div>

                    {/* Contrast */}
                    <div>
                      <div className="flex justify-between text-xs text-slate-600 mb-1">
                        <span>Kontras (Contrast)</span>
                        <span className="font-semibold">{imgContrast}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="50" 
                        max="150" 
                        value={imgContrast} 
                        onChange={(e) => setImgContrast(parseInt(e.target.value))} 
                        className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                      />
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* TABS 2: TEXT & LAYOUT CONTROLS */}
            {activeTab === 'text' && (
              <div className="space-y-4 animate-in fade-in transition-all">
                {/* Headline input - Line 1 */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex justify-between">
                    <span>Headline Baris 1</span>
                    <span className="text-slate-400 font-normal">Maks 30 karakter</span>
                  </label>
                  <input
                    type="text"
                    value={headlineLine1}
                    onChange={(e) => setHeadlineLine1(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3.5 py-2 focus:ring-2 focus:ring-blue-500/25 focus:border-blue-600 outline-none text-slate-900"
                    placeholder="Contoh: Lorem ipsum dolor sit amet"
                  />
                </div>

                {/* Headline input - Line 2 */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex justify-between">
                    <span>Headline Baris 2 (Dalam Kurung)</span>
                    <span className="text-slate-400 font-normal">Maks 30 karakter</span>
                  </label>
                  <input
                    type="text"
                    value={headlineLine2}
                    onChange={(e) => setHeadlineLine2(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3.5 py-2 focus:ring-2 focus:ring-blue-500/25 focus:border-blue-600 outline-none text-slate-900"
                    placeholder="Contoh: (headline taruh di sini)"
                  />
                </div>

                {/* Text Source / Subtitle input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sumber Gambar (Italic Text)
                  </label>
                  <input
                    type="text"
                    value={imageSource}
                    onChange={(e) => setImageSource(e.target.value)}
                    className="w-full text-xs font-mono border border-slate-300 rounded-lg px-3.5 py-2 bg-slate-50 focus:ring-2 focus:ring-blue-500/25 focus:border-blue-600 outline-none text-slate-700"
                    placeholder="Sumber Gambar : Lorem Ipsum Dolor Sit Amet"
                  />
                </div>

                {/* Precise Size Controllers */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                    <Sliders size={14} />
                    Ukuran & Gaya Huruf
                  </h4>

                  {/* Font Size Headline */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>Ukuran Headline: <span className="font-bold text-slate-900">{headlineSize}px</span></span>
                      <button onClick={() => setHeadlineSize(32)} className="text-[10px] text-blue-600 hover:underline">Reset</button>
                    </div>
                    <input 
                      type="range" 
                      min="20" 
                      max="48" 
                      value={headlineSize} 
                      onChange={(e) => setHeadlineSize(parseInt(e.target.value))} 
                      className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                    />
                  </div>

                  {/* Font Size Image Source */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>Ukuran Sumber Gambar: <span className="font-bold text-slate-900">{sourceTextSize}px</span></span>
                      <button onClick={() => setSourceTextSize(11)} className="text-[10px] text-blue-600 hover:underline">Reset</button>
                    </div>
                    <input 
                      type="range" 
                      min="8" 
                      max="18" 
                      value={sourceTextSize} 
                      onChange={(e) => setSourceTextSize(parseInt(e.target.value))} 
                      className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                    />
                  </div>

                  {/* Headline Boldness selector */}
                  <div>
                    <span className="block text-xs font-medium text-slate-600 mb-1.5">Tingkat Ketebalan Teks (Boldness)</span>
                    <div className="grid grid-cols-3 gap-2">
                      {['font-semibold', 'font-bold', 'font-extrabold'].map((style) => (
                        <button
                          key={style}
                          onClick={() => setBoldness(style)}
                          className={`py-1.5 text-xs text-center border rounded-lg transition-all ${
                            boldness === style
                              ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-bold'
                              : 'border-slate-200 hover:border-slate-300 text-slate-600'
                          }`}
                        >
                          {style === 'font-semibold' ? 'Semibold' : style === 'font-bold' ? 'Bold' : 'Extra Bold'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TABS 3: BRAND SETUP (LOGO & COMPREHENSIVE FOOTER) */}
            {activeTab === 'brand' && (
              <div className="space-y-6 animate-in fade-in transition-all">
                
                {/* LOGO CUSTOMIZATION ACCORDION BLOCK */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b pb-1">
                    Pengaturan Logo Pojok Kiri Atas
                  </h4>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setLogoMode('system')}
                      className={`flex-1 py-1.5 px-2 text-xs border rounded-lg font-medium transition-all ${
                        logoMode === 'system'
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      Bawaan (logo.png)
                    </button>
                    <button
                      onClick={() => setLogoMode('custom')}
                      className={`flex-1 py-1.5 px-2 text-xs border rounded-lg font-medium transition-all ${
                        logoMode === 'custom'
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      Unggah Sendiri
                    </button>
                    <button
                      onClick={() => setLogoMode('fallback')}
                      className={`flex-1 py-1.5 px-2 text-xs border rounded-lg font-medium transition-all ${
                        logoMode === 'fallback'
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      Bentuk SVG
                    </button>
                  </div>

                  {logoMode === 'custom' && (
                    <div 
                      onClick={() => logoInputRef.current?.click()}
                      className="border border-dashed border-slate-300 rounded-lg p-4 text-center cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <input 
                        type="file" 
                        ref={logoInputRef} 
                        onChange={handleLogoUpload} 
                        accept="image/*" 
                        className="hidden" 
                      />
                      {logoImage ? (
                        <div className="flex items-center justify-center gap-2">
                          <img src={logoImage} alt="Logo" className="h-6 object-contain" />
                          <span className="text-xs font-medium text-blue-600 underline">Ganti</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <Upload size={14} className="text-slate-400" />
                          <span className="text-[11px] font-semibold text-slate-600">Pilih logo dari perangkat</span>
                        </div>
                      )}
                    </div>
                  )}

                  {logoMode === 'system' && (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Memuat berkas logo:</span>
                        <code className="text-[10px] text-blue-700 font-bold font-mono bg-blue-50 px-1.5 py-0.5 rounded">/logo.png</code>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Sistem akan memuat berkas logo.png secara dinamis. Jika berkas gambar belum ada, otomatis beralih ke representasi teks "DIALOGIKA" bergaya SVG.
                      </p>
                    </div>
                  )}

                  {logoMode === 'fallback' && (
                    <div className="p-3 bg-blue-50/20 rounded-lg border border-blue-100">
                      <span className="text-[10px] uppercase font-bold text-blue-800 tracking-wider">Tampilan Logo SVG Fallback:</span>
                      <div className="mt-2 text-slate-900 font-sans tracking-widest font-black text-sm flex items-center">
                        <span className="text-blue-700">DIA</span>
                        <span className="text-slate-700 ml-1">LOGIKA</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* FOOTER PILL ACCORDION BLOCK */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b pb-1">
                    Pengaturan Footer Sosmed
                  </h4>

                  <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setFooterMode('system')}
                        className={`py-1.5 px-2 text-xs border rounded-lg font-medium transition-all ${
                          footerMode === 'system'
                            ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                            : 'border-slate-200 hover:border-slate-300 text-slate-600'
                        }`}
                      >
                        Bawaan (footer.png)
                      </button>
                      <button
                        onClick={() => setFooterMode('custom')}
                        className={`py-1.5 px-2 text-xs border rounded-lg font-medium transition-all ${
                          footerMode === 'custom'
                            ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                            : 'border-slate-200 hover:border-slate-300 text-slate-600'
                        }`}
                      >
                        File Sendiri
                      </button>
                      <button
                        onClick={() => setFooterMode('dynamic')}
                        className={`py-1.5 px-2 text-xs border rounded-lg font-medium transition-all ${
                          footerMode === 'dynamic'
                            ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                            : 'border-slate-200 hover:border-slate-300 text-slate-600'
                        }`}
                      >
                        Editor Sosmed
                      </button>
                    </div>

                    {footerMode === 'custom' && (
                      <div 
                        onClick={() => footerInputRef.current?.click()}
                        className="border border-dashed border-slate-300 rounded-lg p-4 text-center cursor-pointer hover:bg-slate-50 transition-colors"
                      >
                        <input 
                          type="file" 
                          ref={footerInputRef} 
                          onChange={handleFooterUpload} 
                          accept="image/*" 
                          className="hidden" 
                        />
                        {footerImage ? (
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-xs text-emerald-600 font-bold flex items-center gap-0.5"><Check size={12} /> Gambar terpilih!</span>
                            <span className="text-xs font-medium text-blue-600 underline">Ganti</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-1">
                            <Upload size={14} className="text-slate-400" />
                            <span className="text-[11px] font-semibold text-slate-600">Pilih gambar footer dari perangkat</span>
                          </div>
                        )}
                      </div>
                    )}

                    {footerMode === 'system' && (
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Memuat berkas footer:</span>
                          <code className="text-[10px] text-blue-700 font-bold font-mono bg-blue-50 px-1.5 py-0.5 rounded">/footer.png</code>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Sistem akan memuat gambar footer.png yang sudah ditaruh. Bila gagal, otomatis merender layout lencana sosial media dinamis beresolusi tinggi.
                        </p>
                      </div>
                    )}

                    {footerMode === 'dynamic' && (
                      <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-200 space-y-2.5">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Ketik Akun Sosmed Pengguna:</span>
                        
                        {/* IG */}
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-pink-100 flex items-center justify-center text-pink-600">
                            <Instagram size={12} />
                          </div>
                          <input 
                            value={igHandle} 
                            onChange={(e) => setIgHandle(e.target.value)} 
                            className="bg-white border text-xs rounded p-1 w-full outline-none text-slate-800" 
                            placeholder="dialogika.co" 
                          />
                        </div>

                        {/* Twitter/X */}
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-slate-200 flex items-center justify-center text-slate-700">
                            <Twitter size={12} />
                          </div>
                          <input 
                            value={twHandle} 
                            onChange={(e) => setTwHandle(e.target.value)} 
                            className="bg-white border text-xs rounded p-1 w-full outline-none text-slate-800" 
                            placeholder="dialogika_co" 
                          />
                        </div>

                        {/* FB */}
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center text-blue-600">
                            <Facebook size={12} />
                          </div>
                          <input 
                            value={fbHandle} 
                            onChange={(e) => setFbHandle(e.target.value)} 
                            className="bg-white border text-xs rounded p-1 w-full outline-none text-slate-800" 
                            placeholder="dialogika.co" 
                          />
                        </div>

                        {/* Web */}
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-sky-100 flex items-center justify-center text-sky-600">
                            <Globe size={12} />
                          </div>
                          <input 
                            value={webHandle} 
                            onChange={(e) => setWebHandle(e.target.value)} 
                            className="bg-white border text-xs rounded p-1 w-full outline-none text-slate-800" 
                            placeholder="dialogika.co" 
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* TABS 4: COLOR SCHEMES & MOTIFS */}
            {activeTab === 'theme' && (
              <div className="space-y-4 animate-in fade-in transition-all">
                {/* Presets Grid */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                    Pilih Skema Warna Tema Preset
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => setSelectedPreset(preset.id)}
                        className={`p-3 rounded-xl border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                          selectedPreset === preset.id
                            ? 'border-blue-600 bg-blue-50/20 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-xs font-semibold text-slate-900">{preset.name}</span>
                        <div className="flex gap-1">
                          <span className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.skyColor }} />
                          <span className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.backHillColor }} />
                          <span className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.frontHillColor }} />
                          <span className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.headlineColor }} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3.5">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
                    <Sliders size={14} />
                    Warna Penyesuaian Manual
                  </h4>

                  {/* Sky Color Slider */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-600">Warna Langit:</span>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={skyColor} 
                        onChange={(e) => {
                          setSkyColor(e.target.value);
                          setSelectedPreset('custom');
                        }}
                        className="w-8 h-8 rounded border-none cursor-pointer"
                      />
                      <span className="text-xs font-mono">{skyColor}</span>
                    </div>
                  </div>

                  {/* Back Hill Color Slider */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-600">Gradasi Bukit Belakang:</span>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={backHillColor} 
                        onChange={(e) => {
                          setBackHillColor(e.target.value);
                          setSelectedPreset('custom');
                        }}
                        className="w-8 h-8 rounded border-none cursor-pointer"
                      />
                      <span className="text-xs font-mono">{backHillColor}</span>
                    </div>
                  </div>

                  {/* Front Hill Color Slider */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-600">Warna Bukit Depan:</span>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={frontHillColor} 
                        onChange={(e) => {
                          setFrontHillColor(e.target.value);
                          setSelectedPreset('custom');
                        }}
                        className="w-8 h-8 rounded border-none cursor-pointer"
                      />
                      <span className="text-xs font-mono">{frontHillColor}</span>
                    </div>
                  </div>

                  {/* Text alignment / customization */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-600">Warna Teks Headline:</span>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={headlineColor} 
                        onChange={(e) => {
                          setHeadlineColor(e.target.value);
                          setSelectedPreset('custom');
                        }}
                        className="w-8 h-8 rounded border-none cursor-pointer"
                      />
                      <span className="text-xs font-mono">{headlineColor}</span>
                    </div>
                  </div>

                  {/* Toggle Clouds */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-medium text-slate-600">Tampilkan Ilustrasi Awan Langit:</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={showCloud} 
                        onChange={(e) => setShowCloud(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Download Config Panel */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Kualitas Hasil Unduhan</span>
              <div className="flex border rounded-lg overflow-hidden bg-white">
                <button 
                  onClick={() => setDownloadScale(1.5)} 
                  className={`px-2 py-1 text-[10px] font-bold ${downloadScale === 1.5 ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  Standard (1.5x)
                </button>
                <button 
                  onClick={() => setDownloadScale(2.5)} 
                  className={`px-2 py-1 text-[10px] font-bold ${downloadScale === 2.5 ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  Ultra-Sharp (2.5x)
                </button>
              </div>
            </div>

            {/* Main Action Download Button */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => downloadPoster('png')}
                disabled={isDownloading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                {isDownloading ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Download size={14} />
                )}
                <span>Unduh PNG</span>
              </button>
              <button
                onClick={() => downloadPoster('jpeg')}
                disabled={isDownloading}
                className="w-full bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 text-white py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                {isDownloading ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Download size={14} />
                )}
                <span>Unduh JPEG</span>
              </button>
            </div>
            {downloadSuccessMessage && (
              <p className="text-[11px] text-emerald-600 font-semibold text-center mt-1 animate-bounce">
                {downloadSuccessMessage}
              </p>
            )}
          </div>

        </section>

        {/* RIGHT COLUMN: Real-Time 4:5 Poster Canvas (7 cols on lg) */}
        <section className="lg:col-span-7 flex flex-col items-center justify-center gap-4 bg-slate-100/60 border border-slate-200/60 rounded-2xl p-4 md:p-8 min-h-[500px] lg:sticky lg:top-[90px]">
          
          <div className="text-center mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center justify-center gap-1">
              <Eye size={12} />
              Pratinjau Hasil Desain (Interaktif)
            </span>
            <p className="text-xs text-slate-500">Silakan klik teks atau bulatan foto untuk mengedit langsung.</p>
          </div>

          {/* CHASSIS AT 4:5 PROPORTION */}
          <div className="w-full max-w-[400px] relative transition-transform duration-300">
            {/* Aspect Ratio 4:5 Container */}
            <div 
              ref={posterRef}
              id="dialogika-poster"
              className="w-full aspect-[4/5] bg-white rounded-2xl overflow-hidden shadow-2xl relative flex flex-col select-none"
              style={{ contentVisibility: 'auto' }}
            >
              
              {/* SKY LAYER BACKGROUND */}
              <div 
                className="absolute inset-x-0 top-0 h-[75%] transition-colors duration-500 flex flex-col justify-between"
                style={{
                  background: `linear-gradient(to bottom, ${skyColor}, ${skyGradientEnd})`
                }}
              >
                {/* 1. CLOUD ILLUSTRATIONS (TOP MIDDLE/RIGHT) */}
                {showCloud && (
                  <svg 
                    viewBox="0 0 200 100" 
                    className="absolute -top-1 right-0 w-[58%] h-auto opacity-95 text-white fill-current drop-shadow-sm select-none"
                    aria-hidden="true"
                  >
                    <path d="M 30 70 A 25 25 0 0 1 120 70 A 15 15 0 0 1 150 70 A 25 25 0 0 1 190 60 A 10 10 0 0 1 200 70 L 200 0 L 0 0 L 0 70 A 20 20 0 0 1 30 70 Z" />
                  </svg>
                )}

                {/* 2. BRANDING LOGO (TOP LEFT) */}
                <div 
                  onClick={() => setActiveTab('brand')}
                  className="absolute top-6 left-6 z-10 cursor-pointer hover:ring-2 hover:ring-blue-400 hover:ring-offset-2 rounded-lg p-1 transition-all group"
                  title="Klik untuk ubah logo"
                >
                  <div className="relative">
                    {/* Visual highlighter border */}
                    <div className="absolute -inset-1 border border-dashed border-blue-500 rounded-lg scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all"></div>
                    
                    {/* Actual Logo rendering with fallback */}
                    {logoMode === 'system' && !logoLoadError ? (
                      <img 
                        src={systemLogoUrl} 
                        onError={() => setLogoLoadError(true)} 
                        alt="Dialogika Brand Logo" 
                        className="h-7 w-auto object-contain select-none pointer-events-none" 
                      />
                    ) : logoMode === 'custom' && logoImage ? (
                      <img 
                        src={logoImage} 
                        alt="Custom Brand Logo" 
                        className="h-7 w-auto object-contain select-none pointer-events-none" 
                      />
                    ) : (
                      // Exquisite vector representations matching actual DIALOGIKA logo style
                      <div className="text-[#103F68] font-black text-lg tracking-widest flex items-center select-none">
                        <span className="text-[#1A6EB4] font-bold">DIA</span>
                        <span className="text-slate-800 ml-1 font-extrabold text-base">LOGIKA</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. SCENIC HILLS GRID LAYER (Separating sky from the white text section) */}
                <div className="absolute inset-x-0 bottom-0 top-[40%] select-none pointer-events-none">
                  <svg 
                    viewBox="0 0 400 240" 
                    className="w-full h-full" 
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    {/* Light Green Back Hill */}
                    <path 
                      id="back-hill"
                      d="M 0 140 C 90 90, 210 140, 400 100 L 400 240 L 0 240 Z" 
                      fill={backHillColor} 
                      className="transition-colors duration-500"
                    />
                    {/* Dark Green Front Hill */}
                    <path 
                      id="front-hill"
                      d="M 0 160 C 120 110, 260 170, 400 135 L 400 240 L 0 240 Z" 
                      fill={frontHillColor} 
                      className="transition-colors duration-500"
                    />
                  </svg>
                </div>

                {/* 4. CIRCLE PHOTO PLACEHOLDER/FRAME (ON THE BOTTOM RIGHT OVERHILL) */}
                <div 
                  onClick={() => setActiveTab('image')}
                  className="absolute right-[5%] bottom-[4%] w-[46%] aspect-square rounded-full border-[6.5px] border-white shadow-xl overflow-hidden z-20 cursor-pointer bg-sky-100/50 hover:ring-4 hover:ring-blue-400 hover:scale-[1.02] transform transition-all group"
                  title="Klik untuk unggah atau atur foto"
                >
                  {circleImage ? (
                    /* Render uploaded user image with offset, rotate, and quality filter properties active */
                    <div className="w-full h-full relative overflow-hidden" id="masked-circle-image">
                      {/* Drag icon overlay indicator */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs gap-1 z-30">
                        <Move size={16} className="animate-bounce" />
                        <span>Sesuaikan Posisi</span>
                      </div>
                      <img 
                        src={circleImage} 
                        alt="Custom circle mask portrait" 
                        className="w-full h-full object-cover transition-transform duration-100 ease-out select-none pointer-events-none"
                        style={{
                          transform: `translate(${imgX}px, ${imgY}px) scale(${imgScale}) rotate(${imgRotate}deg)`,
                          filter: `brightness(${imgBrightness}%) contrast(${imgContrast}%) grayscale(${imgGrayscale}%)`
                        }}
                      />
                    </div>
                  ) : (
                    /* Replicate the precise placeholder vectors seen in 1.png: Sky blue base, hills, and clouds! */
                    <div className="w-full h-full relative overflow-hidden bg-[#D4EFFF] flex flex-col justify-between" id="circle-placeholder-illustration">
                      {/* Tiny cloud inside placeholder circle */}
                      <svg viewBox="0 0 100 50" className="w-[45%] h-auto absolute top-[15%] left-[25%] opacity-90 text-white fill-current">
                        <path d="M 10 35 A 12 12 0 0 1 50 35 A 8 8 0 0 1 70 35 A 12 12 0 0 1 90 25 A 5 5 0 0 1 100 35 L 100 0 L 0 0 L 0 35 Q 5 35 10 35 Z" transform="scale(1, -1) translate(0, -40)" />
                      </svg>
                      
                      {/* Tiny green hills inside placeholder circle */}
                      <div className="absolute inset-x-0 bottom-0 h-[40%] select-none">
                        <svg viewBox="0 0 150 60" className="w-full h-full" preserveAspectRatio="none">
                          <path d="M 0 35 C 40 20, 80 40, 150 25 L 150 60 L 0 60 Z" fill={backHillColor} className="transition-colors duration-500" />
                          <path d="M 0 42 C 50 28, 95 48, 150 35 L 150 60 L 0 60 Z" fill={frontHillColor} className="transition-colors duration-500" />
                        </svg>
                      </div>

                      {/* Click to add helper text label overlay */}
                      <div className="absolute inset-0 bg-blue-900/10 hover:bg-blue-900/0 flex flex-col items-center justify-center p-3 text-center transition-colors">
                        <div className="bg-white/90 shadow-sm p-2 rounded-full text-blue-700 group-hover:scale-110 transition-transform mb-1">
                          <Upload size={14} />
                        </div>
                        <span className="text-[10px] font-bold text-blue-950 bg-white/70 backdrop-blur-xs px-2 py-0.5 rounded-full select-none pointer-events-none">
                          GANTI FOTO
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* LOWER WHITE WORKSPACE AREA (WHITE CARD BACKGROUND) */}
              <div className="bg-white h-[28%] px-6 pb-6 pt-5 flex flex-col justify-between items-stretch relative z-10">
                
                {/* 5. IMAGE SOURCE DESCRIPTION SUBTITLE */}
                <div 
                  onClick={() => setActiveTab('text')}
                  className="cursor-pointer hover:bg-slate-50 border border-transparent hover:border-dashed hover:border-slate-300 rounded p-0.5 transition-all w-fit"
                >
                  <p 
                    className="italic font-medium transition-colors"
                    style={{ 
                      fontSize: `${sourceTextSize}px`,
                      color: imageSourceColor
                    }}
                  >
                    {imageSource || 'Sumber Gambar : Lorem Ipsum'}
                  </p>
                </div>

                {/* 6. BIG BOLD HEADLINE (CENTRAL AT LOWER FOOT) */}
                <div 
                  onClick={() => setActiveTab('text')}
                  className="cursor-pointer hover:bg-slate-50 border border-transparent hover:border-dashed hover:border-blue-300 rounded-lg py-1 px-1.5 transition-all text-left flex-1 flex flex-col justify-center"
                >
                  <h2 
                    className={`leading-tight uppercase tracking-tight text-left transition-colors ${boldness}`}
                    style={{ 
                      fontSize: `${headlineSize}px`,
                      color: headlineColor
                    }}
                  >
                    <div>{headlineLine1 || 'Lorem ipsum dolor sit amet'}</div>
                    <div className="mt-0.5">{headlineLine2 || '(headline taruh di sini)'}</div>
                  </h2>
                </div>

                {/* 7. HIGH FIDELITY BADGE FOOTER BAR (PILL CONTAINER) */}
                <div 
                  onClick={() => setActiveTab('brand')}
                  className="mt-2.5 mx-auto w-full select-none flex justify-center cursor-pointer hover:ring-2 hover:ring-blue-400 hover:ring-offset-2 rounded-full transition-all group"
                  title="Klik untuk ubah alamat sosial media"
                >
                  {footerMode === 'system' && !footerLoadError ? (
                    <img 
                      src={systemFooterUrl} 
                      onError={() => setFooterLoadError(true)} 
                      alt="Footer Social Badges" 
                      className="h-[32px] w-auto max-w-full object-contain pointer-events-none" 
                    />
                  ) : footerMode === 'custom' && footerImage ? (
                    <img 
                      src={footerImage} 
                      alt="Custom Footer Social Badges" 
                      className="h-[32px] w-auto max-w-full object-contain pointer-events-none" 
                    />
                  ) : (
                    /* Full CSS-based rendering of the Social pill matching footer.png exactly */
                    <div className="border border-slate-300/80 bg-white rounded-full py-1.5 px-4 flex items-center justify-center gap-4 shadow-2xs hover:border-slate-400 max-w-full overflow-hidden select-none">
                      
                      {/* IG */}
                      <span className="flex items-center gap-1 text-[10px] text-[#003461] font-bold tracking-tight">
                        <Instagram size={11} className="text-blue-700 font-bold" />
                        <span>{igHandle}</span>
                      </span>

                      {/* Line divider */}
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>

                      {/* Twitter/X */}
                      <span className="flex items-center gap-1 text-[10px] text-[#003461] font-bold tracking-tight">
                        <Twitter size={11} className="text-blue-700 font-bold" />
                        <span>{twHandle}</span>
                      </span>

                      {/* Line divider */}
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>

                      {/* FB */}
                      <span className="flex items-center gap-1 text-[10px] text-[#003461] font-bold tracking-tight">
                        <Facebook size={11} className="text-blue-700 font-bold" />
                        <span>{fbHandle}</span>
                      </span>

                      {/* Line divider */}
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>

                      {/* Website */}
                      <span className="flex items-center gap-1 text-[10px] text-[#003461] font-bold tracking-tight">
                        <Globe size={11} className="text-blue-700 font-bold" />
                        <span>{webHandle}</span>
                      </span>

                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>

          {/* Quick Design Instructions */}
          <div className="max-w-[400px] w-full bg-blue-50 border border-blue-100 p-3 rounded-xl text-xs text-blue-800 flex items-start gap-2">
            <span className="p-1 bg-blue-600 text-white rounded-md shrink-0 block text-[10px] uppercase font-bold">INFO</span>
            <span className="leading-snug">
              Ingin hasil edit 100% persis ke perangkat aslinya? Unduh menggunakan tipe berkas <strong>PNG</strong> dalam pilihan <strong>Ultra-Sharp</strong> untuk mendapatkan poster beresolusi paling tajam.
            </span>
          </div>

        </section>

      </main>

      {/* Elegant minimalist footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-center text-xs text-slate-400">
        <p>© 2026 Dialogika Poster Editor. Dibuat dengan cinta menggunakan React, Tailwind CSS, dan Google AI Studio.</p>
      </footer>
    </div>
  );
}
