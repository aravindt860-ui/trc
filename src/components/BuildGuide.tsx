import React, { useState } from 'react';
import { 
  Terminal, Play, Cpu, ShieldCheck, Download, Smartphone, 
  HelpCircle, Copy, CheckCircle, Info, FileText
} from 'lucide-react';

export default function BuildGuide() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  const steps = [
    {
      title: 'Prerequisites',
      p1: 'Ensure you have NodeJS (v18+) and Android Studio installed on your developer machine.',
      command: 'node -v\njavac -version',
      notes: 'Make sure Android SDK is added to your local user system path.'
    },
    {
      title: 'Install Capacitor Dependencies',
      p1: 'Add the main Android native build libraries to the project root directory.',
      command: 'npm install @capacitor/core @capacitor/android\nnpm install -D @capacitor/cli',
      notes: 'This hooks the web frontend wrapper securely into Android frame.'
    },
    {
      title: 'Initialize & Register the App',
      p1: 'Provide app bundle identification details for the Android compilation engine.',
      command: 'npx cap init "The Right Choice" "com.trc_guesthouse.app" --web-dir=dist',
      notes: 'This syncs app attributes directly into Android manifest configurations.'
    },
    {
      title: 'Build the React Static Web Assets',
      p1: 'Run the production compiler to generate bundled SPA assets inside the "dist" folder.',
      command: 'npm run build',
      notes: 'Capacitor gathers assets from "dist/" to flash into native assets.'
    },
    {
      title: 'Create and Mount Android Project',
      p1: 'Synthesize native Android Studio directory configurations inside workspace.',
      command: 'npx cap add android\nnpx cap sync android',
      notes: 'This automatically links plugins, Gradle packages, and launcher icon assets.'
    },
    {
      title: 'Compile into APK file',
      p1: 'Trigger direct packaging wrapper or launch Android Studio workspace directly.',
      command: 'npx cap open android',
      notes: 'Press "Build -> Build Bundle(s) / APK(s) -> Build APK" in Android Studio to output com.trc_guesthouse.app.apk!'
    }
  ];

  return (
    <div className="p-4 md:p-6 w-full max-w-4xl mx-auto space-y-6 animate-fadeIn select-none font-sans text-slate-800">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
          <Terminal className="text-sky-600 w-6 h-6" /> APK Native Compilation Studio
        </h2>
        <p className="text-xs text-slate-500 font-medium font-sans mt-0.5">
          Step-by-step instructions to export and package "The Right Choice" into an installable Android APK file.
        </p>
      </div>

      {/* Hero card */}
      <div className="bg-gradient-to-r from-sky-500 to-sky-700 rounded-3xl text-white p-5 sm:p-6.5 shadow-lg select-text relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 opacity-10">
          <Smartphone className="w-56 h-56" />
        </div>
        <div className="relative space-y-3.5">
          <span className="text-[10px] font-black tracking-widest bg-sky-400/35 px-3 py-1 rounded-full uppercase">
            NATIVE DESKTOP BUILD PACKS
          </span>
          <h3 className="text-lg font-extrabold tracking-tight">
            100% Capacitor Support Initialized
          </h3>
          <p className="text-xs text-sky-100 leading-relaxed max-w-xl">
            We have already generated the necessary <code className="bg-sky-850/50 px-1 py-0.5 rounded font-mono font-bold">capacitor.config.ts</code> configuration file in this repository. You can download this project's ZIP, run the terminal steps on your local machine, and output an installable Android APK within minutes.
          </p>
        </div>
      </div>

      {/* Steps breakdown list representation */}
      <div className="space-y-4">
        {steps.map((step, i) => (
          <div key={i} className="bg-white rounded-2xl border border-sky-100/60 p-4.5 sm:p-5 shadow-sm space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center text-xs font-black shrink-0 border border-sky-100 mt-0.5">
                {i + 1}
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-800">{step.title}</h4>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{step.p1}</p>
              </div>
            </div>

            {/* Simulated Terminal command block with Copy button */}
            <div className="relative bg-slate-900 rounded-xl p-3.5 pr-12 font-mono text-xs text-slate-300 select-text overflow-x-auto border border-slate-800 shadow-inner">
              <pre className="text-sky-350">{step.command}</pre>
              <button
                type="button"
                onClick={() => copyToClipboard(step.command, i)}
                className="absolute right-2 top-2 p-1.5 hover:bg-slate-850 text-slate-400 hover:text-white rounded-lg transition"
                title="Copy commands"
              >
                {copiedIndex === i ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Technical note */}
            <div className="flex items-center gap-1.5 text-[10px] text-slate-450 italic font-medium pl-1.5">
              <Info className="w-3.5 h-3.5 text-sky-500" />
              <span>{step.notes}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
