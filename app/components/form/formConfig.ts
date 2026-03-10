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

const validateEmail = (v: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
    ? null
    : 'Введите корректный адрес электронной почты';

const validatePhone = (v: string) =>
  /^[\+]?[\d\s\-\(\)]{10,16}$/.test(v.replace(/\s/g, ''))
    ? null
    : 'Введите корректный номер телефона';

const validateTaxId = (v: string) =>
  /^\d{12}$/.test(v) ? null : 'ИИН/БИН должен содержать 12 цифр';

const validateHsCode = (v: string) =>
  /^\d{10}$/.test(v) ? null : 'Код ТН ВЭД должен содержать 10 цифр';

const validateOptionalPhone = (v: string) => (v ? validatePhone(v) : null);

export const sections: SectionConfig[] = [
  {
    id: 'personal',
    title: 'Декларант',
    subtitle: 'Данные компании или физического лица, подающего декларацию',
    emoji: '🧾',
    fields: [
      {
        id: 'declarantType',
        label: 'Тип декларанта',
        type: 'radio',
        required: true,
        options: [
          { value: 'company', label: 'Юридическое лицо' },
          { value: 'individual', label: 'Физическое лицо' },
          { value: 'broker', label: 'Таможенный представитель' },
        ],
        width: 'full',
      },
      {
        id: 'declarantName',
        label: 'Наименование / ФИО декларанта',
        type: 'text',
        required: true,
        placeholder: 'ТОО "Global Trade" / Иванов Иван Иванович',
        width: 'two-thirds',
      },
      {
        id: 'declarantTaxId',
        label: 'ИИН / БИН',
        type: 'text',
        required: true,
        placeholder: '123456789012',
        helper: '12 цифр без пробелов',
        validate: validateTaxId,
        width: 'third',
      },
      {
        id: 'contactPerson',
        label: 'Контактное лицо',
        type: 'text',
        required: true,
        placeholder: 'Иванов Иван',
        width: 'half',
      },
      {
        id: 'declarantCountry',
        label: 'Страна регистрации',
        type: 'select',
        required: true,
        options: [
          { value: 'kz', label: 'Казахстан' },
          { value: 'ru', label: 'Россия' },
          { value: 'cn', label: 'Китай' },
          { value: 'tr', label: 'Турция' },
          { value: 'eu', label: 'Страна ЕС' },
          { value: 'other', label: 'Другая страна' },
        ],
        width: 'half',
      },
      {
        id: 'declarantEmail',
        label: 'Электронная почта',
        type: 'email',
        required: true,
        placeholder: 'logistics@company.kz',
        validate: validateEmail,
        width: 'half',
      },
      {
        id: 'declarantPhone',
        label: 'Телефон',
        type: 'tel',
        required: true,
        placeholder: '+7 777 000 00 00',
        validate: validatePhone,
        width: 'half',
      },
    ],
  },
  {
    id: 'passport',
    title: 'Получатель',
    subtitle: 'Сведения о получателе груза и адресе доставки',
    emoji: '📦',
    fields: [
      {
        id: 'receiverName',
        label: 'Получатель',
        type: 'text',
        required: true,
        placeholder: 'ОсОО "Import Partner"',
        width: 'half',
      },
      {
        id: 'receiverTaxId',
        label: 'ИИН / БИН получателя',
        type: 'text',
        placeholder: '123456789012',
        validate: validateTaxId,
        width: 'half',
      },
      {
        id: 'receiverCountry',
        label: 'Страна получателя',
        type: 'select',
        required: true,
        options: [
          { value: 'kz', label: 'Казахстан' },
          { value: 'kg', label: 'Кыргызстан' },
          { value: 'uz', label: 'Узбекистан' },
          { value: 'ru', label: 'Россия' },
          { value: 'other', label: 'Другая страна' },
        ],
        width: 'half',
      },
      {
        id: 'receiverCity',
        label: 'Город получателя',
        type: 'text',
        required: true,
        placeholder: 'Алматы',
        width: 'half',
      },
      {
        id: 'receiverAddress',
        label: 'Адрес доставки',
        type: 'textarea',
        required: true,
        placeholder: 'г. Алматы, ул. ..., склад ...',
        width: 'full',
      },
      {
        id: 'deliveryContact',
        label: 'Контакт для доставки',
        type: 'text',
        placeholder: 'Петров Петр',
        width: 'half',
      },
      {
        id: 'deliveryPhone',
        label: 'Телефон получателя',
        type: 'tel',
        placeholder: '+7 701 000 00 00',
        validate: validateOptionalPhone,
        width: 'half',
      },
    ],
  },
  {
    id: 'contact',
    title: 'Груз',
    subtitle: 'Основные характеристики товаров для оформления',
    emoji: '🚚',
    fields: [
      {
        id: 'cargoName',
        label: 'Наименование товара',
        type: 'text',
        required: true,
        placeholder: 'Электронные компоненты',
        width: 'two-thirds',
      },
      {
        id: 'goodsCount',
        label: 'Количество товарных позиций',
        type: 'number',
        required: true,
        placeholder: '3',
        min: 1,
        width: 'third',
      },
      {
        id: 'hsCode',
        label: 'Код ТН ВЭД',
        type: 'text',
        required: true,
        placeholder: '8542399000',
        helper: '10 цифр',
        validate: validateHsCode,
        width: 'half',
      },
      {
        id: 'originCountry',
        label: 'Страна происхождения',
        type: 'select',
        required: true,
        options: [
          { value: 'cn', label: 'Китай' },
          { value: 'tr', label: 'Турция' },
          { value: 'de', label: 'Германия' },
          { value: 'kr', label: 'Южная Корея' },
          { value: 'ru', label: 'Россия' },
          { value: 'other', label: 'Другая страна' },
        ],
        width: 'half',
      },
      {
        id: 'grossWeight',
        label: 'Вес брутто, кг',
        type: 'number',
        required: true,
        placeholder: '1250',
        min: 0,
        width: 'half',
      },
      {
        id: 'netWeight',
        label: 'Вес нетто, кг',
        type: 'number',
        required: true,
        placeholder: '1180',
        min: 0,
        width: 'half',
      },
      {
        id: 'packagesCount',
        label: 'Количество мест',
        type: 'number',
        required: true,
        placeholder: '24',
        min: 1,
        width: 'half',
      },
      {
        id: 'packageType',
        label: 'Тип упаковки',
        type: 'select',
        required: true,
        options: [
          { value: 'boxes', label: 'Короба' },
          { value: 'pallets', label: 'Паллеты' },
          { value: 'bags', label: 'Мешки' },
          { value: 'rolls', label: 'Рулоны' },
          { value: 'mixed', label: 'Смешанная упаковка' },
        ],
        width: 'half',
      },
      {
        id: 'cargoDescription',
        label: 'Описание груза',
        type: 'textarea',
        placeholder: 'Материал, назначение, состав, марка, модель',
        helper: 'Помогает ускорить проверку и подбор кода ТН ВЭД',
        width: 'full',
      },
    ],
  },
  {
    id: 'address',
    title: 'Маршрут и транспорт',
    subtitle: 'Как и откуда груз следует через таможню',
    emoji: '🛃',
    fields: [
      {
        id: 'departureCountry',
        label: 'Страна отправления',
        type: 'select',
        required: true,
        options: [
          { value: 'cn', label: 'Китай' },
          { value: 'tr', label: 'Турция' },
          { value: 'ru', label: 'Россия' },
          { value: 'uae', label: 'ОАЭ' },
          { value: 'eu', label: 'Страна ЕС' },
          { value: 'other', label: 'Другая страна' },
        ],
        width: 'half',
      },
      {
        id: 'destinationCountry',
        label: 'Страна назначения',
        type: 'select',
        required: true,
        options: [
          { value: 'kz', label: 'Казахстан' },
          { value: 'kg', label: 'Кыргызстан' },
          { value: 'uz', label: 'Узбекистан' },
          { value: 'tj', label: 'Таджикистан' },
          { value: 'other', label: 'Другая страна' },
        ],
        width: 'half',
      },
      {
        id: 'transportMode',
        label: 'Вид транспорта',
        type: 'radio',
        required: true,
        options: [
          { value: 'road', label: 'Авто' },
          { value: 'rail', label: 'Ж/д' },
          { value: 'air', label: 'Авиа' },
          { value: 'sea', label: 'Море' },
          { value: 'multimodal', label: 'Мультимодально' },
        ],
        width: 'full',
      },
      {
        id: 'vehicleNumber',
        label: 'Номер ТС / рейса / контейнера',
        type: 'text',
        placeholder: 'KZ 123 ABC / CA1234 / MSKU1234567',
        width: 'half',
      },
      {
        id: 'borderPoint',
        label: 'Пункт пропуска / СВХ',
        type: 'text',
        required: true,
        placeholder: 'Хоргос',
        width: 'half',
      },
      {
        id: 'incoterms',
        label: 'Условия поставки Incoterms',
        type: 'select',
        required: true,
        options: [
          { value: 'exw', label: 'EXW' },
          { value: 'fca', label: 'FCA' },
          { value: 'cpt', label: 'CPT' },
          { value: 'cip', label: 'CIP' },
          { value: 'dap', label: 'DAP' },
          { value: 'ddp', label: 'DDP' },
          { value: 'fob', label: 'FOB' },
          { value: 'cif', label: 'CIF' },
        ],
        width: 'half',
      },
      {
        id: 'plannedArrivalDate',
        label: 'Планируемая дата прибытия',
        type: 'date',
        required: true,
        width: 'half',
      },
    ],
  },
  {
    id: 'education',
    title: 'Документы',
    subtitle: 'Базовый комплект документов для таможенного оформления',
    emoji: '📄',
    fields: [
      {
        id: 'invoiceNumber',
        label: 'Номер инвойса',
        type: 'text',
        required: true,
        placeholder: 'INV-2026-00124',
        width: 'half',
      },
      {
        id: 'invoiceDate',
        label: 'Дата инвойса',
        type: 'date',
        required: true,
        width: 'half',
      },
      {
        id: 'contractNumber',
        label: 'Контракт / договор',
        type: 'text',
        required: true,
        placeholder: 'GT-IMP-26/03',
        width: 'half',
      },
      {
        id: 'packingListNumber',
        label: 'Упаковочный лист',
        type: 'text',
        placeholder: 'PL-204',
        width: 'half',
      },
      {
        id: 'certificateInfo',
        label: 'Сертификаты / разрешительные документы',
        type: 'textarea',
        placeholder: 'Сертификат соответствия, СГР, нотификация, лицензия и т.д.',
        width: 'full',
      },
      {
        id: 'needBroker',
        label: 'Нужен таможенный брокер',
        type: 'checkbox',
        width: 'half',
      },
      {
        id: 'dangerousGoods',
        label: 'Груз относится к опасным / специальным',
        type: 'checkbox',
        width: 'half',
      },
    ],
  },
  {
    id: 'employment',
    title: 'Стоимость',
    subtitle: 'Данные для расчета таможенной стоимости и платежей',
    emoji: '💵',
    fields: [
      {
        id: 'currency',
        label: 'Валюта контракта',
        type: 'select',
        required: true,
        options: [
          { value: 'usd', label: 'USD' },
          { value: 'eur', label: 'EUR' },
          { value: 'cny', label: 'CNY' },
          { value: 'kzt', label: 'KZT' },
          { value: 'rub', label: 'RUB' },
        ],
        width: 'half',
      },
      {
        id: 'invoiceValue',
        label: 'Стоимость по инвойсу',
        type: 'number',
        required: true,
        placeholder: '25000',
        min: 0,
        width: 'half',
      },
      {
        id: 'freightCost',
        label: 'Транспортные расходы',
        type: 'number',
        placeholder: '3200',
        min: 0,
        width: 'half',
      },
      {
        id: 'insuranceCost',
        label: 'Страхование',
        type: 'number',
        placeholder: '450',
        min: 0,
        width: 'half',
      },
      {
        id: 'additionalCharges',
        label: 'Прочие начисления',
        type: 'number',
        placeholder: '0',
        min: 0,
        width: 'half',
      },
      {
        id: 'paymentMethod',
        label: 'Форма оплаты',
        type: 'select',
        required: true,
        options: [
          { value: 'bank', label: 'Банковский перевод' },
          { value: 'cashless', label: 'Безналичный расчет' },
          { value: 'advance', label: 'Предоплата' },
          { value: 'postpay', label: 'Постоплата' },
          { value: 'mixed', label: 'Смешанная схема' },
        ],
        width: 'half',
      },
      {
        id: 'customsValueComment',
        label: 'Комментарий по стоимости',
        type: 'textarea',
        placeholder: 'Скидки, бонусы, роялти, комиссионные, дополнительные расходы',
        width: 'full',
      },
    ],
  },
  {
    id: 'financial',
    title: 'Оформление',
    subtitle: 'Параметры подачи декларации и прохождения контроля',
    emoji: '🏛️',
    fields: [
      {
        id: 'declarationType',
        label: 'Тип декларации',
        type: 'select',
        required: true,
        options: [
          { value: 'import', label: 'Импорт' },
          { value: 'export', label: 'Экспорт' },
          { value: 'transit', label: 'Транзит' },
          { value: 'temporary', label: 'Временный ввоз / вывоз' },
        ],
        width: 'half',
      },
      {
        id: 'customsProcedure',
        label: 'Таможенная процедура',
        type: 'select',
        required: true,
        options: [
          { value: 'release', label: 'Выпуск для внутреннего потребления' },
          { value: 'warehouse', label: 'Таможенный склад' },
          { value: 'reexport', label: 'Реэкспорт' },
          { value: 'processing', label: 'Переработка' },
          { value: 'transit', label: 'Таможенный транзит' },
        ],
        width: 'half',
      },
      {
        id: 'customsOffice',
        label: 'Таможенный пост / орган',
        type: 'text',
        required: true,
        placeholder: 'Алматы-ЦТО',
        width: 'half',
      },
      {
        id: 'inspectionFormat',
        label: 'Формат контроля',
        type: 'radio',
        required: true,
        options: [
          { value: 'auto', label: 'Автовыпуск' },
          { value: 'documentary', label: 'Документарный контроль' },
          { value: 'inspection', label: 'Досмотр' },
        ],
        width: 'half',
      },
      {
        id: 'clearanceDeadline',
        label: 'Крайний срок оформления',
        type: 'date',
        width: 'half',
      },
      {
        id: 'temporaryStorage',
        label: 'Склад временного хранения',
        type: 'text',
        placeholder: 'СВХ Хоргос Терминал',
        width: 'half',
      },
      {
        id: 'dutyEstimate',
        label: 'Ожидаемая сумма пошлины',
        type: 'number',
        placeholder: '150000',
        min: 0,
        width: 'half',
      },
      {
        id: 'vatEstimate',
        label: 'Ожидаемый НДС',
        type: 'number',
        placeholder: '240000',
        min: 0,
        width: 'half',
      },
    ],
  },
  {
    id: 'additional',
    title: 'Подтверждение',
    subtitle: 'Финальные отметки и дополнительные комментарии',
    emoji: '✅',
    fields: [
      {
        id: 'originalDocsReady',
        label: 'Оригиналы документов готовы к предоставлению',
        type: 'checkbox',
        required: true,
        width: 'full',
      },
      {
        id: 'inspectionReady',
        label: 'Готовы обеспечить досмотр / осмотр груза при необходимости',
        type: 'checkbox',
        width: 'full',
      },
      {
        id: 'storageLocation',
        label: 'Место нахождения груза',
        type: 'text',
        required: true,
        placeholder: 'СВХ Алматы, склад 4',
        width: 'half',
      },
      {
        id: 'specialMarks',
        label: 'Особые отметки',
        type: 'select',
        options: [
          { value: 'none', label: 'Нет' },
          { value: 'temperature', label: 'Температурный режим' },
          { value: 'fragile', label: 'Хрупкий груз' },
          { value: 'licensed', label: 'Лицензируемый товар' },
          { value: 'sanitary', label: 'Санитарный / фитоконтроль' },
        ],
        width: 'half',
      },
      {
        id: 'additionalInfo',
        label: 'Комментарий для декларанта',
        type: 'textarea',
        placeholder: 'Любая дополнительная информация по товару, маршруту или ограничениям',
        width: 'full',
      },
      {
        id: 'agreeTerms',
        label:
          'Подтверждаю достоверность сведений и согласие на обработку данных для таможенного оформления',
        type: 'checkbox',
        required: true,
        width: 'full',
      },
    ],
  },
];

export const getAllRequiredFields = (): FieldConfig[] =>
  sections.flatMap((s) => s.fields.filter((f) => f.required));

export const validateField = (
  field: FieldConfig,
  value: string | boolean
): string | null => {
  if (field.required) {
    if (typeof value === 'boolean' && !value) {
      return 'Обязательное поле';
    }

    if (typeof value === 'string' && !value.trim()) {
      return 'Обязательное поле';
    }
  }

  if (field.type === 'number' && typeof value === 'string' && value.trim()) {
    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
      return 'Введите числовое значение';
    }

    if (field.min !== undefined && numericValue < field.min) {
      return `Минимальное значение: ${field.min}`;
    }

    if (field.max !== undefined && numericValue > field.max) {
      return `Максимальное значение: ${field.max}`;
    }
  }

  if (typeof value === 'string' && value && field.validate) {
    return field.validate(value);
  }

  return null;
};
