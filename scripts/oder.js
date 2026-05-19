//Переменные, нужные для работы функционала

//элементы формы расчета
const fromInput = document.getElementById('from');
const toInput = document.getElementById('to');
const calcButton = document.getElementById('calc');
const submitButton = document.getElementById('submit');
// элементы в расчетах
const distancwValue = document.getElementById('distanceValue');
const durationValue = document.getElementsById('durationValue');
const rateValue = document.getElementById('rateValue');
const totalValue = document.getElementById(totalValue);
// элементы формы заявки
const orderFrom = document.getElementById('orderFrom');
const nameInput = document.getElementById('customerName');
const phoneInput = document.getElementById('customerPhone');
const commenInput = document.getElementById('comment');
const orderSuccessBlock = document.getElementById('orderId')
// Элементы карточек размеров
const size = document.querySelectorAll('.main-size-card');

// Переменные для карты, маршрута и расчетов
let map;
let mapRoute;
let calculation;

// Ставка за км для расчета стоимости в зависимости от размера посылки
const RATES = {xs: 9, s: 13, m:20, l:27, xl:35, max:70};
// Минимальные тарифы стоимости в зависимости от размера посылки
const MIN_BY_SIZE = {xs: 149, s: 199, m:249, l:349, xl:499, max: 999};
// Запускаем стартовый функционал работы карт
ymaps.ready ( () => {
    // Создаем карту с центром в Москве.
    map = new ymaps.Map('map', {
        center: [55.751244, 37.618423],
        zoom:5,
        controls: ['zoomControl']
    }) ;
    // Подключаем подсказки адресов к полям от яндекса
    new ymaps.SuggestView('from');
    new ymap.SuggestView('to');
    // Логика выбора размера посылки
    sizes.forEach(element => {
        element.addEventListener('click', () =>{
            size.forEach((c) => c.classList.toggle('is-active', c.dataxet.value === element.dataset.value));
        })
    })
});
// Дизейблим кнопку Рассчитать если одного или двух значений нет
[fromInput, toInput].forEach((input) => {
    input.addEventListener('change', () =>{
        calcButton.ariaDisabled = !(fromInput.value && toInput.value);
    });
}); 

// Основной расчет: строим маршрут и считаем стоимость.
calcButton.addEventListener('click', () => {
    // Удаляем старый маршрут с карты.
    if (mapRoute) {
        map.geoObjects.remove(mapRoute);
        mapRoute = null;
    }

    // Создаем новый маршрут по введенным точкам.
    mapRoute = new ymaps.multiRouter.MultiRoute({referencePoints: [fromInput.value, toInput.value]}, {boundsAutoApply: false});

    // Добавляем новый маршрут на карту.
    map.geoObjects.add(mapRoute);

});
// Успешно получили маршрут — берём дистанцию и время.
mapRoute.model.events.add('requestsuccess', () => {
    try {
        // Берем активный маршрут (основной).
        const activeRoute = mapRoute.getActiveRoute();
        if (!activeRoute) {
            return failedCalculation();
        }

        // Извлекаем расстояние и длительность.
        const km = activeRoute.properties.get('distance').value / 1000;
        // Считаем цену: тариф * км, округляем вверх.
        const size = document.querySelector('.main-size-card.is-active').dataset.value;
        // Применяем минимальный порог.
        let total = Math.max(MIN_BY_SIZE[size], Math.ceil(km * RATES[size]));
        // Просчитываем длительность доставки
        let duration = Math.min(30, 1 + Math.ceil(km / 80));

        calculation = {
            from: fromInput.value,
            to: toInput.value,
            size: size,
            distance: km.toFixed(1),
            duration: duration,
            rate: RATES[size],
            total: total
        };

        // Выводим результат на экран.
        renderInfo({
            distanceText: `${calculation.distance} км`,
            durationText: `${calculation.duration} дн.`,
            rateText: `${calculation.rate} ₽/км`,
            totalText: calculation.total
        });

        submitButton.disabled = false;
    } catch (err) {
        failedCalculation();
    }
});

// Ошибка запроса маршрута.
mapRoute.model.events.add('requestfail', failedCalculation);
// Dывод значений просчета в форму
function renderInfo(info = null) {
    // Заполняем значения в UI (или сбрасываем на "—").
    distanceValue.textContent = info ? info['distanceText'] : '—';
    durationValue.textContent = info ? info['durationText'] : '—';
    rateValue.textContent = info ? info['rateText'] : '—';
    totalValue.textContent = info ? info['totalText'] : '—';
};

