import Link from "next/link";
import {
  Activity,
  BarChart3,
  CalendarClock,
  ClipboardList,
  FilePlus2,
  LayoutDashboard,
  UserRound,
} from "lucide-react";

type MenuItem = {
  title: string;
  icon: typeof LayoutDashboard;
  isActive: boolean;
  href?: string;
};

const menuItems: MenuItem[] = [
  {
    title: "Анкета",
    icon: ClipboardList,
    isActive: true,
  },
  {
    title: "Создать анкету",
    href: "/create-form",
    icon: FilePlus2,
    isActive: false,
  },
  {
    title: "Список анкет",
    icon: LayoutDashboard,
    isActive: false,
  },
  {
    title: "Отчеты",
    icon: CalendarClock,
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
  const maxAnalyticsValue = Math.max(...analytics.map((item) => item.value));

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-white p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid w-full max-w-7xl gap-5 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-3xl border border-white/70 bg-white/85 p-5 shadow-lg shadow-blue-100/60 backdrop-blur">
          <div className="mb-6 flex items-center gap-3 rounded-2xl bg-blue-50 p-3">
            <div className="rounded-xl bg-blue-100 p-2 text-blue-700">
              <UserRound size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-500">Профиль</p>
              <p className="text-sm font-semibold text-slate-900">Иван Иванов</p>
            </div>
          </div>

          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Меню</p>
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const menuClass = item.isActive
                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
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
              Выберите нужный раздел: создать анкету, открыть список анкет или посмотреть отчеты.
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
