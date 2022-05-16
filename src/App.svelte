<script>
  import Header from "./lib/header/Header.svelte";
  import { onMount, tick } from 'svelte';
  import EasyMDE from 'easymde';
  import { fly } from 'svelte/transition';
  import { marked } from 'marked';
  import html2canvas from 'html2canvas';
  import Tag from './lib/Tag.svelte';
  import UserDefinedTag from "./lib/UserDefinedTag.svelte";
  import MonoButton from './lib/MonoButton.svelte';
  import CommandLineBox from './lib/CommandLineBox.svelte';
  
  const USER_DEFINE_CSS_PREFIX = 'css-user-';

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
      value: 'width: 40em; padding-top: 3em; padding-bottom: 3em;'
    },
    {
      name: `your teacher's cLaSsIc keynotes`,
      value: `color: red; background-color: blue; font-size: 26px; font-family: 'Comic Sans MS';`,
    }
  ]
  let cssSelected = [false, false, false, false];

  function onClickTag(index) {
    cssSelected[index] = !cssSelected[index];
    cssString = tags.filter((tag, index) => cssSelected[index]=== true).map(tag => tag.value).join(' ');
  }

  let userDefiningCSSName = '';
  let userDefinedCSSTags = getLocalCSSUserArr();

  function getLocalCSSUserArr () {
    const cssUser = localStorage.getItem('css-user');
    return cssUser ? JSON.parse(cssUser) : [];
  }

  async function onAddUserDefinedCSSTag () {
    userDefinedCSSTags = [...userDefinedCSSTags, ''];
    await tick();
    const input = document.getElementById('tag-input');
    input.focus();
  }
  
  function onReadyUserDefinedCSS (event) {
    userDefinedCSSTags = [...userDefinedCSSTags.filter(item => item !== event.detail.tagName), event.detail.inputValue];
    const cssUserArr = getLocalCSSUserArr();
    localStorage.setItem('css-user', JSON.stringify([...cssUserArr, event.detail.inputValue]))
  }

  function onClickUserDefinedCSS (event) {
    if(event.detail !== userDefiningCSSName) { // select
      cssSelected = [false, false, false, false];
      userDefiningCSSName = event.detail;
    } else { // unSelect
      userDefiningCSSName = '';
    }
  }

  function onDeleteUserDefinedCSS (event) {
    userDefinedCSSTags = userDefinedCSSTags.filter(tag => tag !== event.detail);
    localStorage.removeItem(`${USER_DEFINE_CSS_PREFIX}${event.detail}`);
    const cssUserArr = getLocalCSSUserArr();
    localStorage.setItem('css-user', cssUserArr.filter(item => item != event.detail))
  }

  function storeCSSSettings () {
    localStorage.setItem('css', cssString);
    if (userDefiningCSSName) {
      localStorage.setItem(`${USER_DEFINE_CSS_PREFIX}${userDefiningCSSName}`, cssString);
    }
  }

  async function toPic() {
    if (isEditing) {
      value = easyMDE.value();
    } else if (isHacking) {
      storeCSSSettings();
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
      document.querySelector("#pic-slot").setAttribute('src', dataUrl);
    });
  };

</script>

<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/easymde/dist/easymde.min.css">
</svelte:head>

