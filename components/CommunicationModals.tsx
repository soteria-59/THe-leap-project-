
import React, { useState, useEffect } from 'react';
import { X, Paperclip, Link as LinkIcon, Image, Bold, Italic, List, Send, Smartphone, Mail, ChevronDown, Users, CheckCircle2, FileText, Upload, BookOpen } from 'lucide-react';
import { Participant, Resource } from '../types';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipients: Participant[];
  onSend: (subject: string, body: string, attachments: Resource[]) => void;
  availableResources: Resource[];
}

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipients: Participant[];
  onSend: (message: string, attachments: Resource[]) => void;
  availableResources: Resource[];
}

const AttachmentPicker: React.FC<{ 
    isOpen: boolean, 
    onClose: () => void, 
    resources: Resource[], 
    onSelect: (r: Resource) => void,
    onUpload: () => void 
}> = ({ isOpen, onClose, resources, onSelect, onUpload }) => {
    if (!isOpen) return null;
    return (
        <div className="absolute bottom-14 left-4 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-2 w-64 z-50 animate-in slide-in-from-bottom-2">
            <div className="text-xs font-semibold text-slate-500 px-2 py-1 mb-1">Attach from...</div>
            <button onClick={onUpload} className="w-full text-left px-2 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Upload className="w-4 h-4" /> Upload from Device
            </button>
            <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
            <div className="max-h-40 overflow-y-auto custom-scrollbar">
                {resources.length === 0 && <p className="text-xs text-center py-2 text-slate-400">No system resources</p>}
                {resources.map(r => (
                    <button key={r.id} onClick={() => onSelect(r)} className="w-full text-left px-2 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <BookOpen className="w-4 h-4 text-indigo-500 shrink-0" /> <span className="truncate">{r.title}</span>
                    </button>
                ))}
            </div>
            {/* Close overlay */}
            <div className="fixed inset-0 z-[-1]" onClick={onClose}></div>
        </div>
    );
};

