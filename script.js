// Com3_1.4
(function () {
    const API_BASE_URL = 'https://restcountries.com/v3.1/capital/';
    const inputElement = document.getElementById('capital-input');
    const searchButton = document.getElementById('search-button');
    const resultArea = document.getElementById('result-area');
    const detailsArea = document.getElementById('details-area'); 

    // Zmienna do przechowywania wyników wyszukiwania dla obsługi kliknięcia
    let currentCountriesData = [];

    // Funkcja do wyświetlania szczegółów po kliknięciu w wiersz
    function displayDetails(country) {
        // Funkcja pomocnicza do formatowania walut
        function formatCurrencies(currenciesObj) {
            if (!currenciesObj) return 'N/A';

            // Pobieramy symbole i nazwy walut
            return Object.values(currenciesObj)
                         .map(c => `${c.name} (${c.symbol || ''})`)
                         .join(', ');
        }

        const officialName = country.name.official || 'N/A';
        const flagUrl = country.flags.png || 'N/A';
        const currencies = formatCurrencies(country.currencies);

        detailsArea.innerHTML = `
            <h2>Szczegóły: ${country.name.common}</h2>
            <p><strong>Oficjalna nazwa:</strong> ${officialName}</p>
            <p><strong>Waluta/y:</strong> ${currencies}</p>
            <div>
                <img src="${flagUrl}" alt="Flaga kraju ${country.name.common}">
            </div>
        `;
    }

    // Funkcja generująca tabelę na podstawie danych z API
    function displayCountryData(countries) {
        // Resetujemy szczegóły
        detailsArea.innerHTML = '<p>Kliknij na wiersz w tabeli, aby wyświetlić szczegóły kraju.</p>';

        if (!countries || countries.length === 0) {
            resultArea.innerHTML = '<p style="color: red;">Nie znaleziono kraju dla podanej stolicy.</p>';
            currentCountriesData = [];
            return;
        }

        // Zapisujemy pobrane dane w globalnej zmiennej
        currentCountriesData = countries;

        const tableHTML = `
            <table id="country-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Capital</th>
                        <th>Population</th>
                        <th>Region</th>
                        <th>Subregion</th>
                    </tr>
                </thead>
                <tbody>
        `;

        // Wypełnianie tabeli danymi
        let tableBodyHTML = '';
        countries.forEach((country, index) => {
            const name = country.name.common || 'N/A';
            const capital = country.capital ? country.capital.join(', ') : 'N/A';
            const population = country.population ? country.population.toLocaleString('pl-PL') : 'N/A';
            const region = country.region || 'N/A';
            const subregion = country.subregion || 'N/A';

            // Dodajemy atrybut data-index do wiersza, aby zidentyfikować kraj
            tableBodyHTML += `
                <tr data-index="${index}">
                    <td>${name}</td>
                    <td>${capital}</td>
                    <td>${population}</td>
                    <td>${region}</td>
                    <td>${subregion}</td>
                </tr>
            `;
        });

        resultArea.innerHTML = tableHTML + tableBodyHTML + '</tbody></table>';

        // Dodanie listenerów do wierszy tabeli (po jej wyrenderowaniu)
        const tableRows = resultArea.querySelectorAll('#country-table tbody tr');
        tableRows.forEach(row => {
            row.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                if (currentCountriesData[index]) {
                    displayDetails(currentCountriesData[index]);
                }
            });
        });
    }

    // Funkcja do obsługi wyszukiwania
    async function searchCountry() {
        const capital = inputElement.value.trim();

        if (!capital) {
            resultArea.innerHTML = '<p style="color: orange;">Proszę wprowadzić nazwę stolicy.</p>';
            return;
        }

        resultArea.innerHTML = '<p>Ładowanie danych...</p>';

        try {
            const url = `${API_BASE_URL}${capital}`;
            const response = await fetch(url);

            if (!response.ok) {
                if (response.status === 404) {
                    displayCountryData([]); 
                    return;
                }
                throw new Error(`Błąd HTTP: ${response.status}`);
            }

            const data = await response.json();
            console.log("Pobrane dane:", data);

            displayCountryData(data);

        } catch (error) {
            console.error('Błąd podczas pobierania danych:', error);
            resultArea.innerHTML = `<p style="color: red;">Wystąpił błąd: ${error.message}</p>`;
        }
    }

    // Dodanie zdarzeń do przycisku
    searchButton.addEventListener('click', searchCountry);

    // Szukanie po wciśnięciu Enter w polu input
    inputElement.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            searchCountry();
        }
    });

    // Uruchomienie domyślnego wyszukiwania po załadowaniu strony
    searchCountry();

})();