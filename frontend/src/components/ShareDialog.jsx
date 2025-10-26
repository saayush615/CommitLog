import React, { useState } from 'react';
import { Copy, Check, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ShareDialog = ({ isOpen, onClose, blogUrl }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(blogUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700 text-white">
                <DialogHeader>
                    <DialogTitle className="text-white">Share this blog</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Copy the link below to share this blog with others
                    </DialogDescription>
                </DialogHeader>
                
                {/* space-x-* => Adding space between children */}
                <div className="flex items-center space-x-2"> 
                    <div className="flex-1 gap-2">
                        <input
                            type="text"
                            value={blogUrl}
                            readOnly
                            className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    <Button 
                        type="button" 
                        size="sm" 
                        className="px-3 bg-green-600 hover:bg-green-700"
                        onClick={handleCopy}
                    >
                        {copied ? (
                            <>
                                <Check className="h-4 w-4 mr-1" />
                                Copied
                            </>
                        ) : (
                            <>
                                <Copy className="h-4 w-4 mr-1" />
                                Copy
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ShareDialog;