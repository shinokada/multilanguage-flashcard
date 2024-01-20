<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import { Label, Select, Button } from 'svelte-5-ui-lib';
	import { randomNumberGenerator } from '$lib/utils.svelte';
	import { Flashcard, ArrowLeft, ArrowRight } from '$lib';
	const randomIndexFn = randomNumberGenerator(26, 1933, 50);

	let randomIndex = $state(randomIndexFn());
	// $inspect('randomIndex', randomIndex);

	const languages = [
		{ value: 'bn', name: 'বাংলা' },
		{ value: 'da', name: 'Dansk' },
		{ value: 'de', name: 'Deutsch' },
		{ value: 'en', name: 'English' },
		{ value: 'en-gb', name: 'English (UK)' },
		{ value: 'es', name: 'Español' },
		{ value: 'es-mx', name: 'Español (México)' },
		{ value: 'et', name: 'Eesti keel' },
		{ value: 'fi', name: 'Suomi' },
		{ value: 'fr', name: 'Français' },
		{ value: 'hi', name: 'हिन्दी' },
		{ value: 'hu', name: 'Magyar' },
		{ value: 'it', name: 'Italiano' },
		{ value: 'ja', name: '日本語' },
		{ value: 'ko', name: '한국어' },
		{ value: 'lt', name: 'Lietuvių' },
		{ value: 'ms', name: 'Bahasa Melayu' },
		{ value: 'nb', name: 'Norsk Bokmål' },
		{ value: 'nl', name: 'Nederlands' },
		{ value: 'pl', name: 'Polski' },
		{ value: 'pt', name: 'Português' },
		{ value: 'ru', name: 'Русский' },
		{ value: 'sv', name: 'Svenska' },
		{ value: 'th', name: 'ไทย' },
		{ value: 'uk', name: 'Українська' },
		{ value: 'zh', name: '中文（简体）' },
		{ value: 'zh-hant', name: '中文（繁體）' }
	];

	const random = async () => {
		randomIndex = randomIndexFn();
	};

	let myLang = $state('en');
	let targetLang = $state('nb');
	let selectedLanguage = $derived(languages.find((lang) => lang.value === myLang));
	let targetLanguage = $derived(languages.find((lang) => lang.value === targetLang));
	let showCardBack = $state(false);
	let showFront = $state('Show front');
	let showBack = $state('Show back');
	const toggleShowBack = () => (showCardBack = !showCardBack);

	const nextWord = () => {
		
		showCardBack = false;
		random();

	};

    function handleKeyDown(event) {
		if (event.key === 'ArrowLeft') {
			toggleShowBack();
			// console.log('arrowleft pressed')
		} else if (event.key === 'ArrowRight') {
			nextWord()
			// console.log('arrowright is pressed')
		}
	}

	function preventDefault(fn) {
		return function (event) {
			event.preventDefault();
			fn.call(this, event);
		};
	}
</script>

<div class="mt-15 flex flex-col items-center">
	<h1>Multilanguage Flashcard</h1>
	<h2>Learn {targetLanguage.name} using {selectedLanguage.name}</h2>
    <div class="w-96 mb-4">
        <Select class="mt-2" items={languages} bind:value={myLang} onchange={random}/>
        <Select class="mt-2" items={languages} bind:value={targetLang} onchange={random}/>
    </div>
	<!-- FLASHCARD -->
	<div class="w-full md:w-1/2 h-96 justify-center items-center text-4xl mx-auto text-white bg-custom-red dark:bg-custom-red border border-gray-200 rounded-lg shadow dark:border-gray-700">
		<div class="flip-box-inner" class:flip-it={showCardBack}>
			<div class="relative h-full">
				<div class='absolute inset-0 bg-red-700 p-4 flex flex-col justify-center items-center text-gray-200 items-center'>
					{#await import(`../../../node_modules/emojibase-data/${myLang}/data.json`) then json}
						<p class="text-9xl">
							{json.default[randomIndex].emoji}
						</p>
						<p class="mt-4">
                            {json.default[randomIndex].label}
                        </p>
					{/await}
				</div>
				<div
					class="absolute inset-0 p-4 flex flex-col justify-center items-center bg-blue-700 text-gray-200 opacity-0 {showCardBack
						? 'opacity-100 [transform:rotateY(180deg)]'
						: ''}"
				>
					{#await import(`../../../node_modules/emojibase-data/${targetLang}/data.json`) then json}
						<p class="text-9xl">
							{json.default[randomIndex].emoji}
						</p>
						<p class="mt-4">
                            {json.default[randomIndex].label}
                        </p>
					{/await}
				</div>
			</div>
		</div>
	</div>

	<div class="flex space-x-4 pt-4">
		<button onclick={toggleShowBack} class="inline-flex min-w-44 items-center bg-gray-300 p-4">
			<ArrowLeft class="mr-4" />
			{showCardBack ? showFront : showBack}
		</button>

		<button class="inline-flex bg-gray-300 p-4 text-right" onclick={() => nextWord()}>
			NEXT
			<ArrowRight class="ml-4" />
		</button>
	</div>
	<span class="right-full mt-4 hidden rounded bg-gray-900 px-2 py-1 text-white lg:inline-block">
		Use ← to flip and → to next
	</span>
</div>

<svelte:window onkeydown={preventDefault(handleKeyDown)} />

<style>
	.flip-box {
		background-color: transparent;
		/* width: 400px;
		height: 300px; */
		/* 		border: 1px solid #ddd; */
		perspective: 1000px; /* Remove this if you don't want the 3D effect */
	}
	/* This container is needed to position the front and back side */
	.flip-box-inner {
		position: relative;
		width: 100%;
		height: 100%;
		text-align: center;
		transition: transform 0.8s;
		transform-style: preserve-3d;
	}

	/* Do an horizontal flip on button click */
	.flip-it {
		transform: rotateY(180deg);
	}
</style>
