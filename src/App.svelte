<script>
  import Header from "./lib/header/Header.svelte";
  import { ThemeWrapper } from 'svelte-themer'
  import { themes } from "./themes";
  import { onMount } from 'svelte';
  import EasyMDE from 'easymde';
  onMount(() => {
    const easyMDE = new EasyMDE();
  })
</script>

<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/easymde/dist/easymde.min.css">
</svelte:head>

<ThemeWrapper themes="{themes}">
<Header />
<main>
  <div class="wrapper">
    <textarea></textarea>
  </div>
  <div class="wrapper">
    <span border-b-1 text-lg mono hover-cursor-pointer>md2pic<div ml-1 class="i-carbon-arrow-right" /></span>
  </div>
</main>
<footer>Powered by <a href="https://svelte.dev">Svelte</a></footer>
</ThemeWrapper>

<style>
  :global(html) {
    background-color: var(--theme-colors-background, initial);
    color: var(--theme-colors-text, initial);
  }

  :root {
    font-family: Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
      Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  main {
    padding: 1em;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4rem;
    font-weight: 100;
    line-height: 1.1;
    margin: 2rem auto;
    max-width: 14rem;
  }

  a {
    color: var(--theme-colors-primary)
  }

  a:hover {
    color: var(--theme-colors-accent)
  }

  p {
    max-width: 14rem;
    margin: 1rem auto;
    line-height: 1.35;
  }

  footer {
    font-size: 0.9em;
    color: var(--theme-colors-secondary);
    width: 100%;
		text-align: center;
	}

  .wrapper {
    max-width: 50em;
    margin: 3em auto;
  }

	@media (min-width: 480px) {
		footer {
			padding: 40px 0;
		}
	}

  @media (min-width: 480px) {
    h1 {
      max-width: none;
    }

    p {
      max-width: none;
    }
  }
</style>
