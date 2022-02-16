// export

// 1. Строим функцию запроса на бэкенд: /* https://restcountries.com/v3.1/name/{name} */
const fetchCountries = name => {
  const BASE_URL = 'https://restcountries.com/v3.1';
  return fetch(`${BASE_URL}/name/${name}?fields=name,capital,population,flags,languages`).then(
    response => {
      if (response.status === 404) {
        return Promise.reject(new Error('Not found'));
      }
      // return console.log(response.json());
      return response.json();
    },
  );
};
// console.log(fetchCountries());

export { fetchCountries };

/* .then(countries => {
      const markup = countries.map(country => `<li>${country}</li>`).join('');
      refs.list.insertAdjacentHTML('afterbegin', markup);
    }) */
