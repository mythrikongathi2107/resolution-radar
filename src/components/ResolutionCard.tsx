import { Trash2, Edit2, TrendingUp } from 'lucide-react';
import { Resolution } from '../lib/supabase';

interface ResolutionCardProps {
  resolution: Resolution;
  onDelete: (id: string) => void;
  onEdit: (resolution: Resolution) => void;
  onUpdateProgress: (id: string, progress: number) => void;
}

const categoryColors = {
  Health: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
  Wealth: 'from-amber-500/20 to-yellow-500/20 border-amber-500/30',
  Tech: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
  Growth: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
};

const categoryIcons = {
  Health: '🏃',
  Wealth: '💰',
  Tech: '💻',
  Growth: '🌱',
};

export function ResolutionCard({ resolution, onDelete, onEdit, onUpdateProgress }: ResolutionCardProps) {
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateProgress(resolution.id, parseInt(e.target.value));
  };

  return (
    <div
      className={`relative bg-gradient-to-br ${categoryColors[resolution.category]} backdrop-blur-xl border rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{categoryIcons[resolution.category]}</span>
          <div>
            <h3 className="text-xl font-bold text-white">{resolution.title}</h3>
            <span className="text-xs text-gray-300 uppercase tracking-wider">{resolution.category}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(resolution)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Edit resolution"
          >
            <Edit2 className="w-4 h-4 text-gray-300 hover:text-white" />
          </button>
          <button
            onClick={() => onDelete(resolution.id)}
            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
            aria-label="Delete resolution"
          >
            <Trash2 className="w-4 h-4 text-gray-300 hover:text-red-400" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-300 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            Progress
          </span>
          <span className="text-lg font-bold text-white">{resolution.progress}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={resolution.progress}
          onChange={handleProgressChange}
          className="w-full h-2 bg-gray-700/50 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>

      <div className="bg-black/20 rounded-xl p-4 backdrop-blur-sm">
        <h4 className="text-sm font-semibold text-gray-300 mb-2">Why this matters:</h4>
        <p className="text-sm text-gray-200 leading-relaxed">{resolution.why}</p>
      </div>
    </div>
  );
}
