<script>
  import Header from "./lib/header/Header.svelte";
  import { ThemeWrapper } from 'svelte-themer';
  import { themes } from "./themes";
  import { onMount, tick } from 'svelte';
  import EasyMDE from 'easymde';
  import { fly } from 'svelte/transition';
  import { marked } from 'marked';
  import html2canvas from 'html2canvas';
  import Tag from './lib/Tag.svelte';
  import MonoButton from './lib/MonoButton.svelte';
  import CommandLineBox from './lib/CommandLineBox.svelte';

  let easyMDE;
  onMount(() => {
    easyMDE = new EasyMDE({
      renderingConfig:{
        singleLineBreaks: false,
      },
      spellChecker: false,
      autofocus: true,
      autosave: {
        enabled: true,
        uniqueId: 'md2pic'
      },
      maxHeight: '20em',
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
  let cssString = localStorage.getItem('css') ?? '';

  async function toPic() {
    if (isEditing) {
      value = easyMDE.value();
    } else if (isHacking) {
      localStorage.setItem('css', cssString);
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


  async function toEdit() {
    isEditing = true;
    isHacking = false;
    hasPictured = false;
    await tick();
    easyMDE = new EasyMDE({
      spellChecker: false,
      autofocus: true,
      autosave: {
        enabled: true,
        uniqueId: 'md2pic'
      },
      maxHeight: '20em',
      toolbar: ["bold", "italic", "heading", "horizontal-rule", "|", "quote", "unordered-list", "ordered-list", "|", "link", "image", "table", "|", "clean-block", "fullscreen", "preview", "guide"],
      initialValue: value
    });
  }

  const takePicture = () => {
    const node = document.getElementById('html-wrapper');
    node.style.display = 'none';
    node.style.transform = 'scale(2)';
    html2canvas(node, {scale: 2, onclone: function (clonedDoc) {
        clonedDoc.getElementById('html-wrapper').style.display = 'block';
    }}).then(async (canvas) => {
      hasPictured = true;
      const dataUrl = canvas.toDataURL();
      await tick();
      document.querySelector("#pic-slot").src = dataUrl;
    });
  };

  let tags = [
    {
      name: 'default',
      value: ''
    },
    {
      name: 'modern(sans-serif)',
      value: 'font-family: sans-serif;'
    },
    {
      name: 'phone',
      value: 'width: 33em;'
    },
    {
      name: `your teacher's cLASsiC keynotes`,
      value: `color: red; background-color: blue; font-size: 26px; font-family: 'Comic Sans MS';`,
    }
  ]
  let cssSelected = [false, false, false, false];

  function onClickTag(index) {
    cssSelected[index] = !cssSelected[index];
    cssString = tags.filter((tag, index) => cssSelected[index]=== true).map(tag => tag.value).join(' ');
  }

</script>

<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/easymde/dist/easymde.min.css">
</svelte:head>

<ThemeWrapper themes="{themes}">
<Header />

<main>
  {#if isEditing}
  <div class="wrapper" transition:fly="{{duration: 300}}">
    <textarea class="textarea"></textarea>
  </div>
  {/if}
  <div class="wrapper actions-wrapper">
    {#if isEditing}
    <MonoButton on:click="{toPic}">md2pic<span class="i-carbon-arrow-down" /></MonoButton>
    <MonoButton on:click="{toHack}">css<span class="i-carbon-area-custom" /></MonoButton>
    {:else}
    <MonoButton on:click="{toEdit}"><span class="i-carbon-arrow-up" />edit</MonoButton>
    {#if isHacking}
    <MonoButton on:click="{toPic}">md2pic<span class="i-carbon-arrow-down" /></MonoButton>
    {/if}
    {/if}
  </div>
  {#if !isEditing}
  <div class="wrapper" transition:fly="{{duration: 300}}">
    {#if !hasPictured}
    {#if isHacking}
    <div>
      <CommandLineBox>
        <div text-base less-mono flex items-center><span mr-3 class="i-carbon-keyboard" /><span>Enter your CSS string or select some of the presets. </span></div>
      </CommandLineBox>
      <div overflow-auto flex items-center gap-1 p-3 pl-0 mt-3>
        {#each tags as tag, i}
        <Tag on:click="{() => onClickTag(i)}" selected={cssSelected[i]}>{tag.name}</Tag>
        {/each}
      </div>
      <textarea w-full box-border bind:value="{cssString}" rounded-md p-3 mt-3></textarea>
      <div w-full flex items-center justify-start gap-6 p-3 mt-3>
        <div text-xs less-mono text-slate-400>If you don't know what <a href="https://www.w3schools.com/css/">CSS</a> is, it's the <span underline decoration-gray-400>easiest</span> and the <span underline decoration-gray-400>best</span> <span underline decoration-gray-400>programming language</span> in the world, and none of the underlining words is true. </div>
      </div>
    </div>
    {:else}
    <CommandLineBox>
      <div text-base less-mono flex items-center><span mr-3 class="i-carbon-camera" /><span>picturing...</span></div>
    </CommandLineBox>
    {/if}
    {:else}
    <CommandLineBox>
      <div text-base less-mono flex items-center><span mr-3 class="i-carbon-machine-learning" /><span>done</span></div>
      <div text-base less-mono>Long press to save the image. </div>
    </CommandLineBox>
    {/if}
  </div>
  <div class="wrapper result-wrapper" transition:fly="{{duration: 300}}">
    {#if !hasPictured}
    <div w-full max-w-full id="html-wrapper" style="{cssString}">{@html marked(value, {breaks: true})}</div>
    {:else}
    <div max-w-full shadow-md rounded-md p-0 class="pic-wrapper"><img w-full id="pic-slot" /></div>
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
    margin-top: 0;
    overflow: scroll;
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
