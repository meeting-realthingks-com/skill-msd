import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Upload, Download, Plus, AlertCircle, CheckCircle, MoreVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AddCategoryModal } from "./AddCategoryModal";
import { ImportExportService } from "../../services/importExport.service";
import type { SkillCategory, Skill, Subskill } from "@/types/database";

interface ActionMenuProps {
  categories: SkillCategory[];
  skills: Skill[];
  subskills: Subskill[];
  onRefresh: () => void;
}

interface ImportResult {
  success: number;
  errors: number;
}

export const ActionMenu = ({
  categories,
  skills,
  subskills,
  onRefresh
}: ActionMenuProps) => {
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importData, setImportData] = useState<any[]>([]);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const { toast } = useToast();

  const exportToCSV = async () => {
    try {
      const csvString = await ImportExportService.exportToCSV(categories, skills, subskills);
      
      const blob = new Blob([csvString], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'skills_hierarchy_export.csv';
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: "Skills hierarchy exported to CSV",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export skills hierarchy",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setImportFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
        
        const data = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.replace(/"/g, '').trim());
          const row: any = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          return row;
        });
        
        setImportData(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Invalid CSV format",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!importData.length) return;
    
    console.log('🚀 Starting import process with', importData.length, 'rows');
    setImporting(true);
    setImportResult(null);
    
    try {
      const result = await ImportExportService.importFromCSV(
        importData,
        categories,
        skills,
        subskills
      );
      
      console.log('✅ Import completed:', result);
      setImportResult(result);
      
      if (result.errors === 0) {
        toast({
          title: "Import Successful",
          description: `Successfully imported ${result.success} items`,
        });
      } else {
        toast({
          title: "Import Completed with Issues",
          description: `${result.success} items imported, ${result.errors} errors occurred`,
          variant: "destructive",
        });
      }
      
      // Don't close dialog immediately, let user see results
      onRefresh();
    } catch (error) {
      console.error('❌ Import error:', error);
      toast({
        title: "Import Failed",
        description: `Failed to import data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
      setImportResult({ success: 0, errors: importData.length });
    } finally {
      setImporting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            Actions
            <MoreVertical className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setShowAddCategory(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </DropdownMenuItem>
          <DropdownMenuItem onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowImportDialog(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Import CSV
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import Skills Hierarchy from CSV</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="csvFile">CSV File</Label>
              <Input
                id="csvFile"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
              />
              <p className="text-sm text-muted-foreground mt-1">
                CSV should have columns: Category, Skill, Subskill, Description
              </p>
            </div>
            
            {importData.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Preview ({importData.length} rows)</h4>
                <ScrollArea className="h-40 border rounded-md p-2">
                  <div className="space-y-1">
                    {importData.slice(0, 10).map((row, index) => (
                      <div key={index} className="text-sm p-2 bg-muted rounded">
                        <strong>{row["Category"]}</strong>
                        {row["Skill"] && <> → {row["Skill"]}</>}
                        {row["Subskill"] && <> → {row["Subskill"]}</>}
                      </div>
                    ))}
                    {importData.length > 10 && (
                      <div className="text-sm text-muted-foreground">
                        ... and {importData.length - 10} more
                      </div>
                    )}
                  </div>
                </ScrollArea>
                
                {importResult && (
                  <div className="mt-4 p-3 rounded-md border bg-muted/50">
                    <div className="flex items-center gap-2 mb-2">
                      {importResult.errors === 0 ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                      )}
                      <span className="font-medium">Import Results</span>
                    </div>
                    <div className="text-sm space-y-1">
                      <div>✅ Successfully processed: {importResult.success} items</div>
                      {importResult.errors > 0 && (
                        <div>⚠️ Errors encountered: {importResult.errors} items</div>
                      )}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setShowImportDialog(false);
                          setImportData([]);
                          setImportFile(null);
                          setImportResult(null);
                        }}
                      >
                        Close
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setImportData([]);
                          setImportFile(null);
                          setImportResult(null);
                          const input = document.getElementById('csvFile') as HTMLInputElement;
                          if (input) input.value = '';
                        }}
                      >
                        Import Another
                      </Button>
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={handleImport} 
                  className="w-full mt-4" 
                  disabled={importing}
                >
                  {importing ? "Importing..." : `Import ${importData.length} Items`}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Category Modal */}
      <AddCategoryModal
        open={showAddCategory}
        onOpenChange={setShowAddCategory}
        onSuccess={() => {
          setShowAddCategory(false);
          onRefresh();
        }}
      />
    </>
  );
};