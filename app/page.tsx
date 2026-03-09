"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Activity,
  BarChart3,
  ChevronDown,
  ClipboardList,
  FileArchive,
  FilePlus2,
  FileText,
  LayoutDashboard,
  LineChart,
  LogOut,
  MoreHorizontal,
  Settings,
  UserRound,
} from "lucide-react";

type SubMenuItem = {
  title: string;
  icon: typeof LayoutDashboard;
  isActive: boolean;
  href?: string;
};

const mainMenuItems = [
  {
    title: "Дашбоард",
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: "Статистика",
    icon: LineChart,
    isActive: false,
  },
  {
    title: "Отчеты",
    icon: FileText,
    isActive: false,
  },
] as const;

const formSubMenuItems: SubMenuItem[] = [
  {
    title: "Создать анкету",
    href: "/create-form",
    icon: FilePlus2,
    isActive: true,
  },
  {
    title: "Список анкет",
    icon: LayoutDashboard,
    isActive: false,
  },
  {
    title: "Архив анкет",
    icon: FileArchive,
    isActive: false,
  },
];

const stats = [
  { label: "Анкет за неделю", value: "42", trend: "+12%" },
  { label: "В работе", value: "18", trend: "+4%" },
  { label: "Завершено", value: "24", trend: "+9%" },
  { label: "Среднее время", value: "16 мин", trend: "-3%" },
] as const;

const analytics = [
  { month: "Янв", value: 35 },
  { month: "Фев", value: 48 },
  { month: "Мар", value: 57 },
  { month: "Апр", value: 44 },
  { month: "Май", value: 63 },
  { month: "Июн", value: 51 },
] as const;

const recentEvents = [
  "Анкета #A-241 удалена.",
  "Создана новая анкета клиента.",
  "Обновлены контактные данные в профиле.",
] as const;

export default function HomePage() {
  const [isFormMenuOpen, setIsFormMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const maxAnalyticsValue = Math.max(...analytics.map((item) => item.value));

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-white p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid w-full max-w-7xl gap-5 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-3xl border border-white/70 bg-white/85 p-5 shadow-lg shadow-blue-100/60 backdrop-blur">
          <div className="relative mb-6 flex items-start justify-between gap-3 rounded-2xl bg-blue-50 p-3">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 p-2 text-blue-700">
                <UserRound size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-500">Профиль</p>
                <p className="text-sm font-semibold text-slate-900">Иван Иванов</p>
              </div>
            </div>

            <div className="relative">
              <button
                type="button"
                aria-label="Действия профиля"
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-white/80 hover:text-slate-900"
              >
                <MoreHorizontal size={18} />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 top-11 z-10 w-44 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                  >
                    <UserRound size={16} />
                    Редактировать
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                  >
                    <Settings size={16} />
                    Настройки
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Выйти
                  </button>
                </div>
              )}
            </div>
          </div>

          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Меню</p>
          <nav className="space-y-2">
            {mainMenuItems.map((item) => {
              const Icon = item.icon;
              const menuClass = item.isActive
                ? "bg-blue-600 text-white shadow-md shadow-slate-200"
                : "bg-slate-50 text-slate-700 hover:bg-slate-100";

              return (
                <button
                  key={item.title}
                  type="button"
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${menuClass}`}
                >
                  <Icon size={16} />
                  {item.title}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setIsFormMenuOpen((prev) => !prev)}
              className="flex w-full items-center justify-between rounded-xl  px-3 py-2.5 text-left text-sm font-medium transition"
            >
              <span className="flex items-center gap-3">
                <ClipboardList size={16} />
                Анкета
              </span>
              <ChevronDown
                size={16}
                className={`transition-transform ${isFormMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isFormMenuOpen && (
              <div className="ml-3 space-y-2 border-l-2 border-blue-100 pl-3">
                {formSubMenuItems.map((item) => {
                  const Icon = item.icon;
                  const menuClass = item.isActive
                    ? "bg-blue-100 text-blue-800"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100";

                  if (item.href) {
                    return (
                      <Link
                        key={item.title}
                        href={item.href}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${menuClass}`}
                      >
                        <Icon size={16} />
                        {item.title}
                      </Link>
                    );
                  }

                  return (
                    <button
                      key={item.title}
                      type="button"
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${menuClass}`}
                    >
                      <Icon size={16} />
                      {item.title}
                    </button>
                  );
                })}
              </div>
            )}
          </nav>
        </aside>

        <section className="space-y-5">
          <header className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm sm:p-7">
            <p className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
              Главная
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">
              Анкета
            </h1>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Выберите нужный раздел: создать анкету, открыть список анкет или посмотреть архив.
            </p>
          </header>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
              <article key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{item.label}</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">{item.value}</p>
                <p className="mt-1 text-xs font-medium text-blue-700">{item.trend} к прошлой неделе</p>
              </article>
            ))}
          </section>

          <section className="grid gap-4 xl:grid-cols-[2fr_1fr]">
            <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <BarChart3 size={18} className="text-blue-700" />
                <h2 className="text-lg font-semibold text-slate-900">Аналитика</h2>
              </div>
              <div className="grid grid-cols-6 items-end gap-3">
                {analytics.map((item) => (
                  <div key={item.month} className="flex flex-col items-center gap-2">
                    <div className="flex h-40 w-full items-end rounded-xl bg-slate-100 p-1">
                      <div
                        className="w-full rounded-lg bg-gradient-to-t from-blue-500 to-blue-300"
                        style={{ height: `${Math.round((item.value / maxAnalyticsValue) * 100)}%` }}
                      />
                    </div>
                    <p className="text-xs font-medium text-slate-600">{item.month}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <Activity size={18} className="text-blue-700" />
                <h2 className="text-lg font-semibold text-slate-900">Статус и события</h2>
              </div>
              <ul className="space-y-3">
                {recentEvents.map((event) => (
                  <li key={event} className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                    {event}
                  </li>
                ))}
              </ul>
            </article>
          </section>
        </section>
      </div>
    </main>
  );
}
