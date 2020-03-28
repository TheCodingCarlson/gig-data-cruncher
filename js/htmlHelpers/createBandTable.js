import { bandTableBody } from '../elements.js';

export default function createBandTable(bands) {
    bands.map((band, index) => {
        let html = `
            <tr>
                <td>${ band.name }</td>
                <td>${ band.gigCount }</td>
                <td>${ band.totalPay }</td>
                <td>${ band.totalCashPay }</td>
                <td>${ band.averagePayPerGig }</td>
                <td><button id="m-button-${ index }" class="modal-button">See Gigs</button></td>
            </tr>
        `;

        bandTableBody.insertAdjacentHTML('beforeend', html);
    });
}
