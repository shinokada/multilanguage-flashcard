<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import { Label, Select, Button } from 'svelte-5-ui-lib';
	import { randomNumberGenerator } from '$lib/utils.svelte';
	import { Flashcard, ArrowLeft, ArrowRight } from '$lib';
	const randomIndexFn = randomNumberGenerator(1, 1933, 50);

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

	let myLang = $state('ja');
	let targetLang = $state('ko');
	let selectedLanguage = $derived(languages.find((lang) => lang.value === myLang));
	let targetLanguage = $derived(languages.find((lang) => lang.value === targetLang));
	let lang1lang2 = $state(
		'text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-lg px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800 opacity-100'
	);
	let lang2lang1 = $state(
		'focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-lg px-5 py-2.5 me-2 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 opacity-50'
	);
	let showCardBack = $state(false);
	let showFront = $state('Show front');
	let showBack = $state('Show back');
	const toggleShowBack = () => (showCardBack = !showCardBack);

	const nextWord = () => {
		
		showCardBack = false;
		random();

	};
</script>

<div class="mt-15 flex flex-col items-center">
	<h1>Multilanguage Flashcard</h1>
	<h2>Let's learn {targetLanguage.name} using {selectedLanguage.name}</h2>
    <div class="w-96 m-4">
        <Select class="mt-2" items={languages} bind:value={myLang} onchange={random}/>
        <Select class="mt-2" items={languages} bind:value={targetLang} onchange={random}/>
    </div>
	<!-- FLASHCARD -->
	<div class="flip-box h-96 w-full bg-transparent md:w-2/3">
		<div class="flip-box-inner" class:flip-it={showCardBack}>
			<div class="relative h-full">
				<div class='absolute inset-0 bg-red-700 p-4 text-gray-200 flex justify-center items-center'>
					{#await import(`../../../node_modules/emojibase-data/${myLang}/data.json`) then json}
						<p class="p-8 text-9xl">
							{json.default[randomIndex].emoji}
						</p>
						<p class="mt-4 text-4xl">
                            {json.default[randomIndex].label}
                        </p>
					{/await}
				</div>
				<div
					class="absolute inset-0 flex p-4 items-center justify-center bg-blue-700 text-gray-200 opacity-0 {showCardBack
						? 'opacity-100 [transform:rotateY(180deg)]'
						: ''}"
				>
					{#await import(`../../../node_modules/emojibase-data/${targetLang}/data.json`) then json}
						<p class="p-8 text-9xl">
							{json.default[randomIndex].emoji}
						</p>
						<p class="mt-4 text-4xl">
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
