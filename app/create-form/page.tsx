"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from "next/link";
import {
    ArrowRight,
    ArrowUp,
    CheckCircle2,
    AlertCircle,
    Send,
    Menu,
    X,
    ChevronRight,
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
import { sections, validateField, getAllRequiredFields } from '../components/form/formConfig';
import { FormSection } from '../components/form/FormSection';
import { Sidebar } from '../components/form/Sidebar';

type SectionStatus = 'default' | 'success' | 'error';

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

export default function App() {
    const [values, setValues] = useState<Record<string, string | boolean>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [showErrors, setShowErrors] = useState(false);
    const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
    const [activeSection, setActiveSection] = useState<string>(sections[0].id);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);

    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
    const mainRef = useRef<HTMLDivElement>(null);

    // ─── Computed: required fields progress ───────────────────────────────────

    const allRequiredFields = getAllRequiredFields();
    const totalRequired = allRequiredFields.length;
    const completedRequired = allRequiredFields.filter((f) => {
        const val = values[f.id] ?? (f.type === 'checkbox' ? false : '');
        if (typeof val === 'boolean') return val;
        return typeof val === 'string' && val.trim() !== '';
    }).length;
    const progress = totalRequired > 0 ? Math.round((completedRequired / totalRequired) * 100) : 0;

    // ─── Section statuses ─────────────────────────────────────────────────────

    const getSectionStatus = useCallback(
        (sectionId: string): SectionStatus => {
            const section = sections.find((s) => s.id === sectionId);
            if (!section) return 'default';

            const hasAnyError = section.fields.some((f) => {
                const val = values[f.id] ?? (f.type === 'checkbox' ? false : '');
                const show = touched[f.id] || showErrors;
                return show && validateField(f, val) !== null;
            });

            if (hasAnyError) return 'error';

            const requiredFields = section.fields.filter((f) => f.required);
            if (requiredFields.length === 0) return 'default';

            const allComplete = requiredFields.every((f) => {
                const val = values[f.id] ?? (f.type === 'checkbox' ? false : '');
                if (typeof val === 'boolean') return val;
                return typeof val === 'string' && val.trim() !== '';
            });

            return allComplete ? 'success' : 'default';
        },
        [values, touched, showErrors]
    );

    const sectionStatuses: Record<string, SectionStatus> = Object.fromEntries(
        sections.map((s) => [s.id, getSectionStatus(s.id)])
    );

    // ─── Scroll tracking for active section ───────────────────────────────────

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id.replace('section-', '');
                        setActiveSection(id);
                    }
                });
            },
            { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
        );

        sections.forEach((s) => {
            const el = sectionRefs.current[s.id];
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    // ─── Back to top visibility ────────────────────────────────────────────────

    useEffect(() => {
        const handleScroll = () => setShowBackToTop(window.scrollY > 400);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // ─── Handlers ─────────────────────────────────────────────────────────────

    const handleChange = useCallback((id: string, value: string | boolean) => {
        setValues((prev) => ({ ...prev, [id]: value }));
    }, []);

    const handleBlur = useCallback((id: string) => {
        setTouched((prev) => ({ ...prev, [id]: true }));
    }, []);

    const handleToggleSection = useCallback((sectionId: string) => {
        setCollapsedSections((prev) => ({
            ...prev,
            [sectionId]: !prev[sectionId],
        }));
    }, []);

    const scrollToSection = useCallback((sectionId: string) => {
        const el = sectionRefs.current[sectionId];
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Expand if collapsed
            setCollapsedSections((prev) => ({ ...prev, [sectionId]: false }));
        }
        setSidebarOpen(false);
    }, []);

    // ─── Jump to next error ────────────────────────────────────────────────────

    const jumpToNextError = useCallback(() => {
        setShowErrors(true);

        for (const section of sections) {
            for (const field of section.fields) {
                const val = values[field.id] ?? (field.type === 'checkbox' ? false : '');
                if (validateField(field, val) !== null) {
                    // Expand section
                    setCollapsedSections((prev) => ({ ...prev, [section.id]: false }));

                    setTimeout(() => {
                        const el = document.getElementById(field.id);
                        if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            el.focus();
                            setTouched((prev) => ({ ...prev, [field.id]: true }));
                        }
                    }, 100);
                    return;
                }
            }
        }
    }, [values]);

    // ─── Submit ────────────────────────────────────────────────────────────────

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowErrors(true);

        // Mark all fields as touched
        const allTouched: Record<string, boolean> = {};
        sections.forEach((s) => s.fields.forEach((f) => (allTouched[f.id] = true)));
        setTouched(allTouched);

        // Check for errors
        const hasError = sections.some((s) =>
            s.fields.some((f) => {
                const val = values[f.id] ?? (f.type === 'checkbox' ? false : '');
                return validateField(f, val) !== null;
            })
        );

        if (hasError) {
            // Jump to first error
            jumpToNextError();
            return;
        }

        setFormSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ─── Error / Missing count for button ─────────────────────────────────────

    const missingCount = sections.reduce((count, section) => {
        return (
            count +
            section.fields.filter((f) => {
                const val = values[f.id] ?? (f.type === 'checkbox' ? false : '');
                return validateField(f, val) !== null;
            }).length
        );
    }, 0);

    // ─── Success Screen ────────────────────────────────────────────────────────

    if (formSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-3xl shadow-xl p-12 max-w-lg w-full text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} className="text-green-500" />
                    </div>
                    <h1 className="text-gray-900 mb-3">Заявка успешно отправлена!</h1>
                    <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                        Спасибо! Ваша анкета получена. Наш специалист свяжется с вами
                        в ближайшее рабочее время.
                    </p>
                    <div className="bg-gray-50 rounded-2xl p-4 text-left space-y-2 mb-8">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
                            <span>Анкета принята в обработку</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
                            <span>Данные проверены и сохранены</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
                            <span>Ожидайте обратный звонок</span>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setFormSubmitted(false);
                            setValues({});
                            setTouched({});
                            setShowErrors(false);
                        }}
                        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors"
                    >
                        Заполнить новую заявку
                    </button>
                </div>
            </div>
        );
    }

    // ─── Main Form ─────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-slate-50" ref={mainRef}>
            {/* ── Sticky Top Header ─────────────────────────────────────────────── */}
            <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-100 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-14 gap-4">
                        {/* Mobile sidebar toggle */}
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <Menu size={18} />
                            <span className="hidden sm:inline">Навигация</span>
                        </button>

                        {/* Title */}
                        <div className="flex items-center gap-2 min-w-0">
                            <Link href={'/'} className="text-sm text-blue-600 truncate hidden sm:block">
                Главная страница
              </Link>
                            <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
              <span className="text-sm text-gray-900 truncate">
                Анкета заявителя
              </span>
                            {activeSection && (
                                <>
                                    <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
                                    <span className="text-sm text-blue-600 truncate hidden sm:block">
                    {sections.find((s) => s.id === activeSection)?.title}
                  </span>
                                </>
                            )}
                        </div>

                        {/* Progress + Jump Button */}
                        <div className="flex items-center gap-3">
                            {/* Top progress bar */}
                            <div className="flex items-center gap-2">
                                <div className="w-24 sm:w-40 h-1.5 rounded-full bg-gray-100 overflow-hidden hidden xs:block">
                                    <div
                                        className={`h-full rounded-full transition-all duration-700 ${
                                            progress === 100
                                                ? 'bg-gradient-to-r from-green-400 to-green-500'
                                                : 'bg-gradient-to-r from-blue-400 to-blue-600'
                                        }`}
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <span
                                    className={`text-sm tabular-nums flex-shrink-0 transition-colors ${
                                        progress === 100 ? 'text-green-600' : 'text-gray-500'
                                    }`}
                                >
                  {progress}%
                </span>
                            </div>

                            {/* Jump to next error */}
                            {missingCount > 0 && (
                                <button
                                    type="button"
                                    onClick={jumpToNextError}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs transition-colors border border-red-100"
                                >
                                    <AlertCircle size={13} />
                                    <span className="hidden sm:inline">Перейти к ошибке</span>
                                    <span className="sm:hidden">{missingCount}</span>
                                    <span className="bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center flex-shrink-0 hidden sm:flex">
                    {missingCount > 9 ? '9+' : missingCount}
                  </span>
                                </button>
                            )}
                            {progress === 100 && (
                                <span className="flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle2 size={14} />
                  <span className="hidden sm:inline">Готово к отправке</span>
                </span>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Mobile Sidebar Drawer ──────────────────────────────────────────── */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl overflow-y-auto p-4">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-gray-700">Навигация по разделам</span>
                            <button
                                type="button"
                                onClick={() => setSidebarOpen(false)}
                                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <Sidebar
                            sections={sections}
                            sectionStatuses={sectionStatuses}
                            activeSection={activeSection}
                            progress={progress}
                            totalRequired={totalRequired}
                            completedRequired={completedRequired}
                            onNavigate={scrollToSection}
                        />
                    </div>
                </div>
            )}

            {/* ── Page Content ──────────────────────────────────────────────────── */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
                {/* Page title area */}
                <div className="mb-6">
                    <h1 className="text-gray-900 mb-1">Анкета заявителя</h1>
                    <p className="text-sm text-gray-500">
                        Пожалуйста, заполните все поля, отмеченные{' '}
                        <span className="text-red-500">*</span>. Остальные поля — по желанию.
                    </p>
                    {showErrors && missingCount > 0 && (
                        <div className="mt-3 flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                            <AlertCircle size={15} className="flex-shrink-0" />
                            <span>
                Обнаружено {missingCount} незаполненных обязательных{' '}
                                {missingCount === 1 ? 'поле' : missingCount < 5 ? 'поля' : 'полей'}.{' '}
                                <button
                                    type="button"
                                    onClick={jumpToNextError}
                                    className="underline hover:no-underline"
                                >
                  Перейти к первому
                </button>
              </span>
                        </div>
                    )}
                </div>

                <div className="flex gap-6 items-start">
                    {/* ── Sticky Sidebar ─────────────────────────────────────────────── */}
                    <div className="hidden lg:block w-64 xl:w-72 flex-shrink-0 sticky top-20">
                        <Sidebar
                            sections={sections}
                            sectionStatuses={sectionStatuses}
                            activeSection={activeSection}
                            progress={progress}
                            totalRequired={totalRequired}
                            completedRequired={completedRequired}
                            onNavigate={scrollToSection}
                        />
                    </div>

                    {/* ── Form Sections ──────────────────────────────────────────────── */}
                    <form
                        onSubmit={handleSubmit}
                        className="flex-1 min-w-0 flex flex-col gap-4"
                        noValidate
                    >
                        {sections.map((section) => (
                            <FormSection
                                key={section.id}
                                section={section}
                                values={values}
                                touched={touched}
                                showErrors={showErrors}
                                collapsed={!!collapsedSections[section.id]}
                                sectionRef={(el) => {
                                    sectionRefs.current[section.id] = el;
                                }}
                                onToggle={() => handleToggleSection(section.id)}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                status={sectionStatuses[section.id]}
                            />
                        ))}

                        {/* ── Submit Bar ──────────────────────────────────────────────── */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm text-gray-900">
                                        {progress === 100 ? (
                                            <span className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 size={16} />
                        Все обязательные поля заполнены
                      </span>
                                        ) : (
                                            <span className="text-gray-700">
                        Заполнено {completedRequired} из {totalRequired} обязательных полей
                      </span>
                                        )}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        Нажимая «Отправить», вы подтверждаете достоверность данных
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 flex-shrink-0">
                                    {missingCount > 0 && (
                                        <button
                                            type="button"
                                            onClick={jumpToNextError}
                                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm transition-colors"
                                        >
                                            <ArrowRight size={15} />
                                            Следующее незаполненное
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        className={`
                      flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm text-white transition-all duration-200
                      ${progress === 100
                                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg shadow-blue-200'
                                            : 'bg-gray-400 cursor-pointer hover:bg-gray-500'
                                        }
                    `}
                                    >
                                        <Send size={15} />
                                        Отправить заявку
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* ── Floating: Back to top ─────────────────────────────────────────── */}
            {showBackToTop && (
                <button
                    type="button"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="fixed bottom-6 right-6 z-30 w-10 h-10 bg-white hover:bg-gray-50 border border-gray-200 rounded-full shadow-md flex items-center justify-center text-gray-500 transition-all hover:shadow-lg"
                    aria-label="Наверх"
                >
                    <ArrowUp size={17} />
                </button>
            )}

            {/* ── Section completion summary strip ──────────────────────────────── */}
            <div className="sticky bottom-0 z-20 bg-white border-t border-gray-100 shadow-[0_-1px_8px_rgba(0,0,0,0.05)]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center gap-1 sm:gap-2 py-2 overflow-x-auto no-scrollbar">
                        {sections.map((section) => {
                            const status = sectionStatuses[section.id];
                            const requiredFields = section.fields.filter((f) => f.required);
                            const missingRequiredCount = requiredFields.filter((f) => {
                                const val = values[f.id] ?? (f.type === 'checkbox' ? false : '');
                                if (typeof val === 'boolean') return !val;
                                return !(typeof val === 'string' && val.trim() !== '');
                            }).length;
                            const isRequiredFilled =
                                requiredFields.length > 0 &&
                                missingRequiredCount === 0;
                            const SectionIcon =
                                sectionIcons[section.id as keyof typeof sectionIcons] ?? CircleHelp;

                            if (isRequiredFilled) return null;

                            return (
                                <button
                                    key={section.id}
                                    type="button"
                                    onClick={() => scrollToSection(section.id)}
                                    className={`
                    flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg text-xs flex-shrink-0 transition-all duration-150
                    ${activeSection === section.id
                                        ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                        : status === 'success'
                                            ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                            : status === 'error'
                                                ? 'bg-amber-50 text-[#fc9a29] hover:bg-amber-100'
                                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                    }
                  `}
                                >
                                    <SectionIcon size={13} />
                                    <span className="hidden sm:inline">{section.title}</span>
                                    <span className="rounded-full bg-[#fc9a29] text-white text-[10px] leading-none px-1.5 py-1">
                                        {missingRequiredCount}
                                    </span>
                                </button>
                            );
                        })}

                        {/* Global progress pill */}
                        <div className="ml-auto flex-shrink-0 flex items-center gap-2 pl-3">
                            <div className="w-16 sm:w-24 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ${
                                        progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                                    }`}
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <span className="text-xs text-gray-400 tabular-nums">
                {progress}%
              </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

