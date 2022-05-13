<script>
    export let selected = false;
</script>

<span
    class:active="{selected}"
    less-mono text-slate-400 text-sm rounded-lg b-1 p-1 px-2 mr-1 hover:text-slate-600 hover:cursor-pointer
    on:click
>
    <slot />
</span>

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