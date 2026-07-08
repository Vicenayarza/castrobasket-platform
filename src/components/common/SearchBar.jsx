import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="relative w-full max-w-md">

      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <Input
        className="pl-10"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

    </div>
  );
}