<script setup>
import { ref, computed } from "vue";
import { useLoadingStore } from "./stores/loading";
import { useAuthStore } from "./stores/auth";
import EVMApp from "./components/EVMApp.vue";

const appAddress = ref("");
const isLoggedIn = computed(() => auth.isLoggedIn);
const loadingStore = useLoadingStore();
const auth = useAuthStore();
const presetLoaded = ref("");
const appNetwork = computed(() => {
  if (appAddress.value.includes("dev")) {
    return "Dev";
  } else if (appAddress.value.includes("test")) {
    return "Testnet";
  } else if (appAddress.value.includes("live")) {
    return "Mainnet";
  } else {
    return "Local";
  }
});
const appLoaded = ref(false);

const loadApp = async () => {
  presetLoaded.value = "";
  loadingStore.showLoader("Loading the app. Please wait...");
  try {
    appLoaded.value = false;
    // Removing existing iframe if any
    document.querySelector("iframe.xar-wallet")?.remove();
    await auth.loadAuth(appAddress.value);
    appLoaded.value = true;
  } catch (e) {
    console.error(e);
    alert("Error loading app. Please check the console for more details.");
  } finally {
    loadingStore.hideLoader();
  }
};

const loadPreset = async (preset) => {
  appLoaded.value = false;
  presetLoaded.value = "";
  let address = "";
  let presetName = "";
  if (preset === "evm-mainnet") {
    address = import.meta.env.VITE_EVM_MAINNET_APP;
    presetName = "Linea Gasless";
  } else if (preset === "evm-testnet") {
    address = import.meta.env.VITE_EVM_TESTNET_APP;
    presetName = "Linea Dev";
  }
  loadingStore.showLoader(`Loading the ${presetName}. Please wait...`);
  try {
    document.querySelector("iframe.xar-wallet")?.remove();
    await auth.loadAuth(address);
    appLoaded.value = true;
    presetLoaded.value = `Loaded ${presetName}`;
  } catch (e) {
    console.error(e);
    alert("Error loading app. Please check the console for more details.");
  } finally {
    loadingStore.hideLoader();
  }
};

const login = async () => {
  await auth.login();
};

const logout = async () => {
  await auth.logout();
  appAddress.value = "";
  appLoaded.value = false;
  presetLoaded.value = "";
};
</script>

<template>
  <main style="display: flex; align-items: center; justify-content: center; height: 80vh;">
    <div class="loader hide" :class="{ show: loadingStore.isLoading }">
      {{ loadingStore.message || "Loading..." }}
    </div>
    <section v-if="isLoggedIn" name="post-login">
      <div class="mt-1">
        <button @click.stop="logout">Logout</button>
      </div>
      <div class="mt-1">
        <EVMApp />
      </div>
    </section>
    <section v-else name="pre-login" style="align-items: center">
      <div>
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <h3 style="font-weight: 600; margin-bottom: 0.5rem; font-size: 36px">
            Arcana Auth Linea Demo
          </h3>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">
            <button @click.stop="loadPreset('evm-testnet')">
              Load Linea Dev
            </button>
            <button @click.stop="loadPreset('evm-mainnet')">
              Load Linea Gasless
            </button>

          </div>
        </div>

        <div class="hide mt-1" :class="{ show: appLoaded }"
          style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <span v-if="presetLoaded" style="color:springgreen">{{ presetLoaded }}</span>
        </div>
        <div class="hide mt-1" :class="{ show: appLoaded }"
          style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <button @click.stop="login">Login With Arcana</button>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 1024px;
  margin: 0 auto;
  width: 100%;
}

.loader {
  animation: color-change 1.25s infinite;
}

@keyframes color-change {
  0% {
    color: var(--vt-c-indigo);
  }

  30% {
    color: transparent;
  }

  60% {
    color: var(--vt-c-indigo);
  }
}
</style>
