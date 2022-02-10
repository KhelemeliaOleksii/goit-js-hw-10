import './css/styles.css';

const DEBOUNCE_DELAY = 300;
// debounce will be used
import {_} from 'lodash';

// object form  
import {form} from './js/forms'

form.inputCountry.addEventListener('input', _.debounce(inputListener, DEBOUNCE_DELAY));

function inputListener() {
    // assign text value form input
    const inputText = form.inputCountry.value;
    
    //check input text is valid 
    const isValidValue = form.verifyCountryNameOnEnglish(inputText);
    
    if (!isValidValue) {
        return;
    }

    // if all ok send request
    form.request();
}

