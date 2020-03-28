
import { gigTableBody } from '../elements.js';

export default function createGigTable(year, state) {
    year.gigData.map(gig => {
        let bandName = findBandName(state.bands, gig);
        let html = generateGigRow(gig, bandName);
        gigTableBody.insertAdjacentHTML('beforeend', html);
    });
}
