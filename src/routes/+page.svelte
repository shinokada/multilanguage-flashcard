<script lang="ts">
  import { onMount } from 'svelte';
  import { Label, Select } from 'svelte-5-ui-lib';
  import { randomNumberGenerator } from '$lib/utils';
  import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from '$lib';
  const randomIndexFn = randomNumberGenerator(26, 1933, 50);

  let randomIndex = $state(randomIndexFn()); // This will be the index for the currently displayed emoji
  let {
    myLang = $bindable('en'),
    targetLang = $bindable('nb')
  }: { myLang: string; targetLang: string } = $props();

  interface EmojiHistoryItem {
    index: number;
    myLangValue: string; // Store language values used when this item was added
    targetLangValue: string;
  }

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

  let emojiHistory = $state<Array<EmojiHistoryItem>>([]);
  let currentIndex = $state(-1); // -1 means no card loaded yet

  // These will hold the actual loaded emoji data for the *current* languages
  let currentMyLangData = $state<any[] | null>(null);
  let currentTargetLangData = $state<any[] | null>(null);

  let isTouch = $state(false);
  onMount(async () => {
    isTouch = window.matchMedia('(pointer: coarse)').matches;
    // Load the initial data and set up the first card
    await loadCurrentEmojiData();
    // Add the first card to history after initial load
    if (currentIndex === -1) { // Only if history is empty
      addToHistory(randomIndex);
    }
  });

  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

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
      // Horizontal swipe
      if (deltaX < -30) {
        // Swipe left - navigate forward or generate new card
        if (currentIndex < emojiHistory.length - 1) {
          showNextEmoji();
        } else {
          nextWord();
        }
      } else if (deltaX > 30) {
        // Swipe right - show previous word
        showPreviousEmoji();
      }
    } else {
      // Vertical swipe
      if (deltaY < -30 || deltaY > 30) {
        toggleShowBack();
      }
    }
  }

  const loadLanguageData = async (lang: string) => {
    try {
      const module = await import(`../../node_modules/emojibase-data/${lang}/data.json`);
      return module.default;
    } catch (error) {
      console.error(`Failed to load language data for ${lang}:`, error);
      return [];
    }
  };

  // Function to load data for the *currently active* randomIndex and languages
  const loadCurrentEmojiData = async () => {
    currentMyLangData = await loadLanguageData(myLang);
    currentTargetLangData = await loadLanguageData(targetLang);
  };

  const addToHistory = (index: number) => {
    const historyItem: EmojiHistoryItem = {
      index,
      myLangValue: myLang,
      targetLangValue: targetLang
    };
    emojiHistory = [...emojiHistory, historyItem];
    currentIndex = emojiHistory.length - 1;
    randomIndex = index; // Ensure randomIndex reflects the newly added item's index
  };

  // Function to move to a specific card in history
  const goToCard = async (idx: number) => {
    if (idx >= 0 && idx < emojiHistory.length) {
      currentIndex = idx;
      const historyItem = emojiHistory[currentIndex];
      randomIndex = historyItem.index; // Set randomIndex to the one from history
      // If the languages for this historical item are different from current,
      // you might want to switch languages or just display in current languages.
      // For now, we'll just reload the data based on *current* selected languages.
      await loadCurrentEmojiData();
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
      // If at the end of history, generate a new one
      nextWord();
    }
  };

  const selectedLanguage = $derived(languages.find((lang) => lang.value === myLang));
  const targetLanguage = $derived(languages.find((lang) => lang.value === targetLang));
  let showCardBack = $state(false);
  const toggleShowBack = () => (showCardBack = !showCardBack);

  // This is the function responsible for creating a *new* random word
  const nextWord = async () => {
    showCardBack = false;
    const newRandomIndex = randomIndexFn();
    addToHistory(newRandomIndex);
    await loadCurrentEmojiData(); // Ensure the data for the new card is loaded
  };

  // Effect to re-load emoji data when myLang or targetLang changes
  $effect(() => {
    // This effect ensures that the currently displayed emoji's text
    // updates when the selected languages change.
    // It *does not* generate a new randomIndex or add to history.
    if (myLang && targetLang && currentIndex !== -1) {
      loadCurrentEmojiData();
    }
  });


  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      showPreviousEmoji();
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      showNextEmoji();
    } else if (event.key === 'Enter' || event.key === ' ') {
      toggleShowBack();
    } else if (event.key === 'n' || event.key === 'N') {
      nextWord();
    }
  }

  function preventDefault<T>(this: T, fn: (this: T, event: KeyboardEvent) => void) {
    return function (this: T, event: KeyboardEvent) {
      event.preventDefault();
      fn.call(this, event);
    };
  }
</script>

<div class="flex flex-col items-center">
  <h1 class="mx-4 text-3xl">Multilanguage Flashcard</h1>

  <div class="mb-4 mx-auto w-96">
    <Label class="w-48 mx-auto">Change your languages:</Label>
    <Select class="w-48 mx-auto mt-2" items={languages} bind:value={myLang} onchange={() => { /* nothing special here, the effect handles it */ }} />
    <Select class="w-48 mx-auto mt-2" items={languages} bind:value={targetLang} onchange={() => { /* nothing special here, the effect handles it */ }} />
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
      onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleShowBack()}
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
          class="absolute inset-0 flex flex-col items-center justify-center bg-green-500 p-4 text-white opacity-0 {showCardBack
            ? 'opacity-100 [transform:rotateY(180deg)]'
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
      class="w-full inline-flex items-center bg-gray-300 p-2 sm:p-4 dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={currentIndex <= 0}
    >
      <ArrowUp class="mr-4" />
      Previous
    </button>

    <button
      onclick={showNextEmoji}
      class="w-full inline-flex items-center bg-gray-300 p-2 sm:p-4 dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={currentIndex === emojiHistory.length - 1 && currentIndex !== -1}
    >
      <ArrowDown class="mr-4" />
      Forward
    </button>

    <button
      class="w-full inline-flex bg-gray-300 p-2 text-right sm:p-4 dark:bg-gray-700"
      onclick={nextWord}
    >
      NEW CARD
      <ArrowRight class="ml-4" />
    </button>
  </div>
</div>

<svelte:window onkeydown={preventDefault(handleKeyDown)} />

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