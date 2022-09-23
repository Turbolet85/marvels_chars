import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';

class CharList extends Component {
	state = {
		chars: [],
		loading: true,
		error: false,
		newItemLoading: false,
		offset: 210,
		charEnded: false,
	};

	marvelService = new MarvelService();

	onCharsLoaded = (newChars) => {
		let ended = false;
		if (newChars.length < 9) {
			ended = true;
		}

		this.setState(({ offset, chars }) => ({
			chars: [...chars, ...newChars],
			loading: false,
			newItemLoading: false,
			offset: offset + 9,
			charEnded: ended,
		}));
	};

	onCharsLoading = () => {
		this.setState({
			newItemLoading: true,
		});
	};

	onError = () => {
		this.setState({ loading: false, error: true });
	};

	componentDidMount() {
		this.onRequest();
	}

	onRequest = (offset) => {
		this.onCharsLoading();
		this.marvelService.getAllCharacters(offset).then(this.onCharsLoaded).catch(this.onError);
	};

	itemRefs = [];

	setRef = (ref) => {
		this.itemRefs.push(ref);
	};

	focusOnItem = (id) => {
		this.itemRefs.forEach((item) => item.classList.remove('char__item_selected'));
		this.itemRefs[id].classList.add('char__item_selected');
		this.itemRefs[id].focus();
	};
	renderItems = (arr) => {
		const items = arr.map((item, i) => {
			let imgStyle = { objectFit: 'cover' };
			if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
				imgStyle = { objectFit: 'unset' };
			}

			return (
				<li
					className='char__item'
					key={item.id}
					ref={this.setRef}
					onClick={() => {
						this.props.onCharSelected(item.id);
						this.focusOnItem(i);
					}}
					onKeyPress={(e) => {
						if (e.key === ' ' || e.key === 'Enter') {
							this.props.onCharSelected(item.id);
							this.focusOnItem(i); 
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
	};

	render() {
		const { chars, loading, error, newItemLoading, offset, charEnded } = this.state;

		const items = this.renderItems(chars);

		const errorMessage = error ? <ErrorMessage /> : null;
		const spinner = loading ? <Spinner /> : null;
		const content = !(loading || error) ? items : null;

		return (
			<div className='char__list'>
				{errorMessage}
				{spinner}
				{content}
				<button
					className='button button__main button__long'
					disabled={newItemLoading}
					style={{ display: charEnded ? 'none' : 'block' }}
					onClick={() => {
						this.onRequest(offset);
					}}>
					<div className='inner'>load more</div>
				</button>
			</div>
		);
	}
}

export default CharList;
