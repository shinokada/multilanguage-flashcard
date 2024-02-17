<script>
  import '../app.pcss';
  import Nav from './components/Nav.svelte';
  import Footer from './components/Footer.svelte';
  let { children } = $props();
</script>

<Nav />
<main class="border-b border-gray-200 p-4 pb-16 dark:border-gray-700">
  {@render children()}
</main>
<Footer />
