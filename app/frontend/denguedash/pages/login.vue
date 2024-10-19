<template>
  <div class="mt-10 flex items-center justify-center">
    <div class="p-8 border border-gray-200 rounded-lg w-full max-w-md">
      <div class="text-center">
        <div class="text-3xl font-semibold text-black">Welcome back!</div>
      </div>

      <form @submit.prevent="handleSubmit" class="mt-6 space-y-7">
        <div>
          <label class="block text-black text-sm mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            class="w-full px-4 py-2 border border-gray rounded-md text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label class="block text-black text-sm mb-1">Password</label>
          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              class="w-full px-4 py-2 border border-gray rounded-md text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter your password"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-3 text-gray-400"
              @click="showPassword = !showPassword"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <path
                  v-if="showPassword"
                  fill="currentColor"
                  d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5"
                />
                <path
                  v-else
                  fill="currentColor"
                  d="M11.83 9L15 12.16V12a3 3 0 0 0-3-3zm-4.3.8l1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28l.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5c1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22L21 20.73L3.27 3M12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93c1.5-1.25 2.7-2.89 3.43-4.75c-1.73-4.39-6-7.5-11-7.5c-1.4 0-2.74.25-4 .7l2.17 2.15C10.74 7.13 11.35 7 12 7"
                />
              </svg>
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <label class="flex items-center space-x-2">
            <input
              type="checkbox"
              class="form-checkbox text-green-400 rounded focus:ring-green-400"
            />
            <span class="text-sm text-gray-400">Remember me</span>
          </label>
          <a href="#" class="text-sm text-green-400 hover:underline"
            >Forgot password?</a
          >
        </div>

        <div v-if="errorMessage" class="bg-red-500 text-white py-4 rounded-md">
          <div class="flex flex-row ml-2">
            <Icon
              name="ph:info-fill"
              class="mr-3 text-2xl"
              style="color: white"
            />
            <p>{{ errorMessage }}</p>
          </div>
        </div>

        <button
          type="submit"
          class="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
        >
          Continue
        </button>
      </form>
    </div>
  </div>
</template>

<script>
definePageMeta({
  layout: "guest-header",
});
export default {
  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
      errorMessage: "",
    };
  },
  methods: {
    handleSubmit() {
      if (!this.email || !this.password) {
        this.errorMessage = "Error signing in";
        return;
      }
      // Add your sign-in logic here
      this.errorMessage = "";
      alert("Signed in successfully!");
    },
  },
};
</script>

<style scoped></style>
