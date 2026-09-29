export const useApi = async (url, method = "GET", body = null) => {
  const config = useRuntimeConfig();
  const token  = import.meta.client ? localStorage.getItem("token") : null;

  const options = {
    method,
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  };

  if (body !== null) options.body = body;

  return await $fetch(config.public.apiBase + url, options);
};
