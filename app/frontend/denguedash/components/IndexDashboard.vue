<template>
  <!-- <div class="w-1/2 p-3">
    <div class="border-grey border-2 rounded-lg">
      <div class="p-4">
        <h1 class="text-xl font-bold">Number of Dengue Cases in Iloilo City</h1>
        <p class="text-sm text-gray-600">As of October 19, 2024</p>
      </div>
      <div class="flex justify-center items-center"></div>
      <ChoroplethMap />
    </div>
  </div> -->

  <div class="p-6 min-h-screen">
    <div class="w-5/6 mx-auto">
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Choropleth Map -->
        <div class="border-grey border-2 rounded-lg flex-1">
          <div class="p-4">
            <h1 class="text-xl font-bold">
              Number of Dengue Cases in Iloilo City
            </h1>
            <p class="text-sm text-gray-600">As of October 19, 2024</p>
          </div>
          <ChoroplethMap />
        </div>
        <!-- Right Side -->
        <div class="bg-white shadow-lg rounded-lg lg:w-96 flex-1">
          <div class="p-6">
            <h2 class="text-2xl font-bold">
              322,343 <span class="text-red-500">+63,728</span>
            </h2>
            <p class="text-gray-600">Reported COVI</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
