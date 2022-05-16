<script>
	let title = 'md2pic';
	let link = 'https://github.com/liuyiqi1999/svelte-md2pic';
	import logo from './svelte-logo.svg';

	let theme = 'light';

	function changeTheme(next) {
		const now = next === 'dark' ? 'light' : 'dark';
		if(document.documentElement.classList.contains(now)) {
			document.documentElement.classList.replace(now, next);
		} else {
			document.documentElement.classList.add(next);
		}
		theme = next;
	}

	if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
		changeTheme('dark');
	}
	else {
		changeTheme('light');
	}
</script>

<header max-w-full flex justify-between items-center border-b-1 b-accent px-2>
	<div flex justify-center items-center>
		<div flex justify-center items-center>
			<div w-12 h-12>
				<a href="https://kit.svelte.dev" flex justify-center items-center w-full h-full>
					<img w-8 h-8 object-contain src={logo} alt="SvelteKit" />
				</a>
			</div>
		</div>
		<a mono text-base font-bold no-underline c-gray-600 dark:c-gray-300 border-l-1 b-accent pl-3 class="title" href="/">{title}</a>
	</div>
	<div flex justify-center items-center gap-2 align-mid>
		<a no-underline href="{link}"><i i-carbon-logo-github text-2xl c-gray-600 dark:c-gray-300 hover:c-accent/></a>
		{#if theme === 'light'}
		<div i-carbon-sun text-2xl c-gray-600 dark:c-gray-300 hover:c-accent  on:click="{() => changeTheme('dark')}" />
		{:else if theme === 'dark'}
		<div i-carbon-moon text-2xl c-gray-600 dark:c-gray-300 hover:c-accent  on:click="{() => changeTheme('light')}" />
		{/if}
	</div>
</header>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Major+Mono+Display&display=swap');
</style>
