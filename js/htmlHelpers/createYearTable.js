import { yearTableBody } from '../elements.js';

export default function createYearTable(years, state) {
    years.forEach(year => {
        let highestPayingGig = year.data.gigData.reduce((prevGig, currentGig) => {
            let currentGigPay = currentGig.pay ? currentGig.pay : 0;
            return (prevGig.pay >= currentGigPay) ? prevGig : currentGig;
        });

        let mostPopularBand = year.data.bandData.reduce((prevBand, currentBand) => {
            return (prevBand.gigs.length > currentBand.gigs.length) ? prevBand : currentBand;
        });

        let bandName = findBandName(state.bands, highestPayingGig);
        let html = `
            <tr>
                <td>${ year.year }</td>
                <td>${ year.data.totalGigs }</td>
                <td>${ year.data.bandData.length }</td>
                <td>${ year.data.cities.length }</td>
                <td>${ year.data.states.length }</td>
                <td>${ year.data.totalPay }</td>
                <td>${ mostPopularBand.name }</td>
                <td>
                    <span>${ highestPayingGig.date }</span>
                    <span>${ highestPayingGig.venue }</span>
                    <span>${ highestPayingGig.city }, ${ highestPayingGig.state }</span>
                    <span>${ bandName }</span>
                    <span>$${ highestPayingGig.pay }</span>
                </td>
            </tr>
        `;

        yearTableBody.insertAdjacentHTML('beforebegin', html);
    });
}
