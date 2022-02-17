/* Задание - поиск стран
Создай фронтенд часть приложения поиска данных о стране по её частичному или полному имени. Посмотри демо видео работы приложения.

HTTP-запросы
Используй публичный API Rest Countries, а именно ресурс name, возвращающий массив объектов стран удовлетворивших критерий поиска. Добавь минимальное оформление элементов интерфейса.

Напиши функцию fetchCountries(name) которая делает HTTP-запрос на ресурс name и возвращает промис с массивом стран - результатом запроса. Вынеси её в отдельный файл fetchCountries.js и сделай именованный экспорт.
/////
Фильтрация полей
В ответе от бэкенда возвращаются объекты, большая часть свойств которых тебе не пригодится. Чтобы сократить объем передаваемых данных добавь строку параметров запроса - так этот бэкенд реализует фильтрацию полей. Ознакомься с документацией синтаксиса фильтров.

Тебе нужны только следующие свойства:

name.official - полное имя страны!
capital - столица
population - население
flags.svg - ссылка на изображение флага
languages - массив языков


Поле поиска (!!!)

Название страны для поиска пользователь вводит в текстовое поле input#search-box. HTTP-запросы выполняются при наборе имени страны, то есть по событию input. Но, делать запрос при каждом нажатии клавиши нельзя, так как одновременно получится много запросов и они будут выполняться в непредсказуемом порядке.

Необходимо применить приём Debounce на обработчике события и делать HTTP-запрос спустя 300мс после того, как пользователь перестал вводить текст. Используй пакет lodash.debounce.

(!) Если пользователь полностью очищает поле поиска, то HTTP-запрос не выполняется, а разметка списка стран или информации о стране пропадает.

Выполни санитизацию введенной строки методом trim(), это решит проблему когда в поле ввода только пробелы или они есть в начале и в конце строки.

Интерфейс
Если в ответе бэкенд вернул больше чем 10 стран, в интерфейсе пояляется уведомление о том, что имя должно быть более специфичным. Для уведомлений используй библиотеку notiflix и выводи такую строку "Too many matches found. Please enter a more specific name.".

Если бэкенд вернул от 2-х до 10-х стран, под тестовым полем отображается список найденных стран. Каждый элемент списка состоит из флага и имени страны.

Если результат запроса это массив с одной страной, в интерфейсе отображается разметка карточки с данными о стране: флаг, название, столица, население и языки.

ВНИМАНИЕ
Достаточно чтобы приложение работало для большинства стран. Некоторые страны, такие как Sudan, могут создавать проблемы, поскольку название страны является частью названия другой страны, South Sudan. Не нужно беспокоиться об этих исключениях.

Обработка ошибки
Если пользователь ввёл имя страны которой не существует, бэкенд вернёт не пустой массив, а ошибку со статус кодом 404 - не найдено. Если это не обработать, то пользователь никогда не узнает о том, что поиск не дал результатов. Добавь уведомление "Oops, there is no country with that name" в случае ошибки используя библиотеку notiflix.

ВНИМАНИЕ
Не забывай о том, что fetch не считает 404 ошибкой, поэтому необходимо явно отклонить промис чтобы можно было словить и обработать ошибку.*/

import { functions } from 'lodash';
import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';
const debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

///// слушаем события на инпут:
const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  div: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(handleSearch, 300));

function handleSearch(e) {
  const eventInput = e.target.value.trim();

  if (!eventInput) {
    clearRender();
    return;
  }

  fetchCountries(eventInput)
    .then(dataCountries => {
      clearRender();
      if (dataCountries.length === 1) {
        renderCountry(dataCountries);
      }

      if (dataCountries.length <= 10 && dataCountries.length > 1) {
        renderList(dataCountries);
      } else {
        Notiflix.Notify.info('Too many entries');
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function renderCountry(dataCountries) {
  const markup = dataCountries
    .map(({ name, capital, population, flags, languages }) => {
      return `<div class="sinle-country"><img src="${flags.svg}" alt="${
        name.common
      }" class="flag" width="36px"/>
    <h2 class="sinle-name">${name.official}</h2></div>
    <p><span>Capital: </span>${capital}</p>
    <p><span>Population: </span>${population}</p>
    <p><span>Languages: </span>${Object.values(languages).join(', ')}</p>`;
    })
    .join('');
  refs.div.insertAdjacentHTML('afterbegin', markup);
}

function renderList(dataCountries) {
  const markup = dataCountries
    .map(({ name, flags }) => {
      return `<li>
      <img src="${flags.svg}" alt="${name.common}" class="flag" width="30px"/>
    <p class="list-head">${name.official}</p>
    </li>`;
    })
    .join('');
  refs.list.insertAdjacentHTML('afterbegin', markup);
}

function clearRender() {
  refs.list.innerHTML = '';
  refs.div.innerHTML = '';
}
