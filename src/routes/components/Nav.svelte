<script>
	import { Navbar, NavLi, NavBrand, NavUl, NavHamburger, DarkMode } from 'flowbite-svelte';
	import { page } from '$app/state';

	let activeUrl = $derived(page.url.pathname);
</script>

<header
	class="sticky top-0 z-40 mx-auto w-full flex-none border-b border-gray-200 bg-white dark:border-gray-600 dark:bg-indigo-950"
>
	<Navbar fluid class="px-8">
		<NavBrand href="/">
			<span class="ml-2 self-center text-xl font-semibold whitespace-nowrap dark:text-white"
				>Multilanguage flashcard</span
			>
		</NavBrand>
		<div class="flex items-center lg:order-2">
			<DarkMode class="inline-block hover:text-gray-900 dark:hover:text-white" />
			<NavHamburger />
		</div>
		<NavUl {activeUrl} class="lg:order-1 lg:space-x-5 xl:space-x-8">
			<NavLi href="/">Home</NavLi>
			<NavLi href="/emoji">Emoji</NavLi>
			<NavLi href="/about">About</NavLi>
		</NavUl>
	</Navbar>
</header>
