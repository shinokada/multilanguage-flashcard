<script>
	// import emojis from 'emojibase-data/en/data.json';
	import { Select } from 'svelte-5-ui-lib';
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

	let myLang = $state('en');
</script>

<div class="mx-auto px-4 text-md dark:text-white">
	<h1>Emoji list</h1>

	<Select class="my-4 w-64" items={languages} bind:value={myLang} />

	<div class="grid grid-cols-4 gap-4 items-center">
		{#await import(`../../../node_modules/emojibase-data/${myLang}/data.json`) then emojis}
            {#each emojis.default as emoji}
            <div>
					<p><span class="text-3xl">{emoji.emoji}</span>: {emoji.label}</p>
				</div>
			{/each}
		{/await}
	</div>
</div>
