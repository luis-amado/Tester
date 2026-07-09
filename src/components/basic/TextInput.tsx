import { cn } from "~/lib/utils";

interface Props {
  label: string;
  type?: string;
  error?: string;
  value: string;
  setValue: (value: string) => void;
}

export default function TextInput({
  label,
  type,
  error,
  value,
  setValue,
}: Props) {
  return (
    <div className="group-input relative w-full pt-5">
      <input
        className={cn(
          "border-dark text-dark peer w-full rounded-sm border p-2",
          {
            "border-red-500": error,
          },
        )}
        id={label}
        placeholder=""
        type={type ?? "text"}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      <label
        htmlFor={label}
        className={cn(
          "pointer-events-none absolute top-0 left-0 translate-x-2 translate-y-7 text-gray-500 transition-transform select-none not-peer-placeholder-shown:pointer-events-auto not-peer-placeholder-shown:translate-x-0 not-peer-placeholder-shown:translate-y-0 not-peer-placeholder-shown:text-sm peer-focus:pointer-events-auto peer-focus:translate-x-0 peer-focus:translate-y-0 peer-focus:text-sm",
          {
            "text-red-500": error,
          },
        )}
      >
        {label}
      </label>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
