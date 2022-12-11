/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Supabase {
	  Database: import('./lib/database.types').Database
	  SchemaName: 'public'
	}

	// interface Locals {}
	interface PageData {
	  session: import('@supabase/supabase-js').Session | null
	}
	// interface Error {}
	// interface Platform {}
  }
