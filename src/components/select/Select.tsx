import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type SelectPropsType = {
  placeholder: string;
  options: { label: string; value: string }[];
  label?: string;
  placeholderIcon?: React.ReactNode;
  classes?: string;
  onChange?: (value: string) => void;
};

export function SelectBox({
  placeholder,
  options,
  label,
  placeholderIcon,
  classes,
  onChange,
}: SelectPropsType) {
  return (
    <Select
      onValueChange={(value) => onChange?.(value)}
    >
      <SelectTrigger className={cn(`${classes ? "w-[180px]" : ""}`, classes)}>
        <SelectValue placeholder={placeholder} />
        {placeholderIcon && <span className="ms-2">{placeholderIcon}</span>}
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label ? label : ""}</SelectLabel>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
