import React from 'react';
import {
  CheckCircle2,
  AlertCircle,
  FileBadge2,
  PackageCheck,
  Truck,
  MapPinned,
  Files,
  BadgeDollarSign,
  Landmark,
  ShieldCheck,
  CircleHelp,
} from 'lucide-react';
import { SectionConfig } from './formConfig';

type SectionStatus = 'default' | 'success' | 'error';

interface SidebarProps {
  sections: SectionConfig[];
  sectionStatuses: Record<string, SectionStatus>;
  activeSection: string;
  progress: number;
  totalRequired: number;
  completedRequired: number;
  onNavigate: (sectionId: string) => void;
}

const sectionIcons = {
  personal: FileBadge2,
  passport: PackageCheck,
  contact: Truck,
  address: MapPinned,
  education: Files,
  employment: BadgeDollarSign,
  financial: Landmark,
  additional: ShieldCheck,
} as const;

export function Sidebar({
  sections,
  sectionStatuses,
  activeSection,
  progress,
  totalRequired,
  completedRequired,
  onNavigate,
}: SidebarProps) {
  return (
    <aside className="flex flex-col gap-4">
      {/* Progress Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600">Прогресс заполнения</span>
          <span
            className={`text-sm tabular-nums transition-colors ${
              progress === 100
                ? 'text-green-600'
                : progress > 50
                  ? 'text-blue-600'
                  : 'text-gray-500'
            }`}
          >
            {completedRequired}/{totalRequired}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden mb-3">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              progress === 100
                ? 'bg-gradient-to-r from-green-400 to-green-500'
                : 'bg-gradient-to-r from-blue-400 to-blue-600'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-xs text-gray-400">
          {progress === 100
            ? '✅ Все обязательные поля заполнены'
            : progress > 0
              ? `Осталось заполнить: ${totalRequired - completedRequired} обязательных поля`
              : 'Заполните обязательные поля, отмеченные *'}
        </p>
      </div>

      {/* Section Navigation */}
      <nav className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3">
        <p className="text-xs text-gray-400 uppercase tracking-wider px-2 pb-2 pt-1">
          Разделы формы
        </p>
        <ul className="space-y-0.5">
          {sections.map((section, index) => {
            const status = sectionStatuses[section.id] ?? 'default';
            const isActive = activeSection === section.id;
            const SectionIcon =
              sectionIcons[section.id as keyof typeof sectionIcons] ?? CircleHelp;

            return (
              <li key={section.id}>
                <button
                  type="button"
                  onClick={() => onNavigate(section.id)}
                  className={`
                    w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group
                    ${isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'hover:bg-gray-50 text-gray-700'
                    }
                  `}
                >
                  {/* Status indicator */}
                  <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                    {status === 'success' ? (
                      <CheckCircle2 size={18} className="text-green-500" />
                    ) : status === 'error' ? (
                      <AlertCircle size={18} className="text-red-400" />
                    ) : (
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-medium
                          ${isActive
                            ? 'border-blue-500 bg-blue-500 text-white'
                            : 'border-gray-200 text-gray-400 group-hover:border-gray-300'
                          }
                        `}
                      >
                        {index + 1}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <span
                      className={`text-sm leading-none block truncate transition-colors ${
                        isActive
                          ? 'text-blue-700'
                          : status === 'success'
                            ? 'text-green-700'
                            : status === 'error'
                              ? 'text-red-600'
                              : 'text-gray-700'
                      }`}
                    >
                      {section.title}
                    </span>
                  </div>

                  <SectionIcon
                    size={16}
                    className={`flex-shrink-0 transition-colors ${
                      isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                    }`}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Tips card */}
      <div className="bg-blue-50 rounded-2xl border border-blue-100 p-4">
        <p className="text-xs text-blue-700 leading-relaxed">
          <span className="block mb-1 text-blue-800">💡 Подсказка</span>
          Поля, отмеченные <span className="text-red-500">*</span>, обязательны для заполнения. Раздел становится{' '}
          <span className="text-green-600">зелёным</span>, когда все обязательные поля заполнены.
        </p>
      </div>
    </aside>
  );
}
