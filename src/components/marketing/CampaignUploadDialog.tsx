
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, FileText } from 'lucide-react';

interface CampaignUploadDialogProps {
  onUpload: (file: File, campaignName: string) => void;
  triggerButton?: React.ReactNode;
}

export function CampaignUploadDialog({ onUpload, triggerButton }: CampaignUploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [campaignName, setCampaignName] = useState('');
  const [fileNameDisplay, setFileNameDisplay] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'text/csv') {
        setSelectedFile(file);
        setFileNameDisplay(file.name);
        // Suggest campaign name from file name (without extension)
        setCampaignName(file.name.replace(/\.[^/.]+$/, ""));
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a CSV file.",
          variant: "destructive",
        });
        setSelectedFile(null);
        setFileNameDisplay(null);
        event.target.value = ""; // Clear the input
      }
    }
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      toast({ title: "No file selected", description: "Please select a CSV file to upload.", variant: "destructive" });
      return;
    }
    if (!campaignName.trim()) {
      toast({ title: "Campaign name required", description: "Please enter a name for this campaign.", variant: "destructive" });
      return;
    }
    onUpload(selectedFile, campaignName.trim());
    setOpen(false);
    setSelectedFile(null);
    setCampaignName('');
    setFileNameDisplay(null);
    // Clear the file input visually if possible, though direct manipulation is tricky
    // A common approach is to reset the form or key the input element
    const fileInput = document.getElementById('csv-upload-input') as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) { // Reset state if dialog is closed without submitting
        setSelectedFile(null);
        setCampaignName('');
        setFileNameDisplay(null);
      }
    }}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant="default">
            <UploadCloud className="mr-2 h-4 w-4" /> Import Campaign CSV
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle>Import New Campaign</DialogTitle>
          <DialogDescription>
            Upload a CSV file containing your campaign leads and give it a name.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="campaignName">Campaign Name</Label>
            <Input
              id="campaignName"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="E.g., Q3 Leads, Webinar Follow-ups"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="csv-upload-input">CSV File</Label>
            <Input
              id="csv-upload-input"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
            {fileNameDisplay && (
              <div className="mt-2 text-sm text-muted-foreground flex items-center">
                <FileText className="h-4 w-4 mr-2 text-primary" /> Selected: {fileNameDisplay}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedFile || !campaignName.trim()}>
            <UploadCloud className="mr-2 h-4 w-4" /> Upload and Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
