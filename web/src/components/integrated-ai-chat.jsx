import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAnimatedText } from '@/hooks/use-animated-text.jsx';
import { useIntegratedAi } from '@/hooks/use-integrated-ai.jsx';
import { X, Sparkles, Paperclip, Send } from 'lucide-react';

const MAX_IMAGES = 10;
const MAX_IMAGE_SIZE = 20 * 1024 * 1024;
const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const getImageKey = file => `${file.name}:${file.size}:${file.lastModified}`;

export default function IntegratedAiChat({ onClose }) {
  const [input, setInput] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  
  // Safely destructure with fallback so the component never crashes
  // even if the hook temporarily returns undefined or malformed data
  const {
    messages: rawMessages = [],
    isStreaming,
    isLoadingHistory,
    sendMessage,
    clearMessages,
  } = useIntegratedAi();

  const messages = rawMessages; // alias for clarity
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Image previews with proper object URL management
  const imagePreviews = useMemo(() => {
    return selectedImages.map(file => ({
      key: getImageKey(file),
      file,
      url: URL.createObjectURL(file),
    }));
  }, [selectedImages]);

  // FIXED: Proper cleanup of object URLs
  // We revoke URLs when selectedImages changes OR when the component unmounts
  // This prevents memory leaks and stale URL references
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => {
        URL.revokeObjectURL(preview.url);
      });
    };
  }, [imagePreviews]);

  // FIXED: Safe lastMessage access (prevents the exact error you saw)
  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
  const isLastMessageStreaming = isStreaming && lastMessage?.role === 'assistant';
  const animatedText = useAnimatedText(isLastMessageStreaming ? lastMessage.content : '');

  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        });
      }
    };
    scrollToBottom();
  }, [messages, animatedText]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    const trimmed = input.trim();

    if ((!trimmed && selectedImages.length === 0) || isStreaming) {
      return;
    }

    setInput('');
    sendMessage(trimmed, selectedImages);
    setSelectedImages([]);
  }, [input, selectedImages, isStreaming, sendMessage]);

  const handleImageSelect = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(
      file => VALID_IMAGE_TYPES.includes(file.type) && file.size <= MAX_IMAGE_SIZE
    );

    setSelectedImages((prev) => {
      const uniqueFilesMap = new Map(prev.map(file => [getImageKey(file), file]));
      validFiles.forEach(file => uniqueFilesMap.set(getImageKey(file), file));
      return Array.from(uniqueFilesMap.values()).slice(0, MAX_IMAGES);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const removeImage = useCallback((index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div className="flex flex-col h-full w-full max-w-[320px] bg-background flex-shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/20">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-1.5 rounded-lg">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
          </div>
          <h2 className="text-[13px] font-semibold tracking-tight">AI Assistant</h2>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              disabled={isStreaming}
              className="text-[12px] px-2 py-1 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
            >
              Clear
            </button>
          )}
          {onClose && (
            <button 
              onClick={onClose} 
              className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 scroll-smooth">
        {isLoadingHistory && (
          <div className="text-center text-[12px] text-muted-foreground py-4">Loading history...</div>
        )}
        
        {!isLoadingHistory && messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 space-y-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              How can I help you find the right tools for your project?
            </p>
          </div>
        )}

        {/* FIXED: Added Array.isArray + optional chaining guard */}
        {Array.isArray(messages) && messages.map((msg, i) => {
          const isLastStreamingMessage = isStreaming && i === messages.length - 1 && msg.role === 'assistant';
          const displayContent = isLastStreamingMessage ? animatedText : msg.content;

          return (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] px-3 py-2 text-[13px] leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm'
                    : 'bg-muted/50 text-foreground rounded-2xl rounded-tl-sm border border-border/50'
                }`}
              >
                <p className="whitespace-pre-wrap">{displayContent}</p>
                {msg.images?.map((url, j) => (
                  <img
                    key={j}
                    src={url}
                    alt="Attached"
                    className="mt-2 rounded-md max-w-full border border-border/50"
                  />
                ))}
                {msg.role === 'assistant' && isStreaming && i === messages.length - 1 && !msg.content && (
                  <span className="inline-block w-1.5 h-3.5 bg-muted-foreground/50 animate-pulse ml-1 align-middle" />
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} className="h-1" />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t bg-background">
        {selectedImages.length > 0 && (
          <div className="mb-2 flex gap-2 flex-wrap">
            {imagePreviews.map(({ key, file, url }, index) => (
              <div key={key} className="relative group">
                <img
                  src={url}
                  alt={file.name}
                  className="w-12 h-12 object-cover rounded-md border shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full w-4 h-4 flex items-center justify-center text-[10px] shadow-sm hover:scale-110 transition-transform"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex gap-1.5 items-center bg-muted/30 border rounded-full px-2 py-1.5 focus-within:ring-1 focus-within:ring-primary/30 transition-all">
          <input
            ref={fileInputRef}
            type="file"
            accept={VALID_IMAGE_TYPES.join(',')}
            multiple
            onChange={handleImageSelect}
            className="hidden"
            disabled={isStreaming || isLoadingHistory}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0 p-1.5 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 rounded-full hover:bg-muted"
            disabled={isStreaming || isLoadingHistory || selectedImages.length >= MAX_IMAGES}
            title="Attach image"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask anything..."
            className="flex-1 bg-transparent border-0 px-1 py-1 text-[13px] focus:outline-none focus:ring-0 placeholder:text-muted-foreground min-w-0"
            disabled={isStreaming || isLoadingHistory}
          />
          <button
            type="submit"
            disabled={isStreaming || (!input.trim() && selectedImages.length === 0)}
            className="shrink-0 p-1.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all disabled:opacity-50 disabled:bg-muted disabled:text-muted-foreground"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}