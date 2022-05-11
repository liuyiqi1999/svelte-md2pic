<script>
    import { getContext } from 'svelte'
	import CarbonLight from '~icons/carbon/light'
	import CarbonMoon from '~icons/carbon/moon'
    let { toggle, current } = getContext('theme')
</script>

{#if $current === 'light'}
<span on:click={toggle}><CarbonLight /></span>
{:else if $current === 'dark'}
<span on:click={toggle}><CarbonMoon /></span>
{/if}