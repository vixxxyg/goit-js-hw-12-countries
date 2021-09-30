import '../css/styles.css';
import API from './fetchCountries';
// import debounce from '../node_modules/lodash.debounce';
import CountryCardTemplate from '../templates/countryCard.hbs';
import CountriesListTemplate from '../templates/countriesList.hbs';
import { debounce } from 'lodash';
import { Notify, Loading } from 'notiflix';

const { success, warning, failure, info } = Notify;

const refs = {
  searchInput: document.querySelector('.js-input'),
  countriesList: document.querySelector('.js-countries-list'),
  country: document.querySelector('.js-country'),
};

refs.searchInput.addEventListener('input', debounce(onCountriesSearch, 500));

function onCountriesSearch(e) {
  API.fetchCountries(e.target.value).then(inputValidation)
}

function inputValidation(country) {
  if (country.status === 404) {
    refs.country.innerHTML = '';
    serverResponse(failure, 'There is no such country!');
    return
  } else if (country.length > 10) {
    refs.country.innerHTML = '';
    serverResponse(warning, 'Too many matches found. Please enter a more specific qery!');
    return
  } else if (country.length > 1) {
    refs.country.innerHTML = CountriesListTemplate(country);
    serverResponse(info, 'Enter full name');
    return
    } else if (country.length === 1) {
    refs.country.innerHTML = CountryCardTemplate(country);
    serverResponse(success, 'You found your country!');
    refs.searchInput.value = '';
  }
}

function serverResponse(r, message) {
  r(message);
  Loading.remove();
}