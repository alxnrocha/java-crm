import React, { useState, useEffect } from 'react';
import { ShieldCheck, GitBranch, X, ExternalLink } from 'lucide-react';

interface ProjectBadgeProps {
  projectName?: string;
  projectUrl?: string;
  description?: string;
  authorName?: string;
  authorHandle?: string;
  githubUrl?: string;
}

export const ProjectBadge: React.FC<ProjectBadgeProps> = ({
  projectName = 'ContractPulse CRM',
  projectUrl = 'https://alxnrocha.github.io/java-crm/',
  description = 'Gestão de Contratos B2B & Revenue Operations',
  authorName = 'Alexandre Rocha',
  authorHandle = '@alxnrocha',
  githubUrl = 'https://github.com/alxnrocha',
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (!isVisible) {
      timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Informações do Projeto"
      className="fixed bottom-4 left-4 z-50 max-w-[340px] w-[calc(100vw-2rem)] bg-[#0d1117] border border-[#30363d] rounded-xl p-4 shadow-2xl text-slate-100 font-sans animate-in fade-in slide-in-from-bottom-3 duration-300 select-none text-left"
    >
      {/* Header Row: Title + Author Tag with GitHub Link + Close Button */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h2 className="text-sm font-bold text-white tracking-tight leading-tight truncate">
          {projectName}
        </h2>

        <div className="flex items-center gap-1.5 shrink-0">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#238636] hover:bg-[#2ea043] text-white text-[10px] font-extrabold tracking-wide transition-colors shadow-xs"
            title="Ver perfil de Alexandre Rocha no GitHub"
          >
            <ShieldCheck className="w-3 h-3 text-white" />
            <span>{authorHandle}</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-80" />
          </a>
          <button
            onClick={handleClose}
            className="p-0.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
            title="Fechar (retorna em 5s)"
            aria-label="Fechar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* URL Link */}
      <div className="mb-2">
        <a
          href={projectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#58a6ff] hover:underline font-mono break-all line-clamp-1 block"
        >
          {projectUrl}
        </a>
      </div>

      {/* Description / Developer */}
      <p className="text-[11px] text-[#8b949e] leading-relaxed mb-3">
        {description} • Desenvolvido por{' '}
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-200 font-semibold hover:text-white hover:underline"
        >
          {authorName}
        </a>
      </p>

      {/* Footer Status Bar */}
      <footer className="pt-2 border-t border-[#21262d] flex items-center justify-between text-[10px] text-[#8b949e]">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-bold text-[#3fb950]">
            <span className="w-2 h-2 rounded-full bg-[#238636] inline-block animate-pulse" />
            ATIVO
          </span>
          <span className="text-slate-600">|</span>
          <span className="inline-flex items-center gap-0.5 text-slate-300 font-mono">
            <GitBranch className="w-3 h-3 text-slate-400" />
            main
          </span>
        </div>
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-[#58a6ff] hover:underline font-mono"
        >
          github.com/alxnrocha
        </a>
      </footer>
    </aside>
  );
};
