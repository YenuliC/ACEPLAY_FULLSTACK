export const useCasinoData = async (country: string, slug: string) => {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/public/casino/${country}/${slug}`

  const { data, pending, error } = await useFetch(url, {
    key: `casino-${country}-${slug}`,
    server: true,
  })

  return { data, pending, error }
}
