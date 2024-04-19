<script>
  import '../app.pcss';
  import { Runatics } from 'runatics';
  import Nav from './components/Nav.svelte';
  import Footer from './components/Footer.svelte';
  let { children, data } = $props();
  const analyticsId = data.ANALYTICS_ID
</script>
<Runatics {analyticsId} />
<Nav />
<main class="border-b border-gray-200 p-4 pb-16 dark:border-gray-700">
  {@render children()}
</main>
<Footer />
