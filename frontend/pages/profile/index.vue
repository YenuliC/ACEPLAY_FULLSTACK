<script setup>
// Profile page has been removed. Redirect to change-password.
definePageMeta({ middleware: "auth" });
onMounted(() => navigateTo("/change-password", { replace: true }));
</script>
<template><div></div></template>
