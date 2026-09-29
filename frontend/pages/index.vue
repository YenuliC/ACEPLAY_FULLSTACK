<script setup>
// Root "/" — redirect to dashboard if logged in, otherwise to login.
// Runs client-side only (ssr: false in nuxt.config).
const token = import.meta.client ? localStorage.getItem("token") : null;
await navigateTo(token ? "/dashboard" : "/login", { replace: true });
</script>
