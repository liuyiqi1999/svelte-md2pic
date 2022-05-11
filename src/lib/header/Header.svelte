<script>
	let title = 'title';
	let link = 'https://github.com/liuyiqi1999';
	import ThemeToggler from '../ThemeToggler.svelte';
	import logo from './svelte-logo.svg';
	import CarbonLogoGithub from '~icons/carbon/logo-github'
</script>

<header>
	<div class="head-wrapper">
		<div class="icon-wrapper">
			<div class="icon">
				<a href="https://kit.svelte.dev">
					<img src={logo} alt="SvelteKit" />
				</a>
			</div>
		</div>
		<a class="title" href="/">{title}</a>
	</div>
	<div class="corner">
		<a class="link-icon" href="{link}"><CarbonLogoGithub /></a>
		<span class="link-icon"><ThemeToggler /></span>
	</div>
</header>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Major+Mono+Display&display=swap');

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-color: rgba(255, 62, 0, 0.1);
		border-bottom-style: solid;
		border-bottom-width: 1px;
		padding: 0 0.5em;
	}

	.head-wrapper {
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.icon-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.icon {
		width: 3em;
		height: 3em;
	}

	.icon * {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.icon img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}
	
	.head-wrapper .title {
		font-family: 'Major Mono Display', monospace;
		line-height: 1em;
		font-size: 1em;
		font-weight: bold;
		color: var(--theme-colors-text);
		border-left: 1px solid var(--theme-colors-accent);
		padding-left: 0.7em;
		text-decoration: none;
	}

	.corner {
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.corner .link-icon {
		font-size: 1.3em;
		color: var(--heading-color);
		margin-left: 0.5em;
	}
	.corner .link-icon:hover {
		color: var(--theme-colors-accent);
	}

	a:hover {
		color: var(--theme-colors-accent);
	}
</style>
