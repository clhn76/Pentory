import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ControlPanelProps {
  displayMode: "all" | "top";
  setDisplayMode: (mode: "all" | "top") => void;
  topCount: number;
  setTopCount: (count: number) => void;
  showOthers: boolean;
  setShowOthers: (show: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const ControlPanel = ({
  displayMode,
  setDisplayMode,
  topCount,
  setTopCount,
  showOthers,
  setShowOthers,
  searchTerm,
  setSearchTerm,
}: ControlPanelProps) => {
  const handleDisplayModeChange = useCallback(
    (v: string) => setDisplayMode(v as "all" | "top"),
    [setDisplayMode]
  );
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value),
    [setSearchTerm]
  );
  const handleTopCountChange = useCallback(
    (value: string) => setTopCount(Number(value)),
    [setTopCount]
  );

  return (
    <div className="flex flex-col space-y-3 md:space-y-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-4">
        <Tabs
          value={displayMode}
          onValueChange={handleDisplayModeChange}
          className="w-auto"
        >
          <TabsList className="h-8">
            <TabsTrigger value="all" className="px-3 h-8 text-xs">
              모든 스페이스
            </TabsTrigger>
            <TabsTrigger value="top" className="px-3 h-8 text-xs">
              상위 스페이스
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {displayMode === "all" ? (
          <Input
            type="text"
            placeholder="스페이스 이름 검색..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-[240px] text-xs "
          />
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Select
                value={topCount.toString()}
                onValueChange={handleTopCountChange}
              >
                <SelectTrigger className="w-[120px] h-8 text-xs">
                  <SelectValue placeholder="상위 개수" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">상위 3개</SelectItem>
                  <SelectItem value="6">상위 6개</SelectItem>
                  <SelectItem value="10">상위 10개</SelectItem>
                  <SelectItem value="15">상위 15개</SelectItem>
                </SelectContent>
              </Select>
              <Label
                htmlFor="show-others"
                className="text-xs text-muted-foreground"
              >
                기타 표시
              </Label>
              <Switch
                id="show-others"
                checked={showOthers}
                onCheckedChange={setShowOthers}
                className="scale-75"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
