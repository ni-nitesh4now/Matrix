import React, { useEffect, useRef, useState } from 'react';
import useInterval from '@use-it/interval';

// Constants
const VALID_CHARS = `abcdefghijklmnopqrstuvwxyz0123456789$+-*/=%"'#&_(),.;:?!\\|{}<>[]^~`;
const STREAM_MUTATION_ODDS = 0.02;

const min_l = 10;
const max_l = 60;


const min_s = 0;
const max_s = 10;

const Range = (min, max) =>
	Math.floor(Math.random() * (max - min)) + min;

const Randch = () =>
	VALID_CHARS.charAt(Math.floor(Math.random() * VALID_CHARS.length));

const getRandStrm = () =>
	new Array(Range(min_l, max_l))
		.fill()
		.map(_ => Randch());

const MStrm = strm => {
	const newStrm = [];
	for (let i = 1; i < strm.length; i++) {
		if (Math.random() < STREAM_MUTATION_ODDS) {
			newStrm.push(Randch());
		} else {
			newStrm.push(strm[i]);
		}
	}
	newStrm.push(Randch());
	return newStrm;
};

const RainStrm = props => {
	const [strm, setStrm] = useState(getRandStrm());
	const [topPadding, setTopPadding] = useState(strm.length * -50);
	const [intervalDelay, setIntervalDelay] = useState(null);

	// Initialize intervalDelay
	useEffect(() => {
		setTimeout(() => {
			setIntervalDelay(Range(min_l, max_l));
		}, intervalDelay);
	}, []);

	useInterval(() => {
		if (!props.height) return;

		if (!intervalDelay) return;

		// If strm is off the screen, reset it after timeout
		if (topPadding > props.height) {
			setStrm([]);
			const newStrm = getRandStrm();
			setStrm(newStrm);
			setTopPadding(newStrm.length * -44);
			setIntervalDelay(null);
			setTimeout(
				() =>
					setIntervalDelay(Range(min_l, max_l)),Range(min_s, max_s));
		} 
        else {
			setTopPadding(topPadding + 44);
		}
		setStrm(strm => [...strm.slice(1, strm.length), Randch()]);
		setStrm(MStrm);
	}, Range(min_s, max_s));

	return (
		<div
			style={{
				fontFamily: 'matrixFont',
				color: '#20c20e',
				writingMode: 'vertical-rl',
				textOrientation: 'upright',
				userSelect: 'none',
				whiteSpace: 'nowrap',
				marginTop: topPadding,
				marginLeft: -5,
				marginRight: -5,
				textShadow: '0px 0px 8px rgba(32, 194, 14, 0.8)',
				fontSize: 25,
			}}>
			{strm.map((char, index) => (
				<a 
					style={{
						marginTop: -5,
						// Reduce opacity for last chars
						opacity: index < 6 ? 0.1 + index * 0.15 : 1,
						color: index === strm.length - 1 ? '#fff' : undefined,
						textShadow:
							index === strm.length - 1
								? '0px 0px 20px rgba(255, 255, 255, 1)'
								: undefined,
					}}>
					{char}
				</a>
			))}
		</div>
	);
};

const MatrixRain = props => {
	const containerRef = useRef(null);
	const [containerSize, setContainerSize] = useState(null); // ?{width, height}

	useEffect(() => {
		const boundingClientRect = containerRef.current.getBoundingClientRect();
		setContainerSize({
			width: boundingClientRect.width+1000,
			height: boundingClientRect.height,
		});
	}, []);

	const strmCount = containerSize ? Math.floor(containerSize.width / 25) : 0;

	return (
		<div
			style={{
				background: 'black',
				position: 'fixed',
				top: 0,
				left: 0,
				bottom: 0,
				right: 0,
				overflow: 'ignore',
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'center',
			}}
			ref={containerRef}>
			{new Array(strmCount).fill().map(_ => (
				<RainStrm height={containerSize.height} />
			))}
		</div>
	);
};

export default MatrixRain;