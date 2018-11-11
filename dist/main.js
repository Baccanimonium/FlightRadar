function renderFlights () {
	const url='/api/get-flights';

	const radiusOfEarth = 6371;
	const ftInMeterCoefficient  = 3.281;
	const ktsToKmhCoefficient = 1.852;
	const tableBody = document.querySelector(".flights-table-tbody");
	const domodedovoLat = 55.410307;
	const domodedovoLon = 37.902451;

	const deg2rad = (deg) => deg * (Math.PI/180);

	const getDistanceFromLatLonInKm = (lat, lon) => {
		const dLat = deg2rad(domodedovoLat - lat);
		const dLon = deg2rad(domodedovoLon - lon);
		const a =
			Math.sin(dLat/2) * Math.sin(dLat / 2) +
			Math.cos(deg2rad(lat)) * Math.cos(deg2rad(domodedovoLat)) *
			Math.sin(dLon/2) * Math.sin(dLon / 2)
		;
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		return radiusOfEarth * c;
	};

	const clearTableTbodyChildrens = () => {
		Object.values(tableBody.children).forEach((element) => element.remove());
	};

	const render = ({ full_count, version, ...flights }) => {
		clearTableTbodyChildrens();
		Object.values(flights)
			.sort(( [ id, Latitude, Longitude ], [ nextId, nextLatitude, nextLongitude ] ) => {
				if (getDistanceFromLatLonInKm(Latitude,Longitude)
					> getDistanceFromLatLonInKm(nextLatitude,nextLongitude)) return 1;
				else return -1;
			})
			.forEach(( [ id, Latitude, Longitude, Track, Altitude,
				Speed, a, radar, typeOfAirCraft,B, registryDate, where, from, bortNumber  ] ) => {
				const tableRow = `
				    <tr>
				      <td>
				        ${Latitude} / ${Longitude}
				      </td>
				      <td>
				        ${Math.round(Speed * ktsToKmhCoefficient)} km/h
				      </td>
				      <td>
				        ${Track}°
				      </td>
				      <td>
				        ${Math.round(Altitude / ftInMeterCoefficient )} m
				      </td>
				      <td>
				        ${where} / ${from}
				      </td> 	
				      <td>
				        ${bortNumber}
				      </td> 	
				    </tr>
				  `;
				tableBody.insertAdjacentHTML("beforeend", tableRow);
			})
	};

	const renderError = () => {
		clearTableTbodyChildrens();
		const errorTableRow = `
			<tr> 
				<td colspan="6">
					По какой-то причине, данные о рейсах вокруг аеропорта не были загруженны.
					Повторная попытка загрузки данных произойдет через 5с автоматический.
				</td>
			</tr>
		`;
		tableBody.insertAdjacentHTML("beforeend", errorTableRow);
	};

	const fetchOptions = {
		cache: 'no-cache',
		mode: 'no-cors'
	};

	const fetchFlights = () => {
		fetch(url, fetchOptions)
		.then((res) => res.json())
		.then((res) => render(res))
		.catch(() => renderError())
	};

	setInterval(() => fetchFlights(), 5000);

	fetchFlights();
}





document.addEventListener("DOMContentLoaded", renderFlights);
