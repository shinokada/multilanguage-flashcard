<script lang="ts">
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  interface Props {
    dictionary: any;
    title?: string;
    pFront?: string;
    pBack?: string;
  }
  import { twMerge } from 'tailwind-merge';
  import { Flashcard, ArrowLeft, ArrowRight } from '$lib';
  import { getRandomPair } from '$lib/utils.js';
  let { dictionary, title = 'Flashcard', pFront, pBack }: Props = $props();

  let front: string | undefined = $state('');
  let back: string | undefined = $state('');
  let showCardBack = $state(false);
  let showFront = $state('Vis norsk');
  let showBack = $state('Show English');
  let lang1lang2 = $state(
    'text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-lg px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800 opacity-100'
  );
  let lang2lang1 = $state(
    'focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-lg px-5 py-2.5 me-2 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 opacity-50'
  );
  let langlang = 'noreng';
  const toggleShowBack = () => (showCardBack = !showCardBack);

  const updateLang = (lang: string) => {
    langlang = lang;
    if (lang === 'noreng') {
      showFront = 'Vis norsk';
      showBack = 'Show English';
      lang1lang2 = twMerge(lang1lang2, 'opacity-100');
      lang2lang1 = twMerge(lang2lang1, 'opacity-50');
    } else if (lang === 'engnor') {
      showFront = 'Show English';
      showBack = 'Vis norsk';
      lang1lang2 = twMerge(lang1lang2, 'opacity-50');
      lang2lang1 = twMerge(lang2lang1, 'opacity-100');
    }
    showCardBack = false;
    const { front: newFront, back: newBack } = getRandomPair(dictionary, lang, false);
    front = newFront;
    back = newBack;
  };

  updateLang(langlang);

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      toggleShowBack();
      // console.log('arrowleft pressed')
    } else if (event.key === 'ArrowRight') {
      updateLang(langlang);
      // console.log('arrowright is pressed')
    } else if (event.key === 'Enter' || event.key === ' ') {
      toggleShowBack();
    }
  }

  function preventDefault<T>(this: T, fn: (this: T, event: KeyboardEvent) => void) {
    return function (this: T, event: KeyboardEvent) {
      event.preventDefault();
      fn.call(this, event);
    };
  }
</script>

<div class="mt-15 flex flex-col items-center">
  <h1 class="m-4 text-3xl">{title}</h1>
  <div class="flex justify-between">
    <button type="button" class={lang1lang2} onclick={() => updateLang('noreng')}
      >Norsk-English</button
    >
    <button class={lang2lang1} onclick={() => updateLang('engnor')}>English-Norsk</button>
  </div>
  <!-- FLASHCARD -->
  <div class="flip-box h-96 w-full bg-transparent md:w-2/3">
    <div
      class="flip-box-inner"
      class:flip-it={showCardBack}
      onclick={toggleShowBack}
      onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleShowBack()}
      tabindex="0"
      role="button"
      aria-pressed={showCardBack}
    >
      <Flashcard {front} {back} {showCardBack} {pFront} {pBack} />
    </div>
  </div>

  <!-- BUTTONS -->

  <div class="flex pt-4">
    <button class="inline-flex bg-gray-300 p-4 text-right" onclick={() => updateLang(langlang)}>
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
    cursor: pointer;
    user-select: none;
  }

  /* Do an horizontal flip on button click */
  .flip-it {
    transform: rotateY(180deg);
  }
</style>
