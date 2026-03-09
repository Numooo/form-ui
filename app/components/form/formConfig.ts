export type FieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'date'
  | 'number'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'textarea';

export type FieldWidth = 'full' | 'half' | 'third' | 'two-thirds';

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldConfig {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  helper?: string;
  options?: FieldOption[];
  validate?: (value: string) => string | null;
  width?: FieldWidth;
  min?: number;
  max?: number;
}

export interface SectionConfig {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  fields: FieldConfig[];
}

// ─── Validators ────────────────────────────────────────────────────────────────

const validateEmail = (v: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Введите корректный адрес электронной почты';

const validatePhone = (v: string) =>
  /^[\+]?[\d\s\-\(\)]{10,16}$/.test(v.replace(/\s/g, ''))
    ? null
    : 'Введите корректный номер телефона';

const validateSNILS = (v: string) =>
  /^\d{3}-\d{3}-\d{3} \d{2}$/.test(v) ? null : 'Формат: 000-000-000 00';

const validateINN = (v: string) =>
  /^\d{12}$/.test(v) ? null : 'ИНН должен содержать ровно 12 цифр';

const validatePassportCode = (v: string) =>
  /^\d{3}-\d{3}$/.test(v) ? null : 'Формат: 000-000';

const validatePostalCode = (v: string) =>
  /^\d{6}$/.test(v) ? null : 'Индекс должен состоять из 6 цифр';

const optionalPhone = (v: string) => (v ? validatePhone(v) : null);

// ─── Sections ─────────────────────────────────────────────────────────────────

export const sections: SectionConfig[] = [
  {
    id: 'personal',
    title: 'Личные данные',
    subtitle: 'Основная персональная информация',
    emoji: '👤',
    fields: [
      {
        id: 'lastName',
        label: 'Фамилия',
        type: 'text',
        required: true,
        placeholder: 'Иванов',
        width: 'third',
      },
      {
        id: 'firstName',
        label: 'Имя',
        type: 'text',
        required: true,
        placeholder: 'Иван',
        width: 'third',
      },
      {
        id: 'middleName',
        label: 'Отчество',
        type: 'text',
        placeholder: 'Иванович',
        helper: 'При наличии',
        width: 'third',
      },
      {
        id: 'birthDate',
        label: 'Дата рождения',
        type: 'date',
        required: true,
        width: 'half',
      },
      {
        id: 'gender',
        label: 'Пол',
        type: 'radio',
        required: true,
        options: [
          { value: 'male', label: 'Мужской' },
          { value: 'female', label: 'Женский' },
        ],
        width: 'half',
      },
      {
        id: 'citizenship',
        label: 'Гражданство',
        type: 'select',
        required: true,
        options: [
          { value: 'ru', label: 'Российская Федерация' },
          { value: 'by', label: 'Республика Беларусь' },
          { value: 'kz', label: 'Республика Казахстан' },
          { value: 'ua', label: 'Украина' },
          { value: 'other', label: 'Другое' },
        ],
        width: 'half',
      },
      {
        id: 'snils',
        label: 'СНИЛС',
        type: 'text',
        placeholder: '000-000-000 00',
        helper: 'Страховой номер индивидуального лицевого счёта',
        validate: validateSNILS,
        width: 'half',
      },
      {
        id: 'inn',
        label: 'ИНН физического лица',
        type: 'text',
        placeholder: '000000000000',
        helper: '12 цифр без пробелов',
        validate: validateINN,
        width: 'half',
      },
    ],
  },
  {
    id: 'passport',
    title: 'Паспортные данные',
    subtitle: 'Данные основного удостоверяющего документа',
    emoji: '🪪',
    fields: [
      {
        id: 'passportSeries',
        label: 'Серия паспорта',
        type: 'text',
        required: true,
        placeholder: '0000',
        width: 'third',
      },
      {
        id: 'passportNumber',
        label: 'Номер паспорта',
        type: 'text',
        required: true,
        placeholder: '000000',
        width: 'third',
      },
      {
        id: 'passportCode',
        label: 'Код подразделения',
        type: 'text',
        required: true,
        placeholder: '000-000',
        validate: validatePassportCode,
        width: 'third',
      },
      {
        id: 'passportDate',
        label: 'Дата выдачи',
        type: 'date',
        required: true,
        width: 'half',
      },
      {
        id: 'birthPlace',
        label: 'Место рождения',
        type: 'text',
        required: true,
        placeholder: 'г. Москва',
        width: 'half',
      },
      {
        id: 'passportIssuer',
        label: 'Кем выдан',
        type: 'text',
        required: true,
        placeholder: 'УФМС России по г. Москве отдел №...',
        width: 'full',
      },
      {
        id: 'hasForeignPassport',
        label: 'Имеется действующий загранпаспорт',
        type: 'checkbox',
        width: 'half',
      },
    ],
  },
  {
    id: 'contact',
    title: 'Контактная информация',
    subtitle: 'Способы связи с вами',
    emoji: '📞',
    fields: [
      {
        id: 'email',
        label: 'Электронная почта',
        type: 'email',
        required: true,
        placeholder: 'example@mail.ru',
        validate: validateEmail,
        width: 'half',
      },
      {
        id: 'phone',
        label: 'Мобильный телефон',
        type: 'tel',
        required: true,
        placeholder: '+7 (900) 000-00-00',
        validate: validatePhone,
        width: 'half',
      },
      {
        id: 'phoneHome',
        label: 'Домашний телефон',
        type: 'tel',
        placeholder: '+7 (495) 000-00-00',
        helper: 'При наличии',
        validate: optionalPhone,
        width: 'half',
      },
      {
        id: 'telegram',
        label: 'Telegram',
        type: 'text',
        placeholder: '@username',
        helper: 'Необязательно',
        width: 'half',
      },
      {
        id: 'vkontakte',
        label: 'ВКонтакте',
        type: 'text',
        placeholder: 'vk.com/id или @username',
        helper: 'Необязательно',
        width: 'half',
      },
      {
        id: 'preferredContact',
        label: 'Предпочтительный способ связи',
        type: 'select',
        required: true,
        options: [
          { value: 'phone', label: 'Звонок' },
          { value: 'sms', label: 'SMS' },
          { value: 'email', label: 'Электронная почта' },
          { value: 'telegram', label: 'Telegram' },
          { value: 'whatsapp', label: 'WhatsApp' },
        ],
        width: 'half',
      },
      {
        id: 'bestCallTime',
        label: 'Удобное время для звонка',
        type: 'select',
        options: [
          { value: '9-12', label: 'С 9:00 до 12:00' },
          { value: '12-15', label: 'С 12:00 до 15:00' },
          { value: '15-18', label: 'С 15:00 до 18:00' },
          { value: '18-21', label: 'С 18:00 до 21:00' },
          { value: 'any', label: 'В любое время' },
        ],
        width: 'half',
      },
    ],
  },
  {
    id: 'address',
    title: 'Адрес проживания',
    subtitle: 'Фактический адрес места жительства',
    emoji: '🏠',
    fields: [
      {
        id: 'region',
        label: 'Регион',
        type: 'select',
        required: true,
        options: [
          { value: 'moscow', label: 'г. Москва' },
          { value: 'msk_obl', label: 'Московская область' },
          { value: 'spb', label: 'г. Санкт-Петербург' },
          { value: 'len_obl', label: 'Ленинградская область' },
          { value: 'nsk', label: 'Новосибирская область' },
          { value: 'ekb', label: 'Свердловская область' },
          { value: 'krasnodar', label: 'Краснодарский край' },
          { value: 'tatarstan', label: 'Республика Татарстан' },
          { value: 'bashkortostan', label: 'Республика Башкортостан' },
          { value: 'other', label: 'Другой регион' },
        ],
        width: 'half',
      },
      {
        id: 'city',
        label: 'Город / Населённый пункт',
        type: 'text',
        required: true,
        placeholder: 'Москва',
        width: 'half',
      },
      {
        id: 'street',
        label: 'Улица',
        type: 'text',
        required: true,
        placeholder: 'ул. Ленина',
        width: 'half',
      },
      {
        id: 'house',
        label: 'Дом',
        type: 'text',
        required: true,
        placeholder: '10',
        width: 'third',
      },
      {
        id: 'building',
        label: 'Корпус / Строение',
        type: 'text',
        placeholder: '2',
        width: 'third',
      },
      {
        id: 'apartment',
        label: 'Квартира',
        type: 'text',
        placeholder: '45',
        width: 'third',
      },
      {
        id: 'postalCode',
        label: 'Почтовый индекс',
        type: 'text',
        required: true,
        placeholder: '123456',
        helper: '6 цифр',
        validate: validatePostalCode,
        width: 'half',
      },
      {
        id: 'housingType',
        label: 'Тип жилья',
        type: 'select',
        required: true,
        options: [
          { value: 'owned', label: 'Собственное жильё' },
          { value: 'rented', label: 'Арендуемое жильё' },
          { value: 'parents', label: 'Жильё родителей / родственников' },
          { value: 'municipal', label: 'Муниципальное жильё' },
          { value: 'other', label: 'Другое' },
        ],
        width: 'half',
      },
    ],
  },
  {
    id: 'education',
    title: 'Образование',
    subtitle: 'Сведения о полученном образовании',
    emoji: '🎓',
    fields: [
      {
        id: 'educationLevel',
        label: 'Уровень образования',
        type: 'select',
        required: true,
        options: [
          { value: 'secondary', label: 'Среднее общее' },
          { value: 'secondary_spec', label: 'Среднее специальное / профессиональное' },
          { value: 'incomplete_higher', label: 'Неоконченное высшее' },
          { value: 'higher', label: 'Высшее (бакалавр / специалист)' },
          { value: 'higher_master', label: 'Высшее (магистр)' },
          { value: 'candidate', label: 'Кандидат наук' },
          { value: 'doctor', label: 'Доктор наук' },
        ],
        width: 'half',
      },
      {
        id: 'graduationYear',
        label: 'Год окончания',
        type: 'select',
        required: true,
        options: Array.from({ length: 55 }, (_, i) => {
          const year = 2025 - i;
          return { value: String(year), label: String(year) };
        }),
        width: 'half',
      },
      {
        id: 'institution',
        label: 'Учебное заведение',
        type: 'text',
        required: true,
        placeholder: 'МГУ им. М.В. Ломоносова',
        width: 'half',
      },
      {
        id: 'specialty',
        label: 'Специальность / Направление подготовки',
        type: 'text',
        required: true,
        placeholder: 'Экономика и финансы',
        width: 'half',
      },
      {
        id: 'honorsDiploma',
        label: 'Диплом с отличием',
        type: 'checkbox',
        width: 'half',
      },
      {
        id: 'additionalEducation',
        label: 'Дополнительное образование',
        type: 'textarea',
        placeholder: 'Курсы повышения квалификации, тренинги, сертификаты...',
        helper: 'Необязательно',
        width: 'full',
      },
    ],
  },
  {
    id: 'employment',
    title: 'Трудовая деятельность',
    subtitle: 'Текущее место работы и стаж',
    emoji: '💼',
    fields: [
      {
        id: 'employmentStatus',
        label: 'Статус занятости',
        type: 'select',
        required: true,
        options: [
          { value: 'employed', label: 'Работаю по найму' },
          { value: 'self_employed', label: 'Самозанятый' },
          { value: 'entrepreneur', label: 'Индивидуальный предприниматель' },
          { value: 'retired', label: 'Пенсионер' },
          { value: 'unemployed', label: 'Не работаю' },
          { value: 'student', label: 'Студент' },
        ],
        width: 'half',
      },
      {
        id: 'employer',
        label: 'Место работы',
        type: 'text',
        required: true,
        placeholder: 'ООО «Название компании»',
        width: 'half',
      },
      {
        id: 'position',
        label: 'Должность',
        type: 'text',
        required: true,
        placeholder: 'Менеджер по продажам',
        width: 'half',
      },
      {
        id: 'totalExperience',
        label: 'Общий трудовой стаж',
        type: 'select',
        required: true,
        options: [
          { value: '<1', label: 'Менее 1 года' },
          { value: '1-3', label: '1–3 года' },
          { value: '3-5', label: '3–5 лет' },
          { value: '5-10', label: '5–10 лет' },
          { value: '>10', label: 'Более 10 лет' },
        ],
        width: 'half',
      },
      {
        id: 'currentExperience',
        label: 'Стаж на текущем месте',
        type: 'select',
        required: true,
        options: [
          { value: '<3m', label: 'Менее 3 месяцев' },
          { value: '3-6m', label: '3–6 месяцев' },
          { value: '6-12m', label: '6–12 месяцев' },
          { value: '1-3', label: '1–3 года' },
          { value: '>3', label: 'Более 3 лет' },
        ],
        width: 'half',
      },
      {
        id: 'monthlyIncome',
        label: 'Ежемесячный доход до вычета налогов',
        type: 'number',
        required: true,
        placeholder: '80 000',
        helper: 'Укажите сумму в рублях',
        min: 0,
        width: 'half',
      },
      {
        id: 'employerPhone',
        label: 'Контактный телефон работодателя',
        type: 'tel',
        placeholder: '+7 (495) 000-00-00',
        helper: 'Необязательно',
        validate: optionalPhone,
        width: 'half',
      },
    ],
  },
  {
    id: 'financial',
    title: 'Финансовая информация',
    subtitle: 'Параметры кредитования и имущество',
    emoji: '💰',
    fields: [
      {
        id: 'loanAmount',
        label: 'Желаемая сумма кредита',
        type: 'number',
        required: true,
        placeholder: '500 000',
        helper: 'От 50 000 до 10 000 000 ₽',
        min: 50000,
        max: 10000000,
        width: 'half',
      },
      {
        id: 'loanTerm',
        label: 'Срок кредита',
        type: 'select',
        required: true,
        options: [
          { value: '6', label: '6 месяцев' },
          { value: '12', label: '1 год' },
          { value: '24', label: '2 года' },
          { value: '36', label: '3 года' },
          { value: '60', label: '5 лет' },
          { value: '84', label: '7 лет' },
          { value: '120', label: '10 лет' },
          { value: '180', label: '15 лет' },
          { value: '240', label: '20 лет' },
        ],
        width: 'half',
      },
      {
        id: 'loanPurpose',
        label: 'Цель кредита',
        type: 'select',
        required: true,
        options: [
          { value: 'consumer', label: 'Потребительские нужды' },
          { value: 'auto', label: 'Покупка автомобиля' },
          { value: 'real_estate', label: 'Покупка недвижимости' },
          { value: 'repair', label: 'Ремонт' },
          { value: 'education', label: 'Образование' },
          { value: 'business', label: 'Развитие бизнеса' },
          { value: 'refinancing', label: 'Рефинансирование' },
          { value: 'other', label: 'Другое' },
        ],
        width: 'half',
      },
      {
        id: 'hasProperty',
        label: 'Имущество в собственности',
        type: 'select',
        options: [
          { value: 'none', label: 'Отсутствует' },
          { value: 'apartment', label: 'Квартира' },
          { value: 'house', label: 'Дом / Коттедж' },
          { value: 'car', label: 'Автомобиль' },
          { value: 'land', label: 'Земельный участок' },
          { value: 'multiple', label: 'Несколько объектов' },
        ],
        width: 'half',
      },
      {
        id: 'hasGuarantor',
        label: 'Наличие поручителя',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Да, есть поручитель' },
          { value: 'no', label: 'Нет поручителя' },
        ],
        width: 'half',
      },
      {
        id: 'lifeInsurance',
        label: 'Страхование жизни и здоровья',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Согласен на страхование' },
          { value: 'no', label: 'Не требуется' },
        ],
        width: 'half',
      },
    ],
  },
  {
    id: 'additional',
    title: 'Дополнительно',
    subtitle: 'Прочие сведения и согласие',
    emoji: '📋',
    fields: [
      {
        id: 'maritalStatus',
        label: 'Семейное положение',
        type: 'select',
        required: true,
        options: [
          { value: 'single', label: 'Холост / Не замужем' },
          { value: 'married', label: 'Женат / Замужем' },
          { value: 'divorced', label: 'Разведён / Разведена' },
          { value: 'widowed', label: 'Вдовец / Вдова' },
          { value: 'civil', label: 'Гражданский брак' },
        ],
        width: 'half',
      },
      {
        id: 'dependents',
        label: 'Количество иждивенцев',
        type: 'number',
        placeholder: '0',
        helper: 'Дети до 18 лет, пожилые родители и иные лица',
        min: 0,
        max: 20,
        width: 'half',
      },
      {
        id: 'militaryDuty',
        label: 'Военнообязанный',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Да' },
          { value: 'no', label: 'Нет' },
          { value: 'na', label: 'Не применимо' },
        ],
        width: 'half',
      },
      {
        id: 'criminalRecord',
        label: 'Судимость',
        type: 'radio',
        options: [
          { value: 'none', label: 'Отсутствует' },
          { value: 'expired', label: 'Погашена' },
          { value: 'active', label: 'Имеется' },
        ],
        width: 'half',
      },
      {
        id: 'additionalInfo',
        label: 'Дополнительные сведения',
        type: 'textarea',
        placeholder: 'Укажите любую дополнительную информацию, которую считаете важной...',
        helper: 'Необязательно',
        width: 'full',
      },
      {
        id: 'agreeTerms',
        label: 'Даю согласие на обработку персональных данных и подтверждаю достоверность указанных сведений',
        type: 'checkbox',
        required: true,
        width: 'full',
      },
    ],
  },
];

// ─── Helper: get all required fields ─────────────────────────────────────────

export const getAllRequiredFields = (): FieldConfig[] =>
  sections.flatMap((s) => s.fields.filter((f) => f.required));

// ─── Helper: validate a single field ─────────────────────────────────────────

export const validateField = (
  field: FieldConfig,
  value: string | boolean
): string | null => {
  if (field.required) {
    if (typeof value === 'boolean' && !value)
      return 'Обязательное поле';
    if (typeof value === 'string' && !value.trim())
      return 'Обязательное поле';
  }
  if (typeof value === 'string' && value && field.validate) {
    return field.validate(value);
  }
  return null;
};
