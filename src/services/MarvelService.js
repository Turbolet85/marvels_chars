class MarvelService {
	_apiBase = 'https://gateway.marvel.com:443/v1/public/';
	_apiKey = 'apikey=6a8a4411a6a03aba4439866e971f9dea';
	_baseOffset = 210;

	getResource = async (url) => {
		let res = await fetch(url);

		if (!res.ok) {
			throw new Error(`Could not fetch ${url}, status: ${res.status}`);
		}

		return await res.json();
	};

	getAllCharacters = async (offset = this._baseOffset) => {
		const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);

		return res.data.results.map(this._transformCharacter);
	};

	getCharacter = async (id) => {
		const res = await this.getResource(`${this._apiBase}characters/${id}?&${this._apiKey}`);
		return this._transformCharacter(res.data.results[0]);
	};

	_transformCharacter = (char) => {
		let modDescr = '';
		if (char.description === '') {
			modDescr = 'Secret information';
		} else if (char.description.length > 200) {
			modDescr = char.description.slice(0, 200) + '...';
		} else {
			modDescr = char.description;
		}
		return {
			name: char.name,
			description: modDescr,
			thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
			homepage: char.urls[0].url,
			wiki: char.urls[1].url,
			id: char.id,
			comics: char.comics.items,
		};
	};
}

export default MarvelService;
