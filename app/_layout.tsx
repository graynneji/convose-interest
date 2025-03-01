import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const queryClient = new QueryClient()

export default function RootLayout() {
  return (
    // I wrapped the tankstack query provider in the rootLayout of the entire app
    <QueryClientProvider client={queryClient}>
      <Stack />
    </QueryClientProvider>
  )
}
