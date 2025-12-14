<script lang="ts">
	import { onMount } from 'svelte';
	import { Label, Select } from 'flowbite-svelte';
	import { randomIndexGenerator } from '$lib/utils';
	import { ArrowRight, ArrowUp, ArrowDown } from '$lib';

	const getRandomIndex = randomIndexGenerator(50);
	let randomIndex = $state(0);
	let myLang = $state('en');
	let targetLang = $state('nb');

	interface EmojiHistoryItem {
		index: number;
		myLangValue: string;
		targetLangValue: string;
	}

	interface LanguageOption {
		value: string;
		name: string;
	}
	const languages: LanguageOption[] = [
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

	let emojiHistory = $state<Array<EmojiHistoryItem>>([]);
	let currentIndex = $state(-1);

	interface EmojiData {
		subgroup: number;
		emoji: string;
		label: string;
	}

	let currentMyLangData = $state<EmojiData[] | null>(null);
	let currentTargetLangData = $state<EmojiData[] | null>(null);

	const excludedSubgroups = new Set([98, 99]);

	const filterEmojis = (data: EmojiData[]) =>
		data.filter((emoji) => !excludedSubgroups.has(emoji.subgroup));

	const loadLanguageData = async (lang: string) => {
		try {
			const module = await import(`../../node_modules/emojibase-data/${lang}/data.json`);
			return module.default;
		} catch (error) {
			console.error(`Failed to load language data for ${lang}:`, error);
			return [];
		}
	};

	const loadCurrentEmojiData = async () => {
		const [myData, targetData] = await Promise.all([
			loadLanguageData(myLang),
			loadLanguageData(targetLang)
		]);
		currentMyLangData = filterEmojis(myData);
		currentTargetLangData = filterEmojis(targetData);
	};

	const addToHistory = (index: number) => {
		const historyItem: EmojiHistoryItem = {
			index,
			myLangValue: myLang,
			targetLangValue: targetLang
		};
		emojiHistory = [...emojiHistory, historyItem];
		currentIndex = emojiHistory.length - 1;
		randomIndex = index;
	};

	const goToCard = async (idx: number) => {
		if (idx >= 0 && idx < emojiHistory.length) {
			currentIndex = idx;
			const historyItem = emojiHistory[currentIndex];
			myLang = historyItem.myLangValue;
			targetLang = historyItem.targetLangValue;
			await loadCurrentEmojiData();

			const total = currentMyLangData?.length || 0;
			randomIndex = historyItem.index < total ? historyItem.index : 0;

			showCardBack = false;
		}
	};

	const showPreviousEmoji = () => {
		if (currentIndex > 0) {
			goToCard(currentIndex - 1);
		}
	};

	const showNextEmoji = () => {
		if (currentIndex < emojiHistory.length - 1) {
			goToCard(currentIndex + 1);
		} else {
			nextWord();
		}
	};

	const nextWord = async () => {
		showCardBack = false;
		await loadCurrentEmojiData();

		const total = currentMyLangData?.length || 0;
		if (total === 0) return;

		const newRandomIndex = getRandomIndex(total); // ✅ dynamic length
		addToHistory(newRandomIndex);
	};

	let isTouch = $state(false);
	onMount(async () => {
		isTouch = window.matchMedia('(pointer: coarse)').matches;
		await nextWord(); // ✅ use filtered data
	});

	const selectedLanguage = $derived(languages.find((lang) => lang.value === myLang));
	const targetLanguage = $derived(languages.find((lang) => lang.value === targetLang));

	let showCardBack = $state(false);
	const toggleShowBack = () => (showCardBack = !showCardBack);

	let touchStartX = 0,
		touchStartY = 0,
		touchEndX = 0,
		touchEndY = 0;

	function handleTouchStart(event: TouchEvent) {
		touchStartX = event.changedTouches[0].screenX;
		touchStartY = event.changedTouches[0].screenY;
	}

	function handleTouchEnd(event: TouchEvent) {
		touchEndX = event.changedTouches[0].screenX;
		touchEndY = event.changedTouches[0].screenY;
		const deltaX = touchEndX - touchStartX;
		const deltaY = touchEndY - touchStartY;

		if (Math.abs(deltaX) > Math.abs(deltaY)) {
			if (deltaX < -30) {
				if (currentIndex < emojiHistory.length - 1) {
					showNextEmoji();
				} else {
					nextWord();
				}
			} else if (deltaX > 30) {
				showPreviousEmoji();
			}
		} else {
			if (deltaY < -30 || deltaY > 30) {
				toggleShowBack();
			}
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		const target = event.target as HTMLElement;
		if (['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)) return;
		if (['ArrowLeft', 'ArrowUp'].includes(event.key)) {
			event.preventDefault();
			showPreviousEmoji();
		} else if (['ArrowRight', 'ArrowDown'].includes(event.key)) {
			event.preventDefault();
			showNextEmoji();
		} else if (event.key === 'n' || event.key === 'N') {
			event.preventDefault();
			nextWord();
		}
	}
</script>

<div class="flex flex-col items-center">
	<h1 class="mx-auto max-w-80 text-2xl sm:text-3xl">Multilanguage Flashcard</h1>

	<div class="mb-4 w-96">
		<Label class="mx-auto w-48">Change your languages:</Label>
		<Select class="mx-auto mt-2 w-48" items={languages} bind:value={myLang} />
		<Select class="mx-auto mt-2 w-48" items={languages} bind:value={targetLang} />
	</div>

	<h2 class="mb-4">You are learning {targetLanguage?.name} using {selectedLanguage?.name}</h2>

	<div class="mb-2 text-lg font-medium text-gray-700 dark:text-gray-300">
		{#if emojiHistory.length > 0}
			{currentIndex + 1}/{emojiHistory.length}
		{:else}
			Loading...
		{/if}
	</div>

	<div class="mx-auto h-96 w-full items-center justify-center text-4xl text-white md:w-1/2">
		<div
			class="flip-box-inner"
			class:flip-it={showCardBack}
			onclick={toggleShowBack}
			onkeydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault(); // Prevent default browser action (like scrolling for space)
					toggleShowBack();
				}
			}}
			ontouchstart={handleTouchStart}
			ontouchend={handleTouchEnd}
			tabindex="0"
			role="button"
			aria-pressed={showCardBack}
		>
			<div class="relative h-full">
				<div
					class="absolute inset-0 flex flex-col items-center justify-center bg-purple-950 p-4 text-white"
				>
					{#if currentMyLangData && currentMyLangData[randomIndex]}
						<p class="text-9xl">
							{currentMyLangData[randomIndex].emoji}
						</p>
						<p class="mt-4">
							{currentMyLangData[randomIndex].label}
						</p>
					{:else}
						<p>Loading...</p>
					{/if}
				</div>
				<div
					class="absolute inset-0 flex flex-col items-center justify-center bg-green-400 p-4 text-white opacity-0 {showCardBack
						? '[transform:rotateY(180deg)] opacity-100'
						: ''}"
				>
					{#if currentTargetLangData && currentTargetLangData[randomIndex]}
						<p class="text-9xl">
							{currentTargetLangData[randomIndex].emoji}
						</p>
						<p class="mt-4">
							{currentTargetLangData[randomIndex].label}
						</p>
					{:else}
						<p>Loading...</p>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<p class="mt-4 rounded bg-gray-900 px-2 py-1 text-white">
		{#if isTouch}
			Swipe left or right to switch cards. Tap to flip. Or use buttons below.
		{:else}
			Click the card / press space / enter to flip.<br />
			Use ← → ↑ ↓ to navigate cards. Press N for new card. Or use buttons below.
		{/if}
	</p>

	<div class="grid grid-cols-3 gap-2 pt-4 sm:flex-row sm:justify-between">
		<button
			onclick={showPreviousEmoji}
			class="inline-flex w-full items-center bg-gray-300 p-2 disabled:cursor-not-allowed disabled:opacity-50 sm:p-4 dark:bg-gray-700"
			disabled={currentIndex <= 0}
		>
			<ArrowUp class="mr-4" />
			Previous
		</button>

		<button
			onclick={showNextEmoji}
			class="inline-flex w-full items-center bg-gray-300 p-2 disabled:cursor-not-allowed disabled:opacity-50 sm:p-4 dark:bg-gray-700"
			disabled={currentIndex === emojiHistory.length - 1 && currentIndex !== -1}
		>
			<ArrowDown class="mr-4" />
			Forward
		</button>

		<button
			class="inline-flex w-full bg-gray-300 p-2 text-right sm:p-4 dark:bg-gray-700"
			onclick={nextWord}
		>
			NEW CARD
			<ArrowRight class="ml-4" />
		</button>
	</div>
</div>

<svelte:window onkeydown={handleKeyDown} />

<style>
	/* This container is needed to position the front and back side */
	.flip-box-inner {
		position: relative;
		width: 100%;
		height: 100%;
		text-align: center;
		transition: transform 0.8s;
		transform-style: preserve-3d;
		cursor: pointer;
		user-select: none;
	}

	/* Do an horizontal flip on button click */
	.flip-it {
		transform: rotateY(180deg);
	}
</style>
