<script>
  import '../app.css';
  import { Runatics } from 'runatics';
  import { RunesMetaTags, deepMerge } from 'runes-meta-tags';
  import { page } from '$app/stores';
  import Nav from './components/Nav.svelte';
  import Footer from './components/Footer.svelte';
  let { children, data } = $props();
  let metaTags = $state(
    $page.data.pageMetaTags
      ? deepMerge($page.data.layoutMetaTags, $page.data.pageMetaTags)
      : data.layoutMetaTags
  );
  $effect(() => {
    metaTags = $page.data.pageMetaTags
      ? deepMerge($page.data.layoutMetaTags, $page.data.pageMetaTags)
      : data.layoutMetaTags;
  });
  const analyticsId = data.ANALYTICS_ID_LANGUAGE_APP;
</script>

<Runatics {analyticsId} />
<RunesMetaTags {...metaTags} />
<Nav />
<main class="border-b border-gray-200 p-4 pb-16 dark:border-gray-700">
  {@render children()}
</main>
<Footer />
