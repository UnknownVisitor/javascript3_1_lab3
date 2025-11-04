// Com3_1.2
(function () {
    const API_BASE_URL = 'https://restcountries.com/v3.1/name/';   
    const inputElement = document.getElementById('country-input');
    const searchButton = document.getElementById('search-button');
    const resultArea = document.getElementById('result-area');

    // Funkcja generująca tabelę na podstawie danych z API
    function displayCountryData(countries) {
        if (!countries || countries.length === 0) {
            resultArea.innerHTML = '<p style="color: red;">Nie znaleziono kraju dla podanej nazwy.</p>';
            return;
        }

        // Bierzemy tylko pierwszy wynik
        const country = countries[0];

        // Funkcja pomocnicza do formatowania języków jako listy oddzielonej przecinkami
        function formatLanguages(languagesObj) {
            if (!languagesObj) return 'N/A';

            const languageNames = Object.values(languagesObj); 
            return languageNames.join(', ');
        }

        // Przygotowanie danych do tabeli
        const name = country.name.common || 'N/A';
        const capital = country.capital ? country.capital.join(', ') : 'N/A';
        const population = country.population ? country.population.toLocaleString('pl-PL') : 'N/A';
        const region = country.region || 'N/A';
        const languages = formatLanguages(country.languages); 
        
        // Generowanie struktury tabeli z nową kolumną "Languages"
        const tableHTML = `
            <table id="country-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Capital</th>
                        <th>Population</th>
                        <th>Region</th>
                        <th>Languages</th> 
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${name}</td>
                        <td>${capital}</td>
                        <td>${population}</td>
                        <td>${region}</td>
                        <td>${languages}</td>
                    </tr>
                </tbody>
            </table>
        `;

        resultArea.innerHTML = tableHTML;
    }

    // Funkcja do obsługi wyszukiwania
    async function searchCountry() {
        const countryName = inputElement.value.trim();

        if (!countryName) {
            resultArea.innerHTML = '<p style="color: orange;">Proszę wprowadzić nazwę kraju.</p>';
            return;
        }

        resultArea.innerHTML = '<p>Ładowanie danych...</p>';

        try {
            const url = `${API_BASE_URL}${countryName}`;
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