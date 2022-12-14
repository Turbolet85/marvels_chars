import { useState, useEffect, useRef } from 'react';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';

const CharList = (props) => {
	const [chars, setChars] = useState([]);
	const [newItemLoading, setNewItemLoading] = useState(false);
	const [offset, setOffset] = useState(210);
	const [charEnded, setCharEnded] = useState(false);

	const { loading, error, getAllCharacters } = useMarvelService();

	const onCharsLoaded = (newChars) => {
		let ended = false;
		if (newChars.length < 9) {
			ended = true;
		}

		setChars((chars) => [...chars, ...newChars]);
		setNewItemLoading(false);
		setOffset((offset) => offset + 9);
		setCharEnded(ended);
	};

	useEffect(() => {
		onRequest(offset, true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onRequest = (offset, initial) => {
		initial ? setNewItemLoading(false) : setNewItemLoading(true);
		getAllCharacters(offset).then(onCharsLoaded);
	};

	const itemRefs = useRef([]);

	const focusOnItem = (id) => {
		itemRefs.current.forEach((item) => item.classList.remove('char__item_selected'));
		itemRefs.current[id].classList.add('char__item_selected');
		itemRefs.current[id].focus();
	};
	function renderItems(arr) {
		const items = arr.map((item, i) => {
			let imgStyle = { objectFit: 'cover' };
			if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
				imgStyle = { objectFit: 'unset' };
			}

			return (
				<li
					className='char__item'
					tabIndex={0}
					key={item.id}
					ref={(el) => (itemRefs.current[i] = el)}
					onClick={() => {
						props.onCharSelected(item.id);
						focusOnItem(i);
					}}
					onKeyPress={(e) => {
						if (e.key === ' ' || e.key === 'Enter') {
							props.onCharSelected(item.id);
							focusOnItem(i);
						}
					}}>
					<img
						src={item.thumbnail}
						alt={item.name}
						style={imgStyle}
					/>
					<div className='char__name'>{item.name}</div>
				</li>
			);
		});

		return <ul className='char__grid'>{items}</ul>;
	}

	const items = renderItems(chars);

	const errorMessage = error ? <ErrorMessage /> : null;
	const spinner = loading && !newItemLoading ? <Spinner /> : null;

	return (
		<div className='char__list'>
			{errorMessage}
			{spinner}
			{items}
			<button
				className='button button__main button__long'
				disabled={newItemLoading}
				style={{ display: charEnded ? 'none' : 'block' }}
				onClick={() => {
					onRequest(offset);
				}}>
				<div className='inner'>load more</div>
			</button>
		</div>
	);
};

export default CharList;
