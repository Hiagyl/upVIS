type FilterOption = {
  label: string;
  value: string;
};

type FilterSelectProps = {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
};

const FilterSelect = ({
  label,
  value,
  options,
  onChange,
}: FilterSelectProps) => {
  return (
    <label className="flex min-w-52 flex-col gap-2">
      <span className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-700 outline-none transition focus:border-amber-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
};

export default FilterSelect;
