

export function handleRadioButtonChange(e) {
    const year = e.currentTarget.value;
    state.selectedYear = year;
    renderData(findDataByYear(state.years, state.selectedYear));
}

export function handleModalButtonClick(e) {
    const id = e.currentTarget.id;
    const index = parseInt(id.slice(9, id.length));
    const bandData = state.years.find(yearData => yearData.year === state.selectedYear).state.bandData[index];

    bandData.gigs.forEach(gig => {
        let html = generateGigRow(gig);
        bandGigsTableBody.insertAdjacentHTML('beforeend', html);
    });

    modalBandName.innerText = `${bandData.name} Gigs - ${ data.selectedYear }`;
    modalOuter.classList.add('open');
}

export function closeModal() {
    modalOuter.classList.remove('open');
    clearTables([bandGigsTableBody]);
}

export function clearTables(tables) {
    tables.forEach(table => table.innerHTML = '');
}