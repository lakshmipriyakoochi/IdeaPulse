import React, { useState } from 'react';
import { Share2, Check, Copy, Twitter, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export default function RoadmapShare({ projectName }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = window.location.href;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Check out the roadmap for ${projectName}`);
    const body = encodeURIComponent(`I generated this project roadmap using Idea Pulse:\n\n${shareUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(`Check out my new project roadmap for ${projectName} built with Idea Pulse! 🚀`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2 print:hidden">
          <Share2 className="w-4 h-4" />
          Share Roadmap
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Roadmap</DialogTitle>
          <DialogDescription>
            Anyone with this link will be able to view this roadmap.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 mt-4">
          <div className="grid flex-1 gap-2">
            <label htmlFor="link" className="sr-only">
              Link
            </label>
            <Input
              id="link"
              defaultValue={shareUrl}
              readOnly
              className="text-foreground"
            />
          </div>
          <Button type="button" size="sm" className="px-3" onClick={handleCopy}>
            <span className="sr-only">Copy</span>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex justify-center gap-4 mt-6">
          <Button variant="outline" className="flex-1 gap-2" onClick={handleEmailShare}>
            <Mail className="w-4 h-4" />
            Email
          </Button>
          <Button variant="outline" className="flex-1 gap-2" onClick={handleTwitterShare}>
            <Twitter className="w-4 h-4" />
            Twitter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}