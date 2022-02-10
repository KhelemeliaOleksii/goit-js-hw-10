// library for notify
import Notiflix from 'notiflix';

// import fetch 
import { requestApi } from './api/fetch-by-name'

// object form 
// elements:    input
//              ul
//              div
export const form = {
    filterFields : ["name", "capital", "population", "flags", "languages"],
    dataRequest: '',
    isActiveBefore: false,
    // select input 
    inputCountry: document.querySelector("#search-box"),
    // select div.country-info
    info: document.querySelector('.country-info'),
    // select ul.country-list
    list: document.querySelector('.country-list'),

    // create an item of a list from answer-datas of the request  
    createItem(data) {
        return `
            <li class="county-item" style="display:flex; margin-left:-40px; margin-bottom:10px">
                <div style="width:30px; height:20px; margin-right: 10px">
                    <img src=${data.flags.png} style="display: block" width="100%" height="100%" alt="Italian Trulli" class="county-item__flag">                   
                </div>
                <div class="county-item__name">${data.name.official}</div>
            </li> `
    },
    // create the list from answer-datas of the request  
    createList(dataArray) {
        return dataArray.map(item => this.createItem(item))
            .join('');
    },
    // create an info block from answer-datas of the request  
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
    //add content to HTML page
    addIntoHTML(dataArray) {
        const amount = dataArray.length;
        if (amount > 10) {
            if (this.isActiveBefore) {
                this.clearFields();
                this.isActiveBefore = false;
            }
            Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
            return;

        }
        if (amount === 0) {
            if (this.isActiveBefore) {
                this.clearFields();
                this.isActiveBefore = false;
            }
            Notiflix.Notify.failure("Oops, there is no country with that name");
            return;
        }
        if (amount < 0) {
            this.isActiveBefore = false;
            Notiflix.Notify.failure("Error");
            return;
        }
        if (amount === 1) {
            this.isActiveBefore = true;
            this.list.innerHTML = this.createList(dataArray);
            this.info.innerHTML = this.createInfo(dataArray[0]);
            return;
        }
        this.isActiveBefore = true;
        this.list.innerHTML = this.createList(dataArray);
        this.info.innerHTML = "";
        return;

    },
    //check input chars is alphabets
    verifyCountryNameOnEnglish(inputValue) {
        // this.dataRequest = inputValue.trim();
        this.dataRequest = inputValue.replace(/^\s+|\s+$/gm, '');

        const arrayOfLitteral = [...this.dataRequest];

        if (arrayOfLitteral.length <= 0) {
            this.clearFields();
            Notiflix.Notify.info("Input country name, please!");
            return false;
        }

        const isAlphabetics = arrayOfLitteral.every(item => {
            return item.match(/[a-z]/i);
        });

        if (!isAlphabetics) {
            Notiflix.Notify.warning("Invalid symbol have been inputed!");
            return false;
        }

        return true;
    },
    // clear content of div and ul
    clearFields() {
        this.list.textContent = null;
        this.info.textContent = null;
    },
    // send get-request 
    request() {
        const str = `${this.dataRequest}?fields=${this.filterFields.join()}`;
        requestApi(str)
            .then((data) => {
                this.addIntoHTML(data);
            })
            .catch(error => {
                console.log(error);
                this.clearFields();
                Notiflix.Notify.failure("Oops, there is no country with that name");
            });
    },
}
