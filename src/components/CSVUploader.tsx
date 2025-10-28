import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CSVUploaderProps {
  onDataLoad: (data: string) => void;
}

export const CSVUploader = ({ onDataLoad }: CSVUploaderProps) => {
  const [fileName, setFileName] = useState<string>("");
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target?.result as string;
      onDataLoad(text);
      toast({
        title: "File uploaded successfully",
        description: "Analyzing ticket data...",
      });
    };
    
    reader.onerror = () => {
      toast({
        title: "Error reading file",
        description: "Please try again",
        variant: "destructive",
      });
    };
    
    reader.readAsText(file);
  };

  return (
    <Card className="p-8 border-dashed border-2 border-border/50 hover:border-primary/50 transition-colors">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="p-4 rounded-full bg-primary/10">
          {fileName ? (
            <FileText className="w-8 h-8 text-primary" />
          ) : (
            <Upload className="w-8 h-8 text-primary" />
          )}
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            {fileName || "Upload Asana CSV Export"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {fileName
              ? "File loaded successfully. Upload another to replace."
              : "Drag and drop your CSV file or click to browse"}
          </p>
        </div>
        <label htmlFor="csv-upload">
          <Button variant="default" className="cursor-pointer" asChild>
            <span>
              <Upload className="w-4 h-4 mr-2" />
              {fileName ? "Replace File" : "Select CSV File"}
            </span>
          </Button>
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      </div>
    </Card>
  );
};
