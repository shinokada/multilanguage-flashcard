<script lang="ts">
  import { Label, Select } from 'svelte-5-ui-lib';

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
  let targetLang = $state('nb');
  $inspect('myLanguage: ', myLang, 'targeLanguage: ', targetLang);
  let selectedLanguage = $derived(languages.find((lang) => lang.value === myLang));
  let targetLanguage = $derived(languages.find((lang) => lang.value === targetLang));

  // selectedLanguage = languages.find(lang => lang.value === myLanguage);
</script>

<h1>Dynamic</h1>
<h2>Let's learn {targetLanguage.name} using {selectedLanguage.name}</h2>
<Select class="mt-2" items={languages} bind:value={myLang} />
<Select class="mt-2" items={languages} bind:value={targetLang} />

{#await import(`../../../node_modules/emojibase-data/${myLang}/data.json`) then json}
  <pre>{JSON.stringify(json.default[600], null, 2)}</pre>
{/await}

{#await import(`../../../node_modules/emojibase-data/${targetLang}/data.json`) then json}
  <pre>{JSON.stringify(json.default[600], null, 2)}</pre>
{/await}
