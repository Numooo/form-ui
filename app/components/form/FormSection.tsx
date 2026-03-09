import React from 'react';
import {
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  UserRound,
  IdCard,
  Phone,
  House,
  GraduationCap,
  BriefcaseBusiness,
  Wallet,
  FileText,
  CircleHelp,
} from 'lucide-react';
import { SectionConfig, validateField } from './formConfig';
import { FieldRenderer } from './FieldRenderer';

type SectionStatus = 'default' | 'success' | 'error';

interface FormSectionProps {
  section: SectionConfig;
  values: Record<string, string | boolean>;
  touched: Record<string, boolean>;
  showErrors: boolean;
  collapsed: boolean;
  sectionRef: (el: HTMLElement | null) => void;
  onToggle: () => void;
  onChange: (id: string, value: string | boolean) => void;
  onBlur: (id: string) => void;
  status: SectionStatus;
}

const sectionIcons = {
  personal: UserRound,
  passport: IdCard,
  contact: Phone,
  address: House,
  education: GraduationCap,
  employment: BriefcaseBusiness,
  financial: Wallet,
  additional: FileText,
} as const;

export function FormSection({
  section,
  values,
  touched,
  showErrors,
  collapsed,
  sectionRef,
  onToggle,
  onChange,
  onBlur,
  status,
}: FormSectionProps) {
  const SectionIcon =
    sectionIcons[section.id as keyof typeof sectionIcons] ?? CircleHelp;

  const requiredCount = section.fields.filter((f) => f.required).length;
  const completedRequired = section.fields.filter((f) => {
    if (!f.required) return false;
    const val = values[f.id] ?? (f.type === 'checkbox' ? false : '');
    if (typeof val === 'boolean') return val;
    return typeof val === 'string' && val.trim() !== '';
  }).length;

  const headerStatusColor =
    status === 'success'
      ? 'border-l-green-500'
      : status === 'error'
        ? 'border-l-red-500'
        : 'border-l-transparent';

  return (
    <section
      ref={sectionRef}
      id={`section-${section.id}`}
      className="scroll-mt-20"
    >
      <div
        className={`
          bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden
          transition-all duration-200
          border-l-4 ${headerStatusColor}
        `}
      >
        {/* Section Header */}
        <button
          type="button"
          onClick={onToggle}
          className="w-full flex items-center justify-between px-6 py-5 gap-4 text-left hover:bg-gray-50/60 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span
              className={`
                flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl transition-colors
                ${status === 'success'
                  ? 'bg-green-50'
                  : status === 'error'
                    ? 'bg-red-50'
                    : 'bg-gray-50'
                }
              `}
            >
              <SectionIcon
                size={20}
                className={
                  status === 'success'
                    ? 'text-green-600'
                    : status === 'error'
                      ? 'text-red-500'
                      : 'text-gray-500'
                }
              />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2
                  className={`
                    text-base truncate transition-colors
                    ${status === 'success'
                      ? 'text-green-700'
                      : status === 'error'
                        ? 'text-red-700'
                        : 'text-gray-900'
                    }
                  `}
                >
                  {section.title}
                </h2>
                {status === 'success' && (
                  <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex-shrink-0">
                    <CheckCircle2 size={11} />
                    Заполнено
                  </span>
                )}
                {status === 'error' && (
                  <span className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full flex-shrink-0">
                    <AlertCircle size={11} />
                    Есть ошибки
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-0.5 truncate">
                {section.subtitle}
                {requiredCount > 0 && (
                  <span className="ml-2 text-gray-400">
                    {completedRequired}/{requiredCount} обязательных
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Mini progress pill */}
            {requiredCount > 0 && (
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-20 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      status === 'success'
                        ? 'bg-green-500'
                        : completedRequired > 0
                          ? 'bg-blue-500'
                          : 'bg-gray-200'
                    }`}
                    style={{
                      width: `${Math.round((completedRequired / requiredCount) * 100)}%`,
                    }}
                  />
                </div>
                <span className="text-xs text-gray-400 tabular-nums">
                  {Math.round((completedRequired / requiredCount) * 100)}%
                </span>
              </div>
            )}

            <ChevronDown
              size={18}
              className={`text-gray-400 transition-transform duration-200 ${
                collapsed ? '' : 'rotate-180'
              }`}
            />
          </div>
        </button>

        {/* Section Body */}
        {!collapsed && (
          <div className="px-6 pb-6 border-t border-gray-50">
            <div className="grid grid-cols-6 gap-x-4 gap-y-5 mt-5">
              {section.fields.map((field) => {
                const val =
                  values[field.id] ??
                  (field.type === 'checkbox' ? false : '');
                const isTouched = touched[field.id] || showErrors;
                const error = isTouched
                  ? validateField(field, val)
                  : null;
                const hasValue =
                  typeof val === 'boolean'
                    ? val
                    : (val as string).trim() !== '';
                const isValid = !validateField(field, val) && hasValue;
                const showSuccess = isTouched && isValid && field.type !== 'checkbox';

                return (
                  <FieldRenderer
                    key={field.id}
                    field={field}
                    value={val}
                    error={error}
                    showSuccess={showSuccess}
                    onChange={(v) => onChange(field.id, v)}
                    onBlur={() => onBlur(field.id)}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
