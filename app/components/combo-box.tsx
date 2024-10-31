/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Label } from "./ui/label";
import { useTranslation } from "react-i18next";

type ComboboxProps = {
  id: string;
  label?: string;
  placeholder?: string;
  value: string | undefined;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  valuesById?: Record<string, any>;
  testSelector?: string;
};

export function Combobox({
  id,
  label,
  placeholder,
  value,
  onChange,
  options,
  valuesById,
  testSelector,
}: ComboboxProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const placeholderValue = placeholder || t("combobox_search_placeholder");

  const handleFilterByLabel = (value: string, search: string) => {
    if (valuesById) {
      if (
        valuesById[value]?.fullName
          ?.toLowerCase()
          ?.includes(search.toLowerCase())
      ) {
        return 1;
      }
      return 0;
    }
    return value.includes(search) ? 1 : 0;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex flex-col gap-2">
        {label && (
          <Label htmlFor={id} className="w-fit">
            {label}
          </Label>
        )}
        <PopoverTrigger asChild>
          <Button
            data-testid={testSelector}
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value
              ? options.find((option) => option.value === value)?.label
              : placeholderValue}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-[200px] p-0">
        <Command filter={handleFilterByLabel}>
          <CommandInput placeholder={t("combobox_search_placeholder")} />
          <CommandList>
            <CommandEmpty>No result found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
