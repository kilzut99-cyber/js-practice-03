/**
 * РЕАЛИЗОВАННЫЕ КОНЦЕПЦИИ JAVASCRIPT:
 * 1. Global Scope & Lexical Environment: Глобальные переменные доступны везде.
 * 2. Function Declaration: Функции, которые "всплывают" (Hoisting).
 * 3. Function Expression: Анонимные функции, сохраняемые в переменные.
 * 4. Arrow Functions: Лаконичный синтаксис ES6 для чистых вычислений.
 * 5. Closures (Замыкания): Способность функции "помнить" окружение, в котором она была создана.
 * 6. DOM Manipulation: Живое взаимодействие с HTML-элементами и CSS-классами.
 * 7. Single Responsibility — каждая функция выполняет только одну задачу.
 */

// Глобальные переменные (Global Scope)
const LBS_RATE = 2.20462;
const BMR_BONUS = 5; // Константа для демонстрации лексического окружения

// Объект с правилами диапазонов для "живой" валидации
const valRules = {
  weightBMI: { min: 20, max: 300 }, heightBMI: { min: 50, max: 250 },
  weightInput: { min: 0.1, max: 1000 },
  weightBMR: { min: 20, max: 300 }, heightBMR: { min: 50, max: 250 }, ageBMR: { min: 10, max: 120 },
  heightInput: { min: 50, max: 250 }, feetInput: { min: 1, max: 8 }, inchesInput: { min: 0, max: 11 },
  weightPro: { min: 20, max: 300 }, heightPro: { min: 50, max: 250 }
};

// --- 1. ТЕМА (Автоматическая смена по времени + Кнопка) ---
const themeBtn = document.getElementById('themeToggle');

/**
 * Функция переключения тем оформления.
 * Манипулирует классами body, что триггерит смену переменных в CSS.
 */
const switchTheme = (isDark) => {
  document.body.classList.toggle('dark-mode', isDark);
  themeBtn.innerText = isDark ? '☀️' : '🌙';
};

// Проверка времени суток: с 19:00 до 07:00 включаем темную тему
const hour = new Date().getHours();
switchTheme(hour >= 19 || hour < 7);

themeBtn.onclick = () => switchTheme(!document.body.classList.contains('dark-mode'));


// --- 2. ЖИВАЯ ВАЛИДАЦИЯ (Системный подход) ---
/**
 * Функция validate(el) проверяет значение поля в реальном времени.
 * Она добавляет классы .success или .error для визуального отклика.
 */
function validate(el) {
  const rule = valRules[el.id];
  if (!rule) return true;

  const val = parseFloat(el.value);
  const isValid = !isNaN(val) && val >= rule.min && val <= rule.max;

  // Если поле пустое, убираем индикацию рамок
  if (el.value === "") {
    el.classList.remove('error', 'success');
    return false;
  }

  // Переключение стилей рамок (зеленый/красный)
  if (isValid) {
    el.classList.add('success'); el.classList.remove('error');
  } else {
    el.classList.add('error'); el.classList.remove('success');
  }
  return isValid;
}

// Глобальный слушатель событий 'input' для мгновенной валидации и скрытия старых результатов
document.addEventListener('input', (e) => {
  if (e.target.tagName === 'INPUT') validate(e.target);
  if (e.target.tagName === 'SELECT') {
    e.target.value ? e.target.classList.add('success') : e.target.classList.remove('success');
  }
  
  // При изменении данных скрываем блок с результатом (для актуальности)
  const card = e.target.closest('section');
  if (card) card.querySelector('.result')?.classList.remove('show');
});

/**
 * Вспомогательная функция для вывода данных в плашку.
 */
function output(id, text) {
  const el = document.getElementById(id);
  el.innerText = text;
  el.classList.add('show');
}


// --- 3. РЕАЛИЗАЦИЯ ЗАДАНИЙ ---

// Задание 1 (Function Declaration)
/** 
 * ПРЕИМУЩЕСТВО: FD-функции поддерживают Hoisting. 
 * Это позволяет структурировать код, вызывая функции до их описания.
 */
