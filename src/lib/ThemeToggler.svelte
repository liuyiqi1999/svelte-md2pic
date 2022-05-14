<script>
    import { getContext } from 'svelte'
    let { toggle, current } = getContext('theme')
</script>

{#if $current === 'light'}
<span on:click={toggle}><i class="i-carbon-light" /></span>
{:else if $current === 'dark'}
<span on:click={toggle}><i class="i-carbon-moon" /></span>
{/if}