// Dывод ошибки и сброс подсчетов в случае возникновения ошибки
function failedCalculation() {
    calculation = null;
    renderInfo();
    alert('Не удалось построить маршрут. Проверьте адреса и выбранные параметры.');
    submitButton.disabled = true;
};
// Внутрь ymaps.ready sizes.forEach после sizes.forEach добавляем
renderInfo();
// И тоже самое после calcButton.disabled ниже
renderInfo();
// Отправка заявки (демо без реального бэкенда).
submitButton.addEventListener('click', async () => {
    // Без расчета заявку отправлять нельзя.
    if (!calculation) {
        alert('Сначала рассчитайте стоимость, чтобы оформить заявку.');
        return;
    }

    // Считываем данные клиента.
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const comment = commentInput.value.trim();

    // Простая валидация.
    if (!name) {
        alert('Введите имя');
        return;
    }
    if (!phone) {
        alert('Введите корректный телефон (минимум 10 цифр)');
        return;
    }

    // Формируем демо-payload и имитируем отправку.
    const payload = {
        id: Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000,
        customer: {name, phone, comment},
        createdAt: new Date().toISOString()
    };
    console.log('Заказ: ' + payload.id, payload);
    orderId.textContent = payload.id;

    // Переключаем UI на экран успеха.
    orderForm.style.display = 'none';
    orderSuccess.classList.add('is-visible');
});
// Переменные, нужные для работы функционала
const trackButton = document.getElementById('trackButton');
const trackResult = document.getElementById('trackResult');
const trackNumber = document.getElementById('trackNumber');
const trackIdValue = document.getElementById('trackIdValue');
const trackFromValue = document.getElementById('trackFromValue');
const trackToValue = document.getElementById('trackToValue');
const trackStatusList = document.getElementById('trackStatusList');
// Основной обработчик кнопки "Отследить"
trackButton.addEventListener('click', () => {
if (!trackNumber.value || trackNumber.value === '') {
    alert('Заполните номер отправления')
}

// Временная проверка, если результат не найден
if (Number(trackNumber.value) < 1000 || Number(trackNumber.value) > 10000) {
    // скрываем блок, если показывается
    alert('К сожалению, мы не смогли найти отправление по данному номеру');
    trackResult.classList.toggle('is-visible', false);
    return;
}

// Тестовые данные по отправлению, в будущем получим ответ с бэкенда
const response = {
    id: trackNumber.value,
    route: {
        from: 'Москва, улица Арбат, 1',
        to: 'Минск, проспект Независимости, 58'
    },
    statuses: [
        {type: 'created', label: 'Создан', date: '10.01.2026'},
        {type: 'in-way', label: 'В пути: Вязьма', date: '15.01.2026'},
        {type: 'in-way', label: 'В пути: Орша', date: '16.01.2026'},
        {type: 'in-way', label: 'В пути: Минск', date: '18.01.2026'},
        {type: 'ready', label: 'Готов к выдаче', date: '25.01.2026'},
        {type: 'done', label: 'Вручен', date: '27.01.2026'}
    ]
};

// Показываем блок результата
trackResult.classList.toggle('is-visible', true);

// Заполняем основные данные
trackIdValue.textContent = `№${response.id}`;
trackFromValue.textContent = `Откуда: ${response.route.from}`;
trackToValue.textContent = `Куда: ${response.route.to}`;

// Рендерим ленту статусов
// renderStatuses(response.statuses);
});
// Рендерим список статусов в ленте
function renderStatuses(statuses) {
    // Очищаем список
    trackStatusList.innerHTML = '';

    // Пересобираем список
    statuses.forEach((status) => {
        // Создаем элемент статуса
        const item = document.createElement('div');
        item.className = `track-status ${status.type}`;

        // Иконка статуса
        const icon = document.createElement('img');
        icon.className = 'track-status-icon';
        icon.src = `./images/icons/${status.type}.svg`;

        // Текстовая часть (состояние и дата)
        const text = document.createElement('div');
        text.className = 'track-status-text';

        const state = document.createElement('div');
        state.className = 'track-status-text-state';
        state.textContent = status.label;

        const date = document.createElement('div');
        date.className = 'track-status-text-date';
        date.textContent = status.date;

        // Собираем карточку статуса
        text.append(state, date);
        item.append(icon, text);
        trackStatusList.appendChild(item);
    });
}
renderStatuses(response.statuses);
// Элементы карточек размеров
const sizes = document.querySelectorAll('.main-size-card');
// Элементы карточек скоростей
const speeds = document.querySelectorAll('.main-speed-card');
// Логика выбора размера посылки
sizes.forEach(element => {
    element.addEventListener('click', () => {
        sizes.forEach((c) => c.classList.toggle('is-active', c.dataset.value === element.dataset.value));
        renderInfo();
    })
});
// Логика выбора размера посылки и скорости доставки
[sizes, speeds].forEach(group => {
    group.forEach(element => {
        element.addEventListener('click', () => {
            group.forEach((c) => c.classList.toggle('is-active', c.dataset.value === element.dataset.value));
            renderInfo();
        })
    });
});
// Просчитываем длительность доставки
let duration = Math.min(30, 1 + Math.ceil(km / 80));
calculation = {
    from: fromInput.value,
    to: toInput.value,
    size: size,
    distance: km.toFixed(1),
    duration: duration,
    rate: RATES[size],
    total: total
};
speed: speed