// --- Расчет + определение категории ---
function calculateBMI(w, h) {
  const weight = parseFloat(w);
  const heightInMeters = parseFloat(h) / 100;
  
  // Вычисляем ИМТ
  let bmi = weight / (heightInMeters * heightInMeters);
  
  // Определение категории
  let category = "";
  if (bmi < 18.5) category = "Дефицит массы тела";
  else if (bmi < 25) category = "Норма";
  else if (bmi < 30) category = "Избыточный вес";
  else if (bmi < 35) category = "Ожирение I степени";
  else if (bmi < 40) category = "Ожирение II степени";
  else category = "Ожирение III степени";

  // Возвращаем строку с числом и категорией
  return `${bmi.toFixed(1)} (${category})`; 
}

function handleBMI() {
  const w = document.getElementById('weightBMI');
  const h = document.getElementById('heightBMI');
  
  // Используем логическое && для проверки валидации
  if (validate(w) && validate(h)) {
    // Получаем строку вида "24.5 (Норма)"
    const resultText = calculateBMI(w.value, h.value); 
    
    // Выводим результат в интерфейс
    output ('bmiResult', `Ваш ИМТ: ${resultText}`);
  }
}

// Задание 2 (Function Expression)
/** 
 * ОСОБЕННОСТЬ: Не поддерживают Hoisting. Доступны только ПОСЛЕ объявления.
 */
const toLbs = function(kg) { return (kg * LBS_RATE).toFixed(2); };
const toKg = function(lbs) { return (lbs / LBS_RATE).toFixed(2); };

function handleKgToLbs() {
  const el = document.getElementById('weightInput');
  if (validate(el)) output('weightResult', `${el.value} кг = ${toLbs(el.value)} фунтов`);
}

function handleLbsToKg() {
  const el = document.getElementById('weightInput');
  if (validate(el)) output('weightResult', `${el.value} фунтов = ${toKg(el.value)} кг`);
}

// Задание 3 (Lexical Environment & Scope)
function handleBMR() {
  const w = document.getElementById('weightBMR'), h = document.getElementById('heightBMR'), a = document.getElementById('ageBMR'), g = document.getElementById('genderBMR');
  
  if (validate(w) & validate(h) & validate(a) && g.value !== "") {
    /** 
     * Переменная BMR_BONUS берется из Глобальной области видимости.
     * Это работа лексического окружения (движок ищет переменную во внешней среде).
     */
    let bmr = (10 * w.value) + (6.25 * h.value) - (5 * a.value) + (g.value === 'male' ? BMR_BONUS : -161);
    const gText = g.value === 'male' ? 'мужчина' : 'женщина';
    output('bmrResult', `Ваша норма: ${Math.round(bmr)} ккал/день (${gText}, ${a.value} лет)`);
  } else if (!g.value) g.classList.add('error');
}

// Задание 4 (Arrow Functions)
/** 
 * ПРЕИМУЩЕСТВО: ES6 Arrow Functions идеальны для кратких расчетов в одну строку.
 * Округление дюймов и точный формат вывода (5'10").
 */
const cmToFtIn = (cm) => {
  const total = cm / 2.54;
  const ft = Math.floor(total / 12);
  const inc = Math.round(total % 12);
  return `${cm} см = ${ft}'${inc}" (${ft} футов ${inc} дюймов)`;
};

const ftInToCm = (f, i) => Math.round((f * 30.48) + (i * 2.54));

function handleCmToFeet() {
  const el = document.getElementById('heightInput');
  if (validate(el)) output('heightResult', cmToFtIn(el.value));
}

function handleFeetToCm() {
  const f = document.getElementById('feetInput'), i = document.getElementById('inchesInput');
  if (validate(f) & validate(i)) {
    output('heightResult2', `${f.value}'${i.value}"(${f.value} футов ${i.value} дюймов)= ${ftInToCm(f.value, i.value)} см`);
  } else if (i.value > 11) {
    alert("Дюймы не могут быть больше 11!");
  }
}

// Задание 5 (Closures / Замыкания)
/** 
 * ТЕОРИЯ: Внутренняя функция "захватывает" переменные min и max 
 * и продолжает иметь к ним доступ даже после того, как createValidator отработал.
 */
function createValidator(min, max) {
  return function(val) {
    return val >= min && val <= max; // Это замыкание
  };
}

const checkWeight = createValidator(20, 300);
const checkHeight = createValidator(50, 250);

function handleProValidation() {
  const w = document.getElementById('weightPro'), h = document.getElementById('heightPro');
  const wValid = checkWeight(parseFloat(w.value)), hValid = checkHeight(parseFloat(h.value));

  if (wValid && hValid) {
    output('proResult', "✅ Замыкание подтвердило корректность веса и роста!");
  } else {
    alert("Данные не соответствуют норме!");
  }
}