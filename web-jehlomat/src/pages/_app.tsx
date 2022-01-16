import type { AppProps } from "next/app"
import { Box } from "@mui/material"
import { Footer } from "components/Footer/Footer"
import { QueryClient, QueryClientProvider } from "react-query"
import { css, Global } from "@emotion/react"

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Global
        styles={css`
          html,
          body,
          html * {
            font-family: "Roboto", sans-serif;
          }

          body {
            margin: 0;
          }

          #root {
            display: flex;
            flex-direction: column;
            min-height: 500px;
          }
        `}
      />

      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Component {...pageProps} />
        <Footer />
      </Box>
    </QueryClientProvider>
  )
}

export default MyApp
