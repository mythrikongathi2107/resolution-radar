import { useState, useEffect } from 'react';
import { Plus, Sparkles, Target } from 'lucide-react';
import { supabase, Resolution } from './lib/supabase';
import { ResolutionCard } from './components/ResolutionCard';
import { ResolutionForm } from './components/ResolutionForm';

function App() {
  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingResolution, setEditingResolution] = useState<Resolution | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResolutions();
  }, []);

  const fetchResolutions = async () => {
    try {
      const { data, error } = await supabase
        .from('resolutions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResolutions(data || []);
    } catch (error) {
      console.error('Error fetching resolutions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (data: Omit<Resolution, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingResolution) {
        const { error } = await supabase
          .from('resolutions')
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq('id', editingResolution.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('resolutions')
          .insert([data]);

        if (error) throw error;
      }

      fetchResolutions();
      setEditingResolution(null);
    } catch (error) {
      console.error('Error saving resolution:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('resolutions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchResolutions();
    } catch (error) {
      console.error('Error deleting resolution:', error);
    }
  };

  const handleEdit = (resolution: Resolution) => {
    setEditingResolution(resolution);
    setIsFormOpen(true);
  };

  const handleUpdateProgress = async (id: string, progress: number) => {
    try {
      const { error } = await supabase
        .from('resolutions')
        .update({ progress, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setResolutions(prev =>
        prev.map(r => r.id === id ? { ...r, progress } : r)
      );
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const openNewForm = () => {
    setEditingResolution(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingResolution(null);
  };

  const stats = {
    total: resolutions.length,
    avgProgress: resolutions.length > 0
      ? Math.round(resolutions.reduce((acc, r) => acc + r.progress, 0) / resolutions.length)
      : 0,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl backdrop-blur-xl border border-cyan-500/30">
                <Target className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Resolution Radar 2026
                </h1>
                <p className="text-gray-400 mt-1">Track your journey to greatness</p>
              </div>
            </div>
            <button
              onClick={openNewForm}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl font-medium shadow-lg shadow-cyan-500/30 transition-all hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">New Resolution</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                <Sparkles className="w-4 h-4" />
                Total Resolutions
              </div>
              <div className="text-3xl font-bold">{stats.total}</div>
            </div>
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                <Target className="w-4 h-4" />
                Avg Progress
              </div>
              <div className="text-3xl font-bold">{stats.avgProgress}%</div>
            </div>
          </div>
        </header>

        {resolutions.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-full mb-6">
              <Target className="w-16 h-16 text-gray-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-300 mb-2">No resolutions yet</h3>
            <p className="text-gray-500 mb-6">Start your journey by creating your first resolution</p>
            <button
              onClick={openNewForm}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl font-medium shadow-lg shadow-cyan-500/30 transition-all hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Create First Resolution
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resolutions.map((resolution) => (
              <ResolutionCard
                key={resolution.id}
                resolution={resolution}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onUpdateProgress={handleUpdateProgress}
              />
            ))}
          </div>
        )}

        {isFormOpen && (
          <ResolutionForm
            onClose={closeForm}
            onSubmit={handleCreateOrUpdate}
            editingResolution={editingResolution}
          />
        )}
      </div>
    </div>
  );
}

export default App;
