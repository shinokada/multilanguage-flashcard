<script>
	import '../app.pcss';
    import Nav from './components/Nav.svelte'
	let { children } = $props();
</script>

<Nav />
<main class="mb-16 p-4">
{@render children()}
</main>
