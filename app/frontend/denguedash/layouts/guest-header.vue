<template>
  <div>
    <header class="bg-blue-800 text-white">
      <nav
        class="container w-5/6 mx-auto flex items-center justify-between py-6"
      >
        <NuxtLink to="/" class="text-2xl font-bold">DengueDash</NuxtLink>
        <ul class="flex space-x-6">
          <li>
            <NuxtLink to="/" class="hover:underline">Dashboard</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/" class="hover:underline">Login</NuxtLink>
          </li>
        </ul>
      </nav>
    </header>

    <div>
      <slot />
    </div>
  </div>
</template>
