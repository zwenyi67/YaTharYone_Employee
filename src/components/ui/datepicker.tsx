import React from "react";

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  placeholder?: string;
  className?: string;
  readonly?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Select a date",
  className = "",
  readonly = false,
}) => {
  // Convert the Date value to ISO string for input compatibility
  const formattedValue = value
    ? value.toISOString().split("T")[0] // Convert to 'YYYY-MM-DD'
    : "";

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!readonly) {
      const selectedDate = event.target.value;
      onChange(new Date(selectedDate)); // Pass a Date object back
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="date"
        value={formattedValue}
        onChange={handleDateChange}
        className="h-9 w-full rounded-md bg-accent px-3 py-1 file:rounded border text-sm transition-colors file:bg-transparent file:hover:bg-gray-300 file:h-full file:text-xs file:cursor-pointer placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary disabled:cursor-not-allowed disabled:opacity-50"
        placeholder={placeholder}
        readOnly={readonly}
      />
    </div>
  );
};

export default DatePicker;
