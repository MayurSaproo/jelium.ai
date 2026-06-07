import React, { useState, useEffect } from 'react';
import { 
  Calculator, Target, CheckCircle, XCircle, Moon, Sun, 
  Mail, Phone, Info, ArrowRight, Database, Zap, Code, AlertTriangle 
} from 'lucide-react';

// --- CUSTOM LOGO COMPONENT ---
const JeLogo = () => (
  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/20 border border-cyan-400/30 transition-transform duration-300 hover:scale-105">
    <span className="text-white font-black text-xl tracking-tighter pr-0.5">Je</span>
  </div>
);

// --- THE CUSTOM EQUATION DATABASE ---
const MATH_EQUATIONS = [
  "v = u + at", 
  "s = ut + ½at²", 
  "v² = u² + 2as", 
  "PV = nRT", 
  "eⁱᶿ = cos(θ) + i sin(θ)", 
  "k = Ae⁻ᴱᵃ/ᴿᵀ"
];

// --- FLOATING BACKDROP COMPONENT ---
const FloatingBackdrop = () => {
  const allEquations = [
    ...MATH_EQUATIONS, 
    "E = mc²", "F = ma", "ΔxΔp ≥ h/4π", "x = (-b ± √(b²-4ac))/2a", "A = πr²", "c² = a² + b²"
  ];

  return (
    // Lowered opacity slightly but used a brighter color (cyan-200) so it looks like light floating in the dark
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none opacity-20">
      {allEquations.map((eq, index) => {
        const duration = 15 + Math.random() * 25; 
        const size = Math.random() < 0.5 ? 'text-sm' : 'text-base'; 
        const yPos = 5 + Math.random() * 90; 
        const delay = Math.random() * -duration; 

        return (
          <div 
            key={index}
            className={`absolute font-mono font-bold whitespace-nowrap text-cyan-200 animate-float ${size}`}
            style={{ 
              top: `${yPos}%`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          >
            {eq}
          </div>
        );
      })}
    </div>
  );
};

export default function JeliumApp() {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState('LANDING'); 
  const [darkMode, setDarkMode] = useState(true); 
  
  const [formData, setFormData] = useState({
    Category: 'General',
    Physics: 50,
    Chemistry: 50,
    Math: 50
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  // Loading & Animation States
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("");
  const [currentEquation, setCurrentEquation] = useState(MATH_EQUATIONS[0]);
  const [isFading, setIsFading] = useState(false); 

  // --- HIGH-SPEED SMOOTH MATH ANIMATION HOOK ---
  useEffect(() => {
    let interval;
    let timeout;

    if (loading) {
      interval = setInterval(() => {
        setIsFading(true); 
        
        timeout = setTimeout(() => {
          setCurrentEquation((prevEq) => {
            const currentIndex = MATH_EQUATIONS.indexOf(prevEq);
            const nextIndex = (currentIndex + 1) % MATH_EQUATIONS.length;
            return MATH_EQUATIONS[nextIndex];
          });
          setIsFading(false); 
        }, 300); 
        
      }, 800);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      setIsFading(false);
    };
  }, [loading]);

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'Category' ? value : Number(value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setProgress(0);

    const phases = [
      { text: "INITIALIZING JELIUM ENGINE...", val: 15, delay: 0 },
      { text: "MAPPING SUBJECT PERCENTILES...", val: 45, delay: 700 },
      { text: "CROSS-REFERENCING HISTORICAL CUTOFFS...", val: 75, delay: 1400 },
      { text: "COMPUTING FINAL PROBABILITY MATRIX...", val: 95, delay: 2100 }
    ];

    phases.forEach((phase) => {
      setTimeout(() => {
        setProgress(phase.val);
        setLoadingText(phase.text);
      }, phase.delay);
    });

    setTimeout(async () => {
      try {
        const response = await fetch('https://jelium-ai.onrender.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Failed to connect to the backend server.');

        const data = await response.json();
        setProgress(100);
        setLoadingText("ANALYSIS COMPLETE");
        
        setTimeout(() => {
          setResult(data);
          setLoading(false);
        }, 600); 
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }, 3200);
  };

  // --- THEME CLASSES ---
  // Changed bg-slate-950 to bg-black for pure black aesthetics.
  const bgMain = darkMode ? "bg-black" : "bg-slate-50";
  // Used zinc for a more neutral dark card color on pure black
  const bgCard = darkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-slate-200";
  const textPrimary = darkMode ? "text-white" : "text-slate-900";
  const textSecondary = darkMode ? "text-zinc-400" : "text-slate-500";
  const inputBg = darkMode ? "bg-black border-zinc-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900";

  return (
    <div className={`min-h-screen transition-colors duration-300 ${bgMain} ${textPrimary} font-sans flex flex-col`}>
      
      {/* --- NAVBAR --- */}
      <nav className={`w-full border-b backdrop-blur-md sticky top-0 z-50 ${darkMode ? 'border-zinc-800/50 bg-black/80' : 'border-slate-200 bg-white/80'}`}>
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('LANDING')}>
            <JeLogo />
            {/* Removed group-hover gradient shifts, replaced with sleek cyan-to-indigo gradient */}
            <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-500">
              Jelium.ai
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 font-medium">
            {['MAIN', 'ABOUT', 'CONTACT'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`transition-colors duration-200 tracking-wide text-sm ${activeTab === tab ? 'text-cyan-400 font-bold' : `${textSecondary} hover:text-cyan-300`}`}
              >
                {tab === 'MAIN' ? 'PREDICTOR' : tab}
              </button>
            ))}
            
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full transition-colors ${darkMode ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-slate-100 hover:bg-slate-200'}`}
            >
              {darkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-slate-600" />}
            </button>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 relative">
        
        {/* TAB: LANDING PAGE */}
        {activeTab === 'LANDING' && (
          <div className="max-w-5xl w-full flex flex-col items-center justify-center text-center py-10 animate-in fade-in zoom-in-95 duration-700 relative">
            
            {/* FLOATING MATH BACKDROP */}
            <FloatingBackdrop />

            <div className="mb-16 max-w-3xl relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm font-semibold tracking-widest mb-6 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                NEXT-GEN EXAM ANALYTICS
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight drop-shadow-sm">
                Stop Guessing. <br/>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600">
                  Start Predicting.
                </span>
              </h1>
              <p className={`text-xl md:text-2xl mb-10 ${textSecondary} leading-relaxed`}>
                Jelium.ai uses machine learning trained on 15 years of official NTA data to calculate your exact probability of clearing the JEE Advanced cutoff.
              </p>
              <button 
                onClick={() => setActiveTab('MAIN')}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 hover:from-cyan-400 hover:to-indigo-500 hover:scale-105 shadow-xl shadow-cyan-500/20"
              >
                Launch Predictor
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-16 relative z-10">
              <div className={`p-8 rounded-2xl border ${bgCard} text-left hover:border-cyan-500/50 transition-colors group backdrop-blur-sm bg-opacity-90`}>
                <Database className="h-10 w-10 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2">Historically Anchored</h3>
                <p className={textSecondary}>Not just mock formulas. We mapped exact raw marks to percentiles spanning over a decade of official cutoffs.</p>
              </div>
              <div className={`p-8 rounded-2xl border ${bgCard} text-left hover:border-indigo-500/50 transition-colors group backdrop-blur-sm bg-opacity-90`}>
                <Calculator className="h-10 w-10 text-indigo-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2">Machine Learning</h3>
                <p className={textSecondary}>Powered by a Logistic Regression model that understands the shifting dynamics between Physics, Chem, and Math.</p>
              </div>
              <div className={`p-8 rounded-2xl border ${bgCard} text-left hover:border-purple-500/50 transition-colors group backdrop-blur-sm bg-opacity-90`}>
                <Zap className="h-10 w-10 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2">Instant Analytics</h3>
                <p className={textSecondary}>Adjust your expected marks and watch your confidence score update in real-time through our FastAPI backend.</p>
              </div>
            </div>
            
            <div className="flex flex-col items-center relative z-10">
               <p className={`text-sm font-semibold tracking-widest uppercase mb-4 ${textSecondary}`}>Powered By</p>
               <div className="flex flex-wrap justify-center gap-4 mb-10">
                 {['React 18', 'Tailwind CSS', 'FastAPI', 'Scikit-Learn', 'Pandas'].map((tech) => (
                   <span key={tech} className={`px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
                     <Code className="h-4 w-4 opacity-50" /> {tech}
                   </span>
                 ))}
               </div>
               
               <div className={`flex items-center gap-2 text-sm uppercase tracking-wide opacity-60 ${textSecondary}`}>
                 <AlertTriangle className="h-4 w-4" />
                 <p>Disclaimer: AI predictions may not be 100% accurate.</p>
               </div>
            </div>
          </div>
        )}

        {/* TAB: MAIN (The Predictor) */}
        {activeTab === 'MAIN' && (
          <div className="flex flex-col items-center w-full animate-in slide-in-from-right-8 duration-500">
            <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              
              {/* INPUT FORM */}
              <div className={`p-8 rounded-2xl shadow-xl border ${bgCard} relative overflow-hidden`}>
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <JeLogo />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">Jelium Engine</h1>
                  <p className={`${textSecondary} mb-8`}>Enter your expected marks out of 100 to determine your probability of qualifying.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Reservation Category</label>
                    <select name="Category" value={formData.Category} onChange={handleChange} className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-cyan-500 outline-none transition-all ${inputBg}`}>
                      <option value="General">General</option>
                      <option value="EWS">EWS</option>
                      <option value="OBC">OBC-NCL</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                    </select>
                  </div>

                  {['Physics', 'Chemistry', 'Math'].map((subject) => (
                    <div key={subject} className="group">
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-semibold group-hover:text-cyan-400 transition-colors">{subject} Marks</label>
                        <span className={`text-sm font-mono font-bold ${textSecondary} group-hover:text-cyan-400 transition-colors`}>{formData[subject]} / 100</span>
                      </div>
                      <input 
                        type="range" name={subject} min="-10" max="100" 
                        value={formData[subject]} onChange={handleChange}
                        className="w-full accent-cyan-500 cursor-pointer h-2 bg-zinc-800 rounded-lg appearance-none"
                      />
                    </div>
                  ))}

                  <button 
                    type="submit" disabled={loading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold py-4 px-4 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2 mt-4"
                  >
                    <Calculator className="h-5 w-5" /> Calculate Probability
                  </button>
                </form>
              </div>

              {/* RESULTS / LOADING DISPLAY */}
              <div className={`p-8 rounded-2xl border flex flex-col justify-center items-center text-center ${bgCard}`}>
                
                {/* IDLE STATE */}
                {!loading && !result && !error && (
                  <div className={`flex flex-col items-center ${textSecondary} animate-in fade-in duration-500`}>
                    <Target className="h-20 w-20 mb-6 opacity-20" />
                    <p className="text-lg font-medium">System Standby.</p>
                    <p className="text-sm opacity-60 mt-2">Awaiting parameters for analysis.</p>
                  </div>
                )}

                {/* PURE EQUATION LOADING UI - BRIGHTENED TEXT */}
                {loading && (
                  <div className="w-full flex flex-col items-center justify-center space-y-12 animate-in fade-in duration-300 h-full">
                    
                    {/* Floating, Fading Equation Only */}
                    <div className="h-24 flex items-center justify-center w-full overflow-hidden">
                      <p className={`font-mono text-xl md:text-2xl font-black text-cyan-300 tracking-widest transition-opacity duration-300 ease-in-out px-4 text-center drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] ${isFading ? 'opacity-0' : 'opacity-100'}`}>
                        {currentEquation}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full max-w-xs space-y-3">
                      <div className="flex justify-between items-end">
                        <span className={`font-mono text-xs tracking-wider ${textSecondary}`}>{loadingText}</span>
                        <span className="font-mono text-sm font-bold text-cyan-400">{progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 transition-all duration-300 ease-out relative"
                          style={{ width: `${progress}%` }}
                        >
                          <div className="absolute top-0 left-0 bottom-0 w-full bg-white/20 animate-pulse"></div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* ERROR STATE */}
                {error && !loading && (
                  <div className="text-red-500 bg-red-500/10 p-6 rounded-xl w-full border border-red-500/20 animate-in shake duration-300">
                    <XCircle className="h-10 w-10 mx-auto mb-3" />
                    <p className="font-bold text-lg mb-1">Neural Link Failed</p>
                    <p className="text-sm opacity-80">{error}</p>
                  </div>
                )}

                {/* RESULT STATE */}
                {result && !loading && (
                  <div className="w-full space-y-8 animate-in zoom-in-95 duration-500">
                    <div className={`p-6 rounded-xl border flex flex-col items-center gap-3 relative overflow-hidden ${result.qualified ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl opacity-20 ${result.qualified ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                      {result.qualified ? <CheckCircle className="h-12 w-12 relative z-10" /> : <XCircle className="h-12 w-12 relative z-10" />}
                      <h2 className="text-3xl font-extrabold tracking-tight relative z-10">{result.message}</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className={`p-6 rounded-xl border relative overflow-hidden group hover:border-cyan-500/30 transition-colors ${bgCard}`}>
                         <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${textSecondary}`}>Total Marks</p>
                         <p className="text-4xl font-black">{result.total_marks}<span className="text-lg font-medium opacity-50">/300</span></p>
                       </div>
                       <div className={`p-6 rounded-xl border relative overflow-hidden group hover:border-cyan-500/30 transition-colors ${bgCard}`}>
                         <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${textSecondary}`}>Confidence</p>
                         <p className="text-4xl font-black">{result.probability}%</p>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB: ABOUT */}
        {activeTab === 'ABOUT' && (
          <div className={`max-w-3xl w-full p-10 rounded-2xl shadow-xl border animate-in slide-in-from-bottom-8 duration-500 ${bgCard}`}>
            <h2 className="text-4xl font-extrabold mb-6 flex items-center gap-3"><Info className="text-cyan-400 h-10 w-10" /> About Jelium.ai</h2>
            <div className={`space-y-6 text-lg leading-relaxed ${textSecondary}`}>
              <p><strong className={textPrimary}>Jelium.ai</strong> was engineered to bring clarity to one of the most stressful phases of a student's life: the JEE examinations.</p>
              <p>Unlike basic calculators that just add your marks together, our platform is powered by a custom <strong className={textPrimary}>Machine Learning Classifier</strong>. The AI was trained on a mathematically exact dataset generated from 15 years of historical NTA cutoffs.</p>
            </div>
          </div>
        )}

        {/* TAB: CONTACT */}
        {activeTab === 'CONTACT' && (
          <div className={`max-w-2xl w-full p-10 rounded-2xl shadow-xl border text-center animate-in slide-in-from-bottom-8 duration-500 ${bgCard}`}>
            <h2 className="text-4xl font-extrabold mb-4">Get in Touch</h2>
            <p className={`${textSecondary} mb-10 text-lg`}>Have questions about the algorithm, or want to collaborate? Reach out directly.</p>
            <div className="space-y-4">
              <a href="mailto:mayursaproo1111@gmail.com?subject=Inquiry%20Regarding%20Jelium.ai" className={`flex items-center justify-center gap-4 p-5 rounded-xl border transition-all duration-300 hover:border-cyan-500 hover:shadow-lg ${bgCard}`}>
                <Mail className="h-6 w-6 text-cyan-400" />
                <span className="text-xl font-medium tracking-wide">mayursaproo1111@gmail.com</span>
              </a>
              <a href="tel:+916006803075" className={`flex items-center justify-center gap-4 p-5 rounded-xl border transition-all duration-300 hover:border-cyan-500 hover:shadow-lg ${bgCard}`}>
                <Phone className="h-6 w-6 text-cyan-400" />
                <span className="text-xl font-medium tracking-wide">+91 60068 03075</span>
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}