export const EmailComposeModal: React.FC<EmailModalProps> = ({ isOpen, onClose, recipients, onSend, availableResources }) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [attachments, setAttachments] = useState<Resource[]>([]);
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setSubject('');
      setBody('');
      setAttachments([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isBulk = recipients.length > 1;
  const toDisplay = isBulk 
    ? `${recipients.length} recipients (BCC)` 
    : recipients[0]?.email || '';

  const handleSend = () => {
    onSend(subject, body, attachments);
    onClose();
  };

  const handleSystemResourceSelect = (r: Resource) => {
    setAttachments(prev => [...prev, r]);
    setShowAttachMenu(false);
  };

  const handleDeviceUpload = () => {
    // Simulating upload
    const mockFile: Resource = {
        id: `temp-${Date.now()}`,
        title: "Uploaded_Document.pdf",
        type: 'File',
        url: '#',
        assignedWeek: null,
        tags: [],
        uploadDate: new Date().toISOString()
    };
    setAttachments(prev => [...prev, mockFile]);
    setShowAttachMenu(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose} 
    >
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()} 
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-lg">
              <Mail className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Compose Email</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* Fields */}
          <div className="grid gap-4">
            <div className="grid grid-cols-[80px_1fr] items-center gap-4">
              <label className="text-sm font-medium text-slate-500 text-right">From:</label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-900 dark:text-white">Sarah Connor</span>
                <span className="text-xs text-slate-500">&lt;sarah@leap.com&gt;</span>
              </div>
            </div>
            <div className="grid grid-cols-[80px_1fr] items-center gap-4">
              <label className="text-sm font-medium text-slate-500 text-right">To:</label>
              <div className="relative">
                <input 
                  type="text" 
                  readOnly 
                  value={toDisplay}
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-300 font-medium"
                />
                {isBulk && (
                   <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-indigo-600 cursor-pointer hover:underline">
                     View List
                   </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-[80px_1fr] items-center gap-4">
              <label className="text-sm font-medium text-slate-500 text-right">Subject:</label>
              <input 
                type="text" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter subject line..."
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
              />
            </div>
          </div>

          {/* Attachments List */}
          {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 pl-[96px]">
                  {attachments.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          <Paperclip className="w-3 h-3" />
                          {file.title}
                          <button onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))} className="hover:text-red-500 ml-1">
                              <X className="w-3 h-3" />
                          </button>
                      </div>
                  ))}
              </div>
          )}

          {/* Rich Editor Simulation */}
          <div className="border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden flex flex-col min-h-[300px]">
            {/* Toolbar */}
            <div className="bg-slate-50 dark:bg-slate-800 border-b border-slate-300 dark:border-slate-700 p-2 flex gap-1 relative">
              <button 
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className={`p-2 rounded transition-colors ${showAttachMenu ? 'bg-indigo-100 text-indigo-600' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
              >
                <Paperclip className="w-4 h-4" />
              </button>
              
              {showAttachMenu && (
                  <div className="absolute top-10 left-2 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-2 w-56 z-20">
                    <button onClick={handleDeviceUpload} className="w-full text-left px-2 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <Upload className="w-4 h-4" /> Upload from Device
                    </button>
                    <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
                    <p className="text-[10px] text-slate-400 px-2 py-1 uppercase font-bold">System Library</p>
                    <div className="max-h-40 overflow-y-auto custom-scrollbar">
                        {availableResources.map(r => (
                            <button key={r.id} onClick={() => handleSystemResourceSelect(r)} className="w-full text-left px-2 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded flex items-center gap-2 text-slate-700 dark:text-slate-300 truncate">
                                <BookOpen className="w-4 h-4 text-indigo-500 shrink-0" /> <span className="truncate">{r.title}</span>
                            </button>
                        ))}
                    </div>
                     <div className="fixed inset-0 z-[-1]" onClick={() => setShowAttachMenu(false)}></div>
                  </div>
              )}

              {[Bold, Italic, LinkIcon, List, Image].map((Icon, i) => (
                <button key={i} className="p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
              <div className="flex-1"></div>
              <button 
                onClick={() => setShowPreview(!showPreview)}
                className="text-xs font-medium px-3 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-600 dark:text-slate-300"
              >
                {showPreview ? 'Edit' : 'Preview Template'}
              </button>
            </div>

            {/* Editor / Preview Area */}
            <div className="flex-1 bg-white dark:bg-slate-950 relative">
              {showPreview ? (
                <div className="p-8 max-w-2xl mx-auto bg-white text-slate-900 shadow-sm border border-slate-100 m-4">
                  {/* Mock Email Template Header */}
                  <div className="border-b-2 border-indigo-600 pb-4 mb-6 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                       <div className="w-8 h-8 bg-indigo-600 rounded text-white flex items-center justify-center font-bold">L</div>
                       <span className="font-bold text-xl text-indigo-900">Leap Leadership</span>
                    </div>
                    <span className="text-xs text-slate-400">Week 8 Update</span>
                  </div>
                  
                  {/* Content */}
                  <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap font-sans">
                    <p>Hi {isBulk ? 'Team' : recipients[0]?.fullName.split(' ')[0]},</p>
                    {body || <span className="text-slate-400 italic">[Your message will appear here...]</span>}
                  </div>

                  {/* Attachments Preview in Email */}
                  {attachments.length > 0 && (
                      <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                          <p className="text-xs font-bold text-slate-500 mb-2 uppercase">Attachments</p>
                          <div className="space-y-2">
                              {attachments.map((file, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-sm text-indigo-600">
                                      <Paperclip className="w-4 h-4" />
                                      <span className="underline">{file.title}</span>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}

                  {/* Signature */}
                  <div className="mt-8 pt-6 border-t border-slate-100 text-sm text-slate-500">
                    <p className="font-bold text-slate-800">Sarah Connor</p>
                    <p>Program Director | Leap Leadership</p>
                    <div className="flex gap-2 mt-2">
                       <a href="#" className="text-indigo-600 underline">Schedule a meeting</a>
                       <span>•</span>
                       <a href="#" className="text-indigo-600 underline">Student Portal</a>
                    </div>
                  </div>
                </div>
              ) : (
                <textarea 
                  className="w-full h-full p-4 outline-none resize-none bg-transparent text-slate-900 dark:text-white"
                  placeholder="Write your message here..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
          <div className="text-xs text-slate-500">
             {isBulk ? `Sending to ${recipients.length} participants` : 'Single recipient'}
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-sm font-medium">
              Cancel
            </button>
            <button 
              onClick={handleSend}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg shadow-indigo-500/30 transition-all"
            >
              <Send className="w-4 h-4" />
              Send Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const WhatsAppComposeModal: React.FC<WhatsAppModalProps> = ({ isOpen, onClose, recipients, onSend, availableResources }) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<Resource[]>([]);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
        setMessage('');
        setAttachments([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isBulk = recipients.length > 1;
  const recipientName = isBulk ? `${recipients.length} Participants` : recipients[0]?.fullName;
  const recipientNumber = isBulk ? 'Broadcast List' : recipients[0]?.whatsapp;

  const handleSend = () => {
    onSend(message, attachments);
    onClose();
  };

  const handleSystemResourceSelect = (r: Resource) => {
    setAttachments(prev => [...prev, r]);
    setShowAttachMenu(false);
  };

  const handleDeviceUpload = () => {
    const mockFile: Resource = {
        id: `temp-${Date.now()}`,
        title: "Photo.jpg",
        type: 'File', 
        url: '#',
        assignedWeek: null,
        tags: [],
        uploadDate: new Date().toISOString()
    };
    setAttachments(prev => [...prev, mockFile]);
    setShowAttachMenu(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose} 
    >
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 h-[500px] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()} 
      >
        
        {/* WhatsApp Header */}
        <div className="bg-[#00a884] p-4 flex items-center gap-3 text-white shadow-md z-10 shrink-0">
          <button onClick={onClose}><X className="w-6 h-6" /></button>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
             {isBulk ? <Users className="w-5 h-5" /> : <span className="font-bold">{recipientName.charAt(0)}</span>}
          </div>
          <div>
            <h3 className="font-bold text-sm">{recipientName}</h3>
            <p className="text-xs opacity-90">{recipientNumber}</p>
          </div>
        </div>

        {/* Chat Area (Preview) */}
        <div className="flex-1 bg-[#efeae2] dark:bg-[#0b141a] p-4 overflow-y-auto bg-opacity-50 relative flex flex-col">
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4a4a4a 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            <div className="flex-1"></div>

            {/* Attachments Bubble */}
            {attachments.length > 0 && (
                <div className="self-end mb-2 flex flex-col items-end gap-2 animate-in slide-in-from-bottom-2 w-full">
                    {attachments.map((file, idx) => (
                        <div key={idx} className="bg-[#d9fdd3] dark:bg-[#005c4b] p-3 rounded-lg shadow-sm flex items-center gap-2 max-w-[85%] relative group self-end">
                            <div className="p-3 bg-white/30 rounded shrink-0">
                                <FileText className="w-6 h-6 text-slate-700 dark:text-slate-200" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-slate-900 dark:text-white break-words line-clamp-2 leading-tight">
                                    {file.title}
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-300 mt-1 uppercase">
                                    {file.type} • 2 MB
                                </p>
                            </div>
                            <button 
                                onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Message Bubble Preview */}
            {message && (
              <div className="bg-[#d9fdd3] dark:bg-[#005c4b] self-end p-3 rounded-lg rounded-tr-none shadow-sm max-w-[85%] mb-4 animate-in slide-in-from-bottom-2">
                <p className="text-sm text-slate-900 dark:text-white whitespace-pre-wrap">{message}</p>
                <div className="text-[10px] text-slate-500 dark:text-slate-300 text-right mt-1 flex items-center justify-end gap-1">
                   12:45 PM <CheckCircle2 className="w-3 h-3 text-blue-500" />
                </div>
              </div>
            )}
        </div>

        {/* Input Area */}
        <div className="bg-[#f0f2f5] dark:bg-[#202c33] p-3 flex items-end gap-2 shrink-0 relative">
           
           <button 
             onClick={() => setShowAttachMenu(!showAttachMenu)}
             className="p-3 text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
           >
             <Paperclip className="w-5 h-5" />
           </button>

           <AttachmentPicker 
                isOpen={showAttachMenu} 
                onClose={() => setShowAttachMenu(false)} 
                resources={availableResources}
                onSelect={handleSystemResourceSelect}
                onUpload={handleDeviceUpload}
           />

           <div className="flex-1 bg-white dark:bg-[#2a3942] rounded-lg shadow-sm border border-transparent focus-within:border-[#00a884] transition-colors">
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
                className="w-full max-h-32 min-h-[44px] py-3 px-4 bg-transparent outline-none text-sm text-slate-900 dark:text-white resize-none custom-scrollbar"
                rows={1}
              />
           </div>
           <button 
             onClick={handleSend}
             disabled={!message && attachments.length === 0}
             className="p-3 bg-[#00a884] hover:bg-[#008f6f] text-white rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
           >
             <Send className="w-5 h-5" />
           </button>
        </div>

      </div>
    </div>
  );
};
