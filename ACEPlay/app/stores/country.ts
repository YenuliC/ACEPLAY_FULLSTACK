import { defineStore } from 'pinia'

export const useCountryStore = defineStore('country', {
  state: () => ({
    selectedCountry: 'thailand'
  })
})