<main h-full>
  <Header />
  <div px-4>
    {#if isEditing}
    <div max-w-4xl my-8 transition:fly="{{duration: 100}}">
      <textarea class="textarea"></textarea>
    </div>
    {/if}
    <div max-w-4xl my-8 flex justify-center items-center gap-8>
      {#if isEditing}
      <MonoButton on:click="{toPic}">md2pic<i i-carbon-arrow-down ml-1/></MonoButton>
      <MonoButton on:click="{toHack}">css<i i-carbon-area-custom ml-1/></MonoButton>
      {:else}
      <MonoButton on:click="{toEdit}"><i i-carbon-arrow-up mr-1 />edit</MonoButton>
        {#if isHacking}
        <MonoButton on:click="{toPic}">md2pic<i i-carbon-arrow-down ml-1 /></MonoButton>
        {/if}
      {/if}
    </div>
    {#if !isEditing}
    <div max-w-4xl my-8 transition:fly="{{duration: 200}}">
      {#if !hasPictured}
        {#if isHacking}
        <div>
          <CommandLineBox>
            <div text-base less-mono flex items-center><i i-carbon-keyboard mr-3 /><span>Enter your CSS string or select some of the presets. </span></div>
          </CommandLineBox>
          <div overflow-auto flex items-center gap-1 mt-3>
            <i i-carbon-template mr-2/>
              {#each tags as tag, i}
              <Tag on:click="{() => onClickTag(i)}" selected={cssSelected[i]}>{tag.name}</Tag>
              {/each}
          </div>
          <div overflow-auto flex items-center gap-1 mt-2>
            <i i-carbon-brush-polygon mr-2 />
              {#each userDefinedCSSTags as tag (tag)}
              <UserDefinedTag
                tagName={tag}
                selected={userDefiningCSSName === tag}
                on:ready={onReadyUserDefinedCSS}
                on:click={onClickUserDefinedCSS}
                on:delete={onDeleteUserDefinedCSS}
              />
              {/each}
              <Tag selected={false} on:click={onAddUserDefinedCSSTag}>
                <i class="i-carbon-add" />
                <span>New CSS set</span>
              </Tag>
          </div>
          <textarea w-full box-border c-dark dark:c-light bg-light dark:bg-dark bind:value="{cssString}" rounded-md p-3 mt-3></textarea>
          <div w-full flex items-center justify-start gap-6 p-3 mt-3>
            <div text-xs less-mono text-slate-400>If you don't know what <a no-underline text-slate-400 href="https://www.w3schools.com/css/">CSS</a> is, it's the <span underline decoration-gray-400>easiest</span> and the <span underline decoration-gray-400>best</span> <span underline decoration-gray-400>programming language</span> in the world, and none of the underlining words is true. </div>
          </div>
        </div>
        {:else}
        <CommandLineBox>
          <div text-base less-mono flex items-center><i i-carbon-camera mr-3  /><span>picturing...</span></div>
        </CommandLineBox>
        {/if}
      {:else}
      <CommandLineBox>
        <div text-base less-mono flex items-center><i i-carbon-machine-learning mr-3 /><span>done</span></div>
        <div text-base less-mono>Long press to save the image. </div>
      </CommandLineBox>
      {/if}
    </div>
    <div max-w-4xl my-8 class="result-wrapper" transition:fly="{{duration: 300}}">
      {#if !hasPictured}
      <div max-w-full shadow-md rounded-md id="html-wrapper" style="{cssString}">{@html marked(value, {breaks: true})}</div>
      {:else}
      <div max-w-full shadow-md rounded-md p-0><img w-full alt="result-text" id="pic-slot" /></div>
      {/if}
    </div>
    {/if}
  </div>
  <footer text-sm c-gray-400 w-full text-center>Powered by <a href="https://svelte.dev">Svelte</a></footer>
</main>


<style lang="scss">
  @import url("https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&family=Noto+Serif+SC:wght@400;700&display=swap");
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');

  :global(html, body) {
    margin: 0;
    padding: 0;
  }

  :global(html) {
    color: rgb(34, 34, 34);
    background-color: rgb(246, 246, 246);
  }

  :global(html.dark) {
    color: rgb(246, 246, 246);
    background-color: rgb(34, 34, 34);
  }

  :global(#app) {
    font-family: Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
      Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  :global(.dark .EasyMDEContainer .editor-toolbar) {
    background-color: rgb(44, 44, 44);
  }

  :global(.dark .CodeMirror, .editor-preview) {
      color: #fff;
      border-color: rgb(75, 85, 99);
      background-color: rgb(44, 44, 44);
  }

  :global(.dark .cm-s-easymde .CodeMirror-cursor) {
      border-color: #fff !important;
  }

  :global(.dark .editor-toolbar button i) {
      color: #fff;
  }

  :global(.dark .editor-toolbar button i:hover) {
      color: #ff3e00;
  }

  :global(.dark .editor-preview pre) {
      background-color: #333;
  }

  #html-wrapper {
    padding: 2em;
    font-size: 12px;
    font-weight: normal;
    font-family: "Noto Serif SC", serif;
    text-align: left;
  }

  a {
    color: #ff3e00;
  }

	@media (min-width: 480px) {
		footer {
			padding: 40px 0;
		}
	}
</style>
