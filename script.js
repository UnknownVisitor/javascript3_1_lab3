// Com3_1.3
(function() {
    const API_BASE_URL = 'https://restcountries.com/v3.1/region/';

    // Zaktualizowane elementy interfejsu
    const regionSelect = document.getElementById('region-select');
    const resultArea = document.getElementById('result-area');

    // Funkcja generująca tabelę dla wielu krajów
    function displayCountriesTable(countries) {
        if (!countries || countries.length === 0) {
            resultArea.innerHTML = '<p style="color: red;">Nie znaleziono krajów w tym regionie.</p>';
            return;
        }

        // 1. Sortowanie krajów alfabetycznie po nazwie
        countries.sort((a, b) => {
            const nameA = a.name.common.toUpperCase();
            const nameB = b.name.common.toUpperCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        });

        // Nagłówki nowej tabeli
        let tableHTML = `
            <table id="country-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Capital</th>
                        <th>Population</th>
                        <th>Subregion</th>
                    </tr>
                </thead>
                <tbody>
        `;

        // Wypełnianie tabeli danymi
        countries.forEach(country => {
            const name = country.name.common || 'N/A';
            const capital = country.capital ? country.capital.join(', ') : 'N/A';
            const population = country.population ? country.population.toLocaleString('pl-PL') : 'N/A';
            const subregion = country.subregion || 'N/A';

            tableHTML += `
                <tr>
                    <td>${name}</td>
                    <td>${capital}</td>
                    <td>${population}</td>
                    <td>${subregion}</td>
                </tr>
            `;
        });

        tableHTML += '</tbody></table>';
        resultArea.innerHTML = tableHTML;
    }

    // Funkcja do obsługi zmiany regionu
    async function searchByRegion() {
        const region = regionSelect.value;

        if (!region) {
            resultArea.innerHTML = '<p>Proszę wybrać region z listy.</p>';
            return;
        }

        resultArea.innerHTML = `<p>Ładowanie danych dla regionu: ${region}...</p>`;

        try {
            const url = `${API_BASE_URL}${region}`;
            const response = await fetch(url);

            if (!response.ok) {
                if (response.status === 404) {
                    displayCountriesTable([]);
                    return;
                }
                throw new Error(`Błąd HTTP: ${response.status}`);
            }

            const data = await response.json();

            console.log(`Pobrane kraje dla ${region}:`, data);

            displayCountriesTable(data);

        } catch (error) {
            console.error('Błąd podczas pobierania danych:', error);
            resultArea.innerHTML = `<p style="color: red;">Wystąpił błąd: ${error.message}</p>`;
        }
    }

    // Dodanie zdarzenia reagującego na zmianę wyboru w liście rozwijanej
    regionSelect.addEventListener('change', searchByRegion);

    // Nie uruchamiamy domyślnego wyszukiwania, aby użytkownik sam wybrał region.

})();