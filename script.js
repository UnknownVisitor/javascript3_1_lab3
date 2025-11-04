// Com3_1.1
(function() {
    const API_BASE_URL = 'https://restcountries.com/v3.1/capital/';
    const inputElement = document.getElementById('capital-input');
    const searchButton = document.getElementById('search-button');
    const resultArea = document.getElementById('result-area');

    // Funkcja generująca tabelę na podstawie danych z API
    function displayCountryData(countries) {
        if (!countries || countries.length === 0) {
            resultArea.innerHTML = '<p style="color: red;">Nie znaleziono kraju dla podanej stolicy.</p>';
            return;
        }

        // Bierzemy tylko pierwszy wynik
        const country = countries[0];

        // Przygotowanie danych do tabeli
        const name = country.name.common || 'N/A';
        const capital = country.capital ? country.capital.join(', ') : 'N/A'; // Capital to tablica
        const population = country.population ? country.population.toLocaleString('pl-PL') : 'N/A';
        const region = country.region || 'N/A';
        const subregion = country.subregion || 'N/A';

        // Struktura tabeli
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
                    <tr>
                        <td>${name}</td>
                        <td>${capital}</td>
                        <td>${population}</td>
                        <td>${region}</td>
                        <td>${subregion}</td>
                    </tr>
                </tbody>
            </table>
        `;

        resultArea.innerHTML = tableHTML;
    }

    // Obsługa wyszukiwania
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
                // REST Countries zwraca 404, jeśli nic nie znajdzie
                if (response.status === 404) {
                    displayCountryData([]); // pusty wynik
                    return;
                }
                throw new Error(`Błąd HTTP: ${response.status}`);
            }

            const data = await response.json();

            // Logowanie danych do konsoli (dla celów debugowania)
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