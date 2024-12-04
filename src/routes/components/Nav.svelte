<script>
  import { Navbar, NavLi, NavBrand, NavUl, uiHelpers, Darkmode } from 'flowbite-svelte';
  import { page } from '$app/stores';

  let activeUrl = $state($page.url.pathname);
  $effect(() => {
    activeUrl = $page.url.pathname;
  });

  let nav = uiHelpers();

  let navStatus = $state(false);
  let toggleNav = nav.toggle;
  let closeNav = nav.close;
  // let divClass = 'w-full ml-auto lg:block lg:w-auto lg:order-none';
  let divClass = 'ml-auto w-full';
  let ulclass =
    'flex flex-col py-3 lg:flex-row lg:my-0 order-1 font-medium gap-4 dark:lg:bg-transparent lg:bg-white lg:border-0';
  let navClass =
    'w-full divide-gray-200 border-gray-200 bg-white text-gray-500 dark:divide-gray-700 dark:border-gray-700 dark:bg-indigo-950 dark:text-gray-400 sm:px-4';
  $effect(() => {
    // this can be done adding nav.navStatus directly to DOM element
    // without using effect
    navStatus = nav.isOpen;
  });
  // md:block md:w-auto w-full ml-auto lg:block lg:w-auto order-1 lg:order-none
</script>

<header
  class="sticky top-0 z-40 mx-auto w-full flex-none border-b border-gray-200 bg-white dark:border-gray-600 dark:bg-sky-950"
>
  <Navbar {navClass} {toggleNav} {closeNav} {navStatus} fluid div2Class={divClass}>
    {#snippet brand()}
      <NavBrand siteName="Multilanguage Flashcard" {closeNav} />
      <div class="ml-auto flex items-center md:order-1">
        <Darkmode class="inline-block hover:text-gray-900 dark:hover:text-white" />
      </div>
    {/snippet}

    <NavUl {activeUrl} class={ulclass}>
      <NavLi href="/" {closeNav}>Home</NavLi>
      <NavLi href="/emoji" {closeNav}>Emoji</NavLi>
      <NavLi href="/about" {closeNav}>About</NavLi>
    </NavUl>
  </Navbar>
</header>
