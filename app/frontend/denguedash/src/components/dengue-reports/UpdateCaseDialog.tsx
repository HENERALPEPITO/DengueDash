// Todo: fix this shit

"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@shadcn/components/ui/dialog";
import { Button } from "@shadcn/components/ui/button";
import { Label } from "@shadcn/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shadcn/components/ui/select";
import { Separator } from "@shadcn/components/ui/separator";
import { Calendar } from "@shadcn/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@shadcn/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, FlaskConical, ClipboardList } from "lucide-react";
import { cn } from "@shadcn/lib/utils";

export function UpdateCaseDialog({
  isOpen,
  onClose,
  caseId,
}: {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
}) {
  // State for form values
  const [nsiResult, setNsiResult] = useState("Pending Result");
  const [nsiDate, setNsiDate] = useState<Date | undefined>(undefined);

  const [igGResult, setIgGResult] = useState("Equivocal");
  const [igGDate, setIgGDate] = useState<Date>(new Date("2024-11-07"));

  const [igMResult, setIgMResult] = useState("Equivocal");
  const [igMDate, setIgMDate] = useState<Date>(new Date("2024-11-07"));

  const [pcrResult, setPcrResult] = useState("Equivocal");
  const [pcrDate, setPcrDate] = useState<Date>(new Date("2024-11-05"));

  const [caseClassification, setCaseClassification] = useState("Probable");
  const [outcome, setOutcome] = useState("Alive");
  const [dateOfDeath, setDateOfDeath] = useState<Date | undefined>(undefined);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the updated data to your API
    console.log("Submitting updated case data:", {
      nsiResult,
      nsiDate,
      igGResult,
      igGDate,
      igMResult,
      igMDate,
      pcrResult,
      pcrDate,
      caseClassification,
      outcome,
      ...(outcome === "Deceased" && { dateOfDeath }),
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            Update Case #{caseId}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Laboratory Results Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-semibold text-lg">
              <FlaskConical className="h-5 w-5" />
              <h3>Laboratory Results</h3>
            </div>
            <Separator />

            {/* NSI */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nsi-result">NSI</Label>
                <Select value={nsiResult} onValueChange={setNsiResult}>
                  <SelectTrigger id="nsi-result" className="w-full">
                    <SelectValue placeholder="Select result" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending Result">
                      Pending Result
                    </SelectItem>
                    <SelectItem value="Positive">Positive</SelectItem>
                    <SelectItem value="Negative">Negative</SelectItem>
                    <SelectItem value="Equivocal">Equivocal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date Done</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !nsiDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {nsiDate ? format(nsiDate, "PPP") : "n/a"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={nsiDate}
                      onSelect={setNsiDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* IgG Elisa */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="igg-result">IgG Elisa</Label>
                <Select value={igGResult} onValueChange={setIgGResult}>
                  <SelectTrigger id="igg-result" className="w-full">
                    <SelectValue placeholder="Select result" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Positive">Positive</SelectItem>
                    <SelectItem value="Negative">Negative</SelectItem>
                    <SelectItem value="Equivocal">Equivocal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date Done</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(igGDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={igGDate}
                      onSelect={setIgGDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* IgM Elisa */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="igm-result">IgM Elisa</Label>
                <Select value={igMResult} onValueChange={setIgMResult}>
                  <SelectTrigger id="igm-result" className="w-full">
                    <SelectValue placeholder="Select result" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Positive">Positive</SelectItem>
                    <SelectItem value="Negative">Negative</SelectItem>
                    <SelectItem value="Equivocal">Equivocal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date Done</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(igMDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={igMDate}
                      onSelect={setIgMDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* PCR */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pcr-result">PCR</Label>
                <Select value={pcrResult} onValueChange={setPcrResult}>
                  <SelectTrigger id="pcr-result" className="w-full">
                    <SelectValue placeholder="Select result" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Positive">Positive</SelectItem>
                    <SelectItem value="Negative">Negative</SelectItem>
                    <SelectItem value="Equivocal">Equivocal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date Done</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(pcrDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={pcrDate}
                      onSelect={setPcrDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Outcome Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-semibold text-lg">
              <ClipboardList className="h-5 w-5" />
              <h3>Outcome</h3>
            </div>
            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="case-classification">Case Classification</Label>
                <Select
                  value={caseClassification}
                  onValueChange={setCaseClassification}
                >
                  <SelectTrigger id="case-classification" className="w-full">
                    <SelectValue placeholder="Select classification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Probable">Probable</SelectItem>
                    <SelectItem value="Suspected">Suspected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="outcome">Outcome</Label>
                <Select value={outcome} onValueChange={setOutcome}>
                  <SelectTrigger id="outcome" className="w-full">
                    <SelectValue placeholder="Select outcome" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alive">Alive</SelectItem>
                    <SelectItem value="Deceased">Deceased</SelectItem>
                    <SelectItem value="Unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {outcome === "Deceased" && (
                <div className="space-y-2 col-span-2">
                  <Label>Date of Death</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateOfDeath && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateOfDeath
                          ? format(dateOfDeath, "PPP")
                          : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateOfDeath}
                        onSelect={setDateOfDeath}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
