import { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { Resolution } from '../lib/supabase';

interface ResolutionFormProps {
  onClose: () => void;
  onSubmit: (data: Omit<Resolution, 'id' | 'created_at' | 'updated_at'>) => void;
  editingResolution?: Resolution | null;
}

export function ResolutionForm({ onClose, onSubmit, editingResolution }: ResolutionFormProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Health' | 'Wealth' | 'Tech' | 'Growth'>('Health');
  const [progress, setProgress] = useState(0);
  const [why, setWhy] = useState('');

  useEffect(() => {
    if (editingResolution) {
      setTitle(editingResolution.title);
      setCategory(editingResolution.category);
      setProgress(editingResolution.progress);
      setWhy(editingResolution.why);
    }
  }, [editingResolution]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, category, progress, why });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-2xl p-8 max-w-lg w-full shadow-2xl backdrop-blur-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Plus className="w-6 h-6" />
            {editingResolution ? 'Edit Resolution' : 'New Resolution'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close form"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g., Run a marathon"
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all"
            >
              <option value="Health">🏃 Health</option>
              <option value="Wealth">💰 Wealth</option>
              <option value="Tech">💻 Tech</option>
              <option value="Growth">🌱 Growth</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Initial Progress: {progress}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700/50 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Why this matters to you
            </label>
            <textarea
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              required
              placeholder="Share your motivation and why this resolution is important..."
              rows={4}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-700/50 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl font-medium shadow-lg shadow-cyan-500/30 transition-all"
            >
              {editingResolution ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
