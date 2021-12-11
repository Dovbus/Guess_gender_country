
const UI_ELEM = {
	inputName: document.getElementById('name'),
	gender: document.getElementById('gender'),
	nation: document.getElementById('nation'),
	answer: document.querySelector('.text'),
	answerCounry: document.querySelector('.country'),
}

const serverGenderUrl = 'https://api.genderize.io';
const serverNationUrl = 'https://api.nationalize.io';


UI_ELEM.gender.addEventListener('click', function () {
	const firstName = UI_ELEM.inputName.value;
	const genderUrl = `${serverGenderUrl}?name=${firstName}`;

	fetch(genderUrl).then(function (response) {
		return response.json();
	}).then(function (json) {
		if (!json.gender) {
			UI_ELEM.answer.textContent = 'This name is unavailable.';
		} else {
			UI_ELEM.answer.textContent = `${firstName} is ${json.gender}.`;
		}
	}).catch(function (error) {
		UI_ELEM.answer.textContent = 'This name is unavailable';
	})
})


UI_ELEM.nation.addEventListener('click', function () {
	const firstName = UI_ELEM.inputName.value;
	const nationUrl = `${serverNationUrl}?name=${firstName}`;

	fetch(nationUrl).then(function (response) {
		return response.json();
	}).then(json => processNationResult(json, firstName))
		.catch(function (error) {
			UI_ELEM.answerCounry.textContent = 'Country is unavailable.';
		});
})


function processNationResult(json, firstName) {
	let arr = [];
	let country = json.country;
	country.forEach(function (elem) {
		arr.push(elem['probability']);
	})

	let max = Math.max(...arr);

	country = country.find(function (elem) {
		return elem['probability'] === max;
	});
	const countryId = country.country_id;

	let countryUrl = `https://api.worldbank.org/v2/country/${countryId}?format=json`;
	fetch(countryUrl).then(function (response) {
		return response.json();
	}).then(function (json) {
		const result = json[1][0].name;
		UI_ELEM.answerCounry.textContent = `${firstName} lives in ${result}.`;
	}).catch(function (error) {
		UI_ELEM.answerCounry.textContent = 'Country is unavailable.';
	})
}
