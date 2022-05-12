<script>
  import Header from "./lib/header/Header.svelte";
  import { ThemeWrapper } from 'svelte-themer';
  import { themes } from "./themes";
  import { onMount, tick } from 'svelte';
  import EasyMDE from 'easymde';
  import { slide } from 'svelte/transition';
  import { marked } from 'marked';
  import html2canvas from 'html2canvas';

  let easyMDE;
  onMount(() => {
    easyMDE = new EasyMDE({
      autofocus: true,
      autosave: {
        enabled: true,
        uniqueId: 'md2pic'
      },
      maxHeight: '20em',
      spellChecker: false,
      toolbar: ["bold", "italic", "heading", "horizontal-rule", "|", "quote", "unordered-list", "ordered-list", "|", "link", "image", "table", "|", "clean-block", "fullscreen", "preview", "guide"]
    });
    easyMDE.codemirror.on("change", () => {
        value = easyMDE.value();
    });
  })

  let isEditing = true;
  let isHacking = false;
  let hasPictured = false;
  let value = '';

  async function toPic() {
    if (isEditing) {
      value = easyMDE.value();
    }
    isEditing = false;
    isHacking = false;
    await tick();
    takePicture();
  }

  async function toHack() {
    value = easyMDE.value();
    isEditing = false;
    isHacking = true;
  }

  let cssString = '';

  async function toEdit() {
    isEditing = true;
    isHacking = false;
    hasPictured = false;
    await tick();
    easyMDE = new EasyMDE({initialValue: value});
  }

  const takePicture = () => {
    html2canvas(document.querySelector("#html-wrapper")).then(async (canvas) => {
      hasPictured = true;
      const dataUrl = canvas.toDataURL();
      await tick();
      document.querySelector("#pic-slot").src = dataUrl;
    });
  };
</script>

<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/easymde/dist/easymde.min.css">
</svelte:head>

<ThemeWrapper themes="{themes}">
<Header />

<main>
  {#if isEditing}
  <div class="wrapper" transition:slide="{{duration: 200}}">
    <textarea class="textarea"></textarea>
  </div>
  {/if}
  <div class="wrapper actions-wrapper">
    {#if isEditing}
    <div text-xl border-b-1 hover-cursor-pointer mono flex items-center on:click="{toPic}">md2pic<span class="i-carbon-arrow-down" /></div>
    <div text-xl border-b-1 hover-cursor-pointer mono flex items-center on:click="{toHack}">css<span class="i-carbon-area-custom" /></div>
    {:else}
    <div text-xl border-b-1 hover-cursor-pointer mono flex items-center on:click="{toEdit}"><span class="i-carbon-arrow-up" />edit</div>
    {#if isHacking}
    <div text-xl border-b-1 hover-cursor-pointer mono flex items-center on:click="{toPic}">md2pic<span class="i-carbon-arrow-down" /></div>
    {/if}
    {/if}
  </div>
  {#if !isEditing}
  <div class="wrapper">
    {#if !hasPictured}
    {#if isHacking}
    <div transition:slide="{{duration: 200}}">
      <div w-full flex items-center justify-start gap-6 b-1 rounded-md p-3>
        <div text-base less-mono flex items-center><span mr-3 class="i-carbon-keyboard" /><span>Enter your css string. </span><span text-slate-400 ml-3>// color: #ff3e00; font-size: 100px; </span></div>
      </div>
      <textarea w-full bind:value="{cssString}" rounded-md p-3 mt-3></textarea>
    </div>
    {:else}
    <div flex items-center justify-start gap-6 b-1 rounded-md p-3  transition:slide="{{duration: 200}}">
      <div text-base less-mono flex items-center><span mr-3 class="i-carbon-camera" /><span>picturing...</span></div>
    </div>
    {/if}
    {:else}
    <div flex items-center justify-start gap-6 b-1 rounded-md p-3  transition:slide="{{duration: 200}}">
      <div text-base less-mono flex items-center><span mr-3 class="i-carbon-machine-learning" /><span>done</span></div>
      <div text-base less-mono>Long press to save the image. </div>
    </div>
    {/if}
  </div>
  <div class="wrapper result-wrapper">
    {#if !hasPictured}
    <div w-full id="html-wrapper" style="{cssString}">{@html marked(value)}</div>
    {:else}
    <div w-full shadow-md rounded-md p-0 class="pic-wrapper" transition:slide="{{duration: 200}}"><img w-full id="pic-slot" /></div>
    {/if}
  </div>
  {/if}
</main>

<footer>Powered by <a href="https://svelte.dev">Svelte</a></footer>
</ThemeWrapper>

<style lang="scss">
  @import url("https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&family=Noto+Serif+SC:wght@400;700&display=swap");
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');

  :global(html) {
    background-color: var(--theme-colors-background, initial);
    color: var(--theme-colors-text, initial);
  }

  :global(body) {
    margin: 0;
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
    margin: 2em auto;
  }

  .actions-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2em
  }

  #html-wrapper {
    padding: 2em;
    font-size: 12px;
    font-weight: normal;
    font-family: "Noto Serif SC", serif;
    text-align: left;
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
