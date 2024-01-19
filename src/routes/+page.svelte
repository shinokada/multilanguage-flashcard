<script lang="ts">
    import { Label, Select } from 'svelte-5-ui-lib'
    // import * as Lang from 'emojibase-data'
    // $inspect('Lang: ', Lang)
    // let selected: any =$state();
	const languages = [
		{ value: 'en', name: 'English' },
		{ value: 'ja', name: 'Japanese' },
		{ value: 'nb', name: 'Norwegian' }
	];

    const imports = {
		en: () => import('emojibase-data/en/data.json'),
		ja: () => import('emojibase-data/ja/data.json'),
		nb: () => import('emojibase-data/nb/data.json')
	};

    // let component = $state('en');
    // let jsonContent;

    let myLanguage = $state('en');
    let targetLanguage = $state('no');
    $inspect('myLanguage: ', myLanguage, 'targeLanguage: ', targetLanguage)

</script>

<h1>Learn with Emoji</h1>


<label>
	<input type="radio" bind:group={myLanguage} value="en">
	a
</label>

<label>
	<input type="radio" bind:group={myLanguage} value="ja">
	b
</label>

<label>
	<input type="radio" bind:group={myLanguage} value="nb">
	c
</label>

{#await imports[myLanguage]() then json}
    <pre>{JSON.stringify(json, null, 2)}</pre> 
{/await}

