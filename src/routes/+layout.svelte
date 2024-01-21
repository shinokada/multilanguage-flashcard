<script>
	import '../app.pcss';
    import Nav from './components/Nav.svelte'
	import Footer from './components/Footer.svelte'
	let { children } = $props();
</script>

<Nav />
<main class="pb-16 p-4 border-b border-gray-800">
{@render children()}
</main>
<Footer />
