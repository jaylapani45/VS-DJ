"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { AlertTriangleIcon, Loader2Icon } from "lucide-react";

interface AiPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (response: string) => void;
}

export const AiPromptModal = ({
  isOpen,
  onClose,
  onSubmit,
}: AiPromptModalProps) => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post("/api/ai/generateContent", { prompt });
      onSubmit(data.data);
      onClose();
      toast.success("AI content generated!");
    } catch (err) {
      console.error("Error generating AI content:", err);
      setError("Something went wrong while generating content. Please try again.");
      toast.error("Gemini generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    handleSubmit();
  };

  const handleCancel = () => {
    setPrompt("");
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate AI Content</DialogTitle>
        </DialogHeader>

        {!error ? (
          <>
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your prompt..."
              className="mt-2"
              disabled={loading}
            />

            <DialogFooter>
              <Button onClick={handleSubmit} disabled={!prompt.trim() || loading}
                className="h-8 px-2 flex items-center justify-center rounded-md bg-gradient-to-r from-red-600 to-orange-500 text-white text-sm font-medium hover:from-red-700 hover:via-orange-600 hover:to-blue-950 transition-all duration-200 hover:shadow-md hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2Icon className="animate-spin size-4 mr-2" />
                    Generating...
                  </>
                ) : (
                  "Generate"
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="flex flex-col items-center text-center space-y-4 py-4">
            <div className="bg-rose-100 p-3 rounded-full">
              <AlertTriangleIcon className="text-rose-600 size-8" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">
              Gemini couldn&apos;t generate your content
            </h4>
            <p className="text-sm text-muted-foreground">{error}</p>
            <div className="flex gap-x-2">
              <Button onClick={handleRetry}>Try Again</Button>
              <Button onClick={handleCancel} variant="ghost">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
