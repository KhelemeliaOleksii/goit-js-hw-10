import './css/styles.css';

import Notiflix from 'notiflix';

import { requestApi } from './API/fetch-by-name'

import {debounce} from "lodash.debounce";

import {_} from 'lodash';

const DEBOUNCE_DELAY = 300;

const refs = {
    inputCountry: document.querySelector("#search-box"),
    info: document.querySelector('.country-info'),
    list: document.querySelector('.country-list'),
    isActiveBefore: false,
    createItem(data) {
        return `
            <li class="county-item" style="display:flex; margin-left:-40px; margin-bottom:10px">
                <div style="width:30px; height:20px; margin-right: 10px">
                    <img src=${data.flags.png} style="display: block" width="100%" height="100%" alt="Italian Trulli" class="county-item__flag">                   
                </div>
                <div class="county-item__name">${data.name.official}</div>
            </li> `
    },
    createInfo(data) {
        const capitals = data.capital.join(", ");
        const population = data.population;
        const languages = Object.values(data.languages).join(", ");
        return `
        <div class="country-info__capital">
            <span class="country-info__label" style="font-weight:500">Capital: </span>
            <span class="country-info__value">${capitals}</span>
        </div>
        <div class="country-info__population">
            <span class="country-info__label"style="font-weight:500">Population:  </span>
            <span class="country-info__value">${population}</span>
        </div>
        <div class="country-info__population">
            <span class="country-info__label"style="font-weight:500">Languages:  </span>
            <span class="country-info__value">${languages}</span>
        </div>`
    },
    createList(dataArray) {
        return dataArray.map(item => this.createItem(item))
            .join('');
    },
    addIntoHTML(dataArray) {
        const amount = dataArray.length;
        if (amount > 10) {
            if (this.isActiveBefore) {
                this.clearFields();
                this.isActiveBefore = false;
            }
            Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
            console.log("amount: ",amount);
            return;

        }
        if (amount === 0) {
            if (this.isActiveBefore) {
                this.clearFields();
                this.isActiveBefore = false;
            }
            Notiflix.Notify.failure("Oops, there is no country with that name");
            console.log("amount: ",amount);
            return;
    }
        if (amount < 0) {
            this.isActiveBefore = false;
            Notiflix.Notify.failure("Error");
            console.log("amount: ",amount);
            return;
        }
        if (amount === 1) {
            this.isActiveBefore = true;
            this.list.innerHTML = this.createList(dataArray);
            this.info.innerHTML = this.createInfo(dataArray[0]);
            console.log("amount: ",amount);
            return;
        }
        this.isActiveBefore = true;
        this.list.innerHTML = this.createList(dataArray);
        this.info.innerHTML = "";
        console.log("amount: ",amount);
        return;

    },
    verifyCountryNameOnEnglish(value) {


        if (value === "") {
            refs.clearFields();
            return false;
        }

        const arrayOfLitteral = [...value];
        return arrayOfLitteral.every(item => {
            return item.match(/[a-z]/i);
        })
    },
    clearFields() {
        this.list.textContent = null;
        this.info.textContent = null;
    }

}


// const inputCountry = document.querySelector("#search-box");
// const info = document.querySelector('.country-info');
refs.inputCountry.addEventListener('input', _.debounce(inputListener, DEBOUNCE_DELAY));

//console.log(refs);
function inputListener(event) {
    request();
}
function request () {
    const inputText = refs.inputCountry.value;
    const isValidValue = refs.verifyCountryNameOnEnglish(inputText);
    if (!isValidValue) {
        return;
    }
console.log("sfjs");
    requestApi(inputText)
        .then((data) => {
            //console.log(data);
            console.log("In");
            refs.addIntoHTML(data);
        })
        .catch(error => console.log(error));

}