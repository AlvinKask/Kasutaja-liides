const apiUrl = 'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=59.4714921&lon=24.5734362';

const headers = {
  'User-Agent': 'Tallinna ilmaennustus', // Lisab kasutajaagendi päringu päisesse API-le
};

console.log(`Praegune ilm Tallinnas:`); // Kuvab konsoolis sõnumi praeguse ilmateabe kuvamiseks Tallinnas

fetch(apiUrl, {
  method: 'GET', // Saadab päringu meetodiga GET
  headers: headers, // Kasutab päist
})
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP viga! Staatus: ${response.status}`); // Kuvatakse viga, kui vastus ei ole edukas
    }
    return response.json(); // Teisendab vastuse JSON-formaadis andmeteks
  })
  .then(data => {
    // Itereerib läbi "timeseries" massiivi
    data.properties.timeseries.forEach(entry => {
      // Võtab igast kirjest ilmaandmed
      const time = new Date(entry.time); // Teisendab ajatemplit stringist Date objektiks
      const estonianTime = time.toLocaleString('et-EE', {timeZone: 'Europe/Tallinn'}); // Teisendab Zulu aja vastavalt Eesti ajatsoonile
      const airTemperature = entry.data.instant.details.air_temperature; // Õhutemperatuur
      const precipitation = entry.data.instant.details.precipitation_amount; // Sademed
      const windSpeed = entry.data.instant.details.wind_speed; // Tuulekiirus
      const humidity = entry.data.instant.details.relative_humidity; // Õhuniiskus

      // Kuvab konsoolis ilmaelemendid, kui vastavad andmed on saadaval
      console.log(`Aeg: ${estonianTime}`);
      console.log(`Õhutemperatuur: ${airTemperature} °C`); // Kuvab õhutemperatuuri
      if (typeof precipitation !== 'undefined') {
        console.log(`Sademed: ${precipitation} mm`); // Kuvab sademete hulka, kui see on saadaval
      } else {
        console.log(`Sademed: Andmed puuduvad`); // Kuvab puuduvate sademete kohta teate
      }
      console.log(`Tuulekiirus: ${windSpeed} m/s`); // Kuvab tuulekiirust
      console.log(`Õhuniiskus: ${humidity}%`); // Kuvab õhuniiskust
      console.log(); // Lisab tühja rea eraldamiseks järgmise ajavahemiku andmetest
    });
  })
  .catch(error => {
    console.error('Viga päringu tegemisel:', error.message); // Kuvab konsoolis vajadusel veateate
  });
