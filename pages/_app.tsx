import type { AppProps } from 'next/app'
import { ThemeProvider, BaseStyles } from '@primer/components'
import {createClient} from "@supabase/supabase-js";

export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_KEY!);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <BaseStyles>
        <Component {...pageProps} />
      </BaseStyles>
    </ThemeProvider>
  );
}
export default MyApp
