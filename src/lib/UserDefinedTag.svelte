<script>
    import Tag from "./Tag.svelte";
    import { createEventDispatcher, tick } from 'svelte';
	const dispatch = createEventDispatcher();

    export let tagName = '';
    export let selected = false;
    let inputValue = '';

    async function onReady() {
        await tick();
        dispatch('ready', {tagName, inputValue});
        inputValue = '';
    }

    function onClick() {
        dispatch('click', tagName);
    }

    function deleteTag() {
        dispatch('delete', tagName);
    }

</script>

{#if tagName === ''}
<input
    id="tag-input"
    bind:value={inputValue}
    on:blur={onReady}
    text-xs whitespace-nowrap rounded-36 b-1 p-1 px-2 max-w-sm
/>
{:else if !selected}
<Tag selected={false} on:click={onClick}>
    <span>{tagName}</span><i ml-1 on:click={deleteTag} class="i-carbon-close" />
</Tag>
{:else if selected}
<Tag selected={true} on:click={onClick}>
    <span >{tagName}</span><i ml-1 on:click={deleteTag} class="i-carbon-close" /></Tag>
{/if}