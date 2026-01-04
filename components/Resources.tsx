
import React, { useState } from 'react';
import { Resource, ResourceType } from '../types';
import { Search, FileText, Video, Link as LinkIcon, Plus, Calendar, Tag, MoreVertical, Trash2, Edit2, UploadCloud, Database } from 'lucide-react';

interface ResourcesProps {
  resources: Resource[];
  onAddResource: (resource: Resource) => void;
  onDeleteResource: (id: string) => void;
  onAction: (message: string, type: 'success' | 'info' | 'error') => void;
}

const Resources: React.FC<ResourcesProps> = ({ resources, onAddResource, onDeleteResource, onAction }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<ResourceType | 'All'>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newType, setNewType] = useState<ResourceType>('File');
  const [newWeek, setNewWeek] = useState<number | ''>('');
  const [newUrl, setNewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const filteredResources = resources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.tags.some(t => t.includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'All' || r.type === filterType;
    return matchesSearch && matchesType;
  });

  const getIcon = (type: ResourceType) => {
    switch (type) {
        case 'File': return <FileText className="w-5 h-5 text-blue-500" />;
        case 'Video': return <Video className="w-5 h-5 text-purple-500" />;
        case 'Link': return <LinkIcon className="w-5 h-5 text-indigo-500" />;
    }
  };

  const simulateFileUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
        setIsUploading(false);
        if (!newTitle) setNewTitle("Week_8_Guide_v2.pdf");
        onAction("File uploaded successfully", "success");
    }, 1500);
  };

  const handleConnectDrive = () => {
      onAction("Connected to Google Drive", "info");
      if (!newTitle) setNewTitle("Shared_Drive_Doc_Final");
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newResource: Resource = {
        id: `res-${Date.now()}`,
        title: newTitle,
        description: newDescription,
        type: newType,
        url: newType === 'Link' ? newUrl : '#',
        assignedWeek: newWeek === '' ? null : Number(newWeek),
        tags: ['new'],
        uploadDate: new Date().toISOString().split('T')[0]
    };
    onAddResource(newResource);
    onAction(`Added resource: ${newTitle}`, 'success');
    setIsAddModalOpen(false);
    
    // Reset Form
    setNewTitle('');
    setNewDescription('');
    setNewType('File');
    setNewWeek('');
    setNewUrl('');
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
       <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Learning Resources</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage learning tracks, files, and scheduling.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
            <Plus className="w-4 h-4" />
            Add Resource
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search resources..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
            className="p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-700 dark:text-white"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as ResourceType | 'All')}
        >
            <option value="All">All Types</option>
            <option value="File">File</option>
            <option value="Video">Video</option>
            <option value="Link">Link</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 overflow-y-auto custom-scrollbar pb-10">
        {filteredResources.map(resource => (
            <div key={resource.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 flex flex-col group hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
                <div className="flex justify-between items-start mb-3">
                    <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                        {getIcon(resource.type)}
                    </div>
                    <div className="relative group/menu">
                        <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                            <MoreVertical className="w-4 h-4" />
                        </button>
                        <div className="absolute right-0 top-6 w-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg hidden group-hover/menu:block z-10">
                            <button className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                <Edit2 className="w-3 h-3" /> Edit
                            </button>
                            <button 
                                onClick={() => onDeleteResource(resource.id)}
                                className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                            >
                                <Trash2 className="w-3 h-3" /> Delete
                            </button>
                        </div>
                    </div>
                </div>
                
                <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1 mb-1">{resource.title}</h3>
                {resource.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 h-8">{resource.description}</p>
                )}
                
                <div className="mt-auto space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Calendar className="w-3 h-3" />
                        {resource.assignedWeek ? `Scheduled: Week ${resource.assignedWeek}` : 'General Library'}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {resource.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-[10px] text-slate-600 dark:text-slate-300 flex items-center gap-1">
                                <Tag className="w-3 h-3 opacity-50" /> {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        ))}
      </div>

      {/* Add Resource Modal */}
      {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800 overflow-y-auto max-h-[90vh]">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Add Resource</h2>
                  <form onSubmit={handleAddSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
                            <select 
                                className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                                value={newType}
                                onChange={e => setNewType(e.target.value as ResourceType)}
                            >
                                <option value="File">File (PDF/Doc)</option>
                                <option value="Video">Video</option>
                                <option value="Link">Web Link</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Schedule (Week)</label>
                            <input 
                                type="number" 
                                min="1" 
                                max="12"
                                placeholder="Optional"
                                className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-transparent dark:text-white"
                                value={newWeek}
                                onChange={e => setNewWeek(e.target.value ? Number(e.target.value) : '')}
                            />
                        </div>
                      </div>

                      {/* Dynamic Input Section */}
                      {newType === 'Link' ? (
                          <div>
                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">URL</label>
                              <input 
                                type="url" 
                                placeholder="https://"
                                className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-transparent dark:text-white"
                                value={newUrl}
                                onChange={e => setNewUrl(e.target.value)}
                                required
                              />
                          </div>
                      ) : (
                          <div className="space-y-3">
                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Upload Content</label>
                              <div className="grid grid-cols-2 gap-3">
                                  <div 
                                      onClick={simulateFileUpload}
                                      className={`border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors flex flex-col items-center justify-center gap-2 ${isUploading ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
                                  >
                                      {isUploading ? (
                                          <span className="text-xs text-indigo-600 animate-pulse">Uploading...</span>
                                      ) : (
                                          <>
                                              <UploadCloud className="w-6 h-6 text-slate-400" />
                                              <span className="text-xs text-slate-500">Upload from Device</span>
                                          </>
                                      )}
                                  </div>
                                  <div 
                                      onClick={handleConnectDrive}
                                      className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 text-center cursor-pointer hover:border-green-500 dark:hover:border-green-500 transition-colors flex flex-col items-center justify-center gap-2"
                                  >
                                      <Database className="w-6 h-6 text-slate-400" />
                                      <span className="text-xs text-slate-500">Connect Google Drive</span>
                                  </div>
                              </div>
                          </div>
                      )}

                      <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                          <input 
                            type="text" 
                            required
                            placeholder={newType === 'File' ? 'Auto-filled after upload or type manually' : 'Resource Title'}
                            className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-transparent dark:text-white" 
                            value={newTitle}
                            onChange={e => setNewTitle(e.target.value)}
                          />
                      </div>

                      <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description (Optional)</label>
                          <textarea 
                            rows={3}
                            placeholder="Briefly describe this resource..."
                            className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-transparent dark:text-white resize-none" 
                            value={newDescription}
                            onChange={e => setNewDescription(e.target.value)}
                          />
                      </div>

                      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                          <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm">Cancel</button>
                          <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium">Save Resource</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default Resources;
