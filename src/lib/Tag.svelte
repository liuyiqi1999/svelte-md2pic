<script>
    export let selected = false;
</script>

<div
    class:active="{selected}"
    less-mono text-slate-400 text-sm whitespace-nowrap rounded-36 b-1 p-1 px-2 hover:text-slate-600 hover:cursor-pointer
    on:click
>
    <slot />
</div>

<style lang="scss">
    .active {
        font-weight: bold;
        border-width: 2px;
        color: var(--theme-colors-accent);
        border-color: var(--theme-colors-accent);
    }
    .active:hover {
        color: var(--theme-colors-accent);
        border-color: var(--theme-colors-accent);
    }
</style>