import { Inter } from '@next/font/google';
import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Todos } from '@/components/Todos';

const inter = Inter({ subsets: ['latin'] })

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } }
});

export default function Home() {

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col items-center gap-5 m-5">
          <Todos />
          <ReactQueryDevtools />
        </div>
      </QueryClientProvider>
    </>
  )
}
