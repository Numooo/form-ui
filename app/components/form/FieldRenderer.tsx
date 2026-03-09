import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { FieldConfig } from './formConfig';

interface FieldRendererProps {
  field: FieldConfig;
  value: string | boolean;
  error: string | null;
  showSuccess: boolean;
  onChange: (value: string | boolean) => void;
  onBlur: () => void;
}

const widthClass: Record<string, string> = {
  full: 'col-span-6',
  half: 'col-span-6 sm:col-span-3',
  third: 'col-span-6 sm:col-span-2',
  'two-thirds': 'col-span-6 sm:col-span-4',
};

const baseInput =
  'w-full rounded-lg border px-3 py-2.5 text-sm transition-all duration-150 outline-none bg-white placeholder:text-gray-400';
const normalInput =
  'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10';
const errorInput =
  'border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-2 focus:ring-red-500/10';
const successInput =
  'border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/10';

function getInputClass(error: string | null, success: boolean) {
  if (error) return `${baseInput} ${errorInput}`;
  if (success) return `${baseInput} ${successInput}`;
  return `${baseInput} ${normalInput}`;
}

export function FieldRenderer({
  field,
  value,
  error,
  showSuccess,
  onChange,
  onBlur,
}: FieldRendererProps) {
  const inputClass = getInputClass(error, showSuccess);
  const strValue = typeof value === 'string' ? value : '';
  const boolValue = typeof value === 'boolean' ? value : false;
  const w = widthClass[field.width ?? 'full'];

  // ── Checkbox ───────────────────────────────────────────────────────────────
  if (field.type === 'checkbox') {
    return (
      <div className={`${w} flex flex-col gap-1`}>
        <label
          htmlFor={field.id}
          className="flex items-start gap-3 cursor-pointer group"
        >
          <div
            className={`
              relative mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 transition-all duration-150
              ${boolValue
                ? 'bg-blue-600 border-blue-600'
                : error
                  ? 'border-red-400 bg-red-50/40'
                  : 'border-gray-300 group-hover:border-blue-400'
              }
            `}
          >
            <input
              id={field.id}
              type="checkbox"
              checked={boolValue}
              onChange={(e) => onChange(e.target.checked)}
              onBlur={onBlur}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            {boolValue && (
              <svg
                viewBox="0 0 12 10"
                fill="none"
                className="absolute inset-0 m-auto w-3 h-2.5 pointer-events-none"
              >
                <path
                  d="M1 5l3 3 7-7"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <span className="text-sm text-gray-700 leading-snug pt-px">
            {field.label}
            {field.required && (
              <span className="text-amber-500 ml-1">*</span>
            )}
          </span>
        </label>
        {error && (
          <p className="flex items-center gap-1 text-xs text-red-600 mt-0.5">
            <AlertCircle size={12} />
            {error}
          </p>
        )}
        {field.helper && !error && (
          <p className="text-xs text-gray-400">{field.helper}</p>
        )}
      </div>
    );
  }

  // ── Radio ──────────────────────────────────────────────────────────────────
  if (field.type === 'radio') {
    return (
      <div className={`${w} flex flex-col gap-1.5`}>
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-700">
            {field.label}
          </span>
          {field.required && <span className="text-amber-500 text-sm">*</span>}
        </div>
        <div className="flex flex-wrap gap-2">
          {field.options?.map((opt) => {
            const checked = strValue === opt.value;
            return (
              <label
                key={opt.value}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all duration-150 text-sm
                  ${checked
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : error
                      ? 'border-red-200 hover:border-red-300 text-gray-700'
                      : 'border-gray-200 hover:border-blue-300 text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    checked ? 'border-blue-500' : error ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  {checked && (
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  )}
                </div>
                <input
                  type="radio"
                  name={field.id}
                  value={opt.value}
                  checked={checked}
                  onChange={() => onChange(opt.value)}
                  onBlur={onBlur}
                  className="sr-only"
                />
                {opt.label}
              </label>
            );
          })}
        </div>
        {error && (
          <p className="flex items-center gap-1 text-xs text-red-600">
            <AlertCircle size={12} />
            {error}
          </p>
        )}
        {field.helper && !error && (
          <p className="text-xs text-gray-400">{field.helper}</p>
        )}
      </div>
    );
  }

  // ── Select ─────────────────────────────────────────────────────────────────
  if (field.type === 'select') {
    return (
      <div className={`${w} flex flex-col gap-1.5`}>
        <FieldLabel field={field} />
        <div className="relative">
          <select
            id={field.id}
            value={strValue}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            className={`${inputClass} appearance-none pr-9 cursor-pointer`}
          >
            <option value="">— Выберите —</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            {showSuccess ? (
              <CheckCircle2 size={16} className="text-green-500" />
            ) : error ? (
              <AlertCircle size={16} className="text-red-400" />
            ) : (
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </div>
        </div>
        <FieldMeta field={field} error={error} />
      </div>
    );
  }

  // ── Textarea ───────────────────────────────────────────────────────────────
  if (field.type === 'textarea') {
    return (
      <div className={`${w} flex flex-col gap-1.5`}>
        <FieldLabel field={field} />
        <div className="relative">
          <textarea
            id={field.id}
            value={strValue}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            rows={3}
            className={`${inputClass} resize-y min-h-[80px]`}
          />
          {showSuccess && (
            <div className="absolute top-2.5 right-2.5">
              <CheckCircle2 size={16} className="text-green-500" />
            </div>
          )}
        </div>
        <FieldMeta field={field} error={error} />
      </div>
    );
  }

  // ── Text / Email / Tel / Number / Date ─────────────────────────────────────
  return (
    <div className={`${w} flex flex-col gap-1.5`}>
      <FieldLabel field={field} />
      <div className="relative">
        <input
          id={field.id}
          type={field.type}
          value={strValue}
          placeholder={field.placeholder}
          min={field.min}
          max={field.max}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={inputClass}
          autoComplete="off"
        />
        {showSuccess && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <CheckCircle2 size={16} className="text-green-500" />
          </div>
        )}
        {error && !showSuccess && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <AlertCircle size={16} className="text-red-400" />
          </div>
        )}
      </div>
      <FieldMeta field={field} error={error} />
    </div>
  );
}

function FieldLabel({ field }: { field: FieldConfig }) {
  return (
    <label htmlFor={field.id} className="flex items-center gap-1 text-sm text-gray-700 select-none">
      {field.label}
      {field.required && <span className="text-amber-500">*</span>}
    </label>
  );
}

function FieldMeta({
  field,
  error,
}: {
  field: FieldConfig;
  error: string | null;
}) {
  if (error) {
    return (
      <p className="flex items-center gap-1 text-xs text-red-600">
        <AlertCircle size={12} className="flex-shrink-0" />
        {error}
      </p>
    );
  }
  if (field.helper) {
    return <p className="text-xs text-gray-400">{field.helper}</p>;
  }
  return null;
}
