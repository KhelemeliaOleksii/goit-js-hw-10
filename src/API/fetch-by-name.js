import { urlCountriesREST } from './url-countries-rest'

export function requestApi (name) {
    return  fetch(`${urlCountriesREST}${name}`)
    .then( (response) => {
        if (!response.ok) {
            throw new Error(response.status);
        }
        return response.json();
    })
}