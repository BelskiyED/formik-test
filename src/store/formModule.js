export const formModule = {

    state: () => ({
        currencies: [],
        languages: [],
        step: 1,
        output: {
            isSale: false,
            selectedLanguages: [],
            selectedCurrencies: [],
            productNames: [],
            productPrices: [],
        },
        urls: [
        'https://raw.githubusercontent.com/maxmarinich/api/master/formik/languages.json',
        'https://raw.githubusercontent.com/maxmarinich/api/master/formik/currencies.json',
        ],
    
    }),

    getters: {
      getLanguageNameById(state) {
        return(languageId) => {
          const language = state.languages.find(lng => lng.id === languageId)
          return language ? language.name : ''
        }
      },
    },

    mutations: {
      setCurrencies(state, currencies) {
          state.currencies = currencies
      },
      setLanguages(state, languages) {
          state.languages = languages
      },
      setStep(state, step) {
          state.step = step
      },
      setIsSale(state, isSale) {
        state.output.isSale = isSale;
      },
      setSelectedLanguages(state, selectedLanguages) {
        state.output.selectedLanguages = selectedLanguages
      },
      setSelectedCurrencies(state, selectedCurrencies) {
        state.output.selectedCurrencies = selectedCurrencies
      },
      setProductNames(state, productNames) {
        state.output.productNames = productNames
      },
      setProductPrices(state, productPrices) {
        state.output.productPrices = productPrices
      },
    },

    actions: {
      fetchUrls({state, commit}) {
        Promise.all(state.urls.map(url => fetch(url)))
          .then(responses => Promise.all(responses.map(response => response.json())))
          .then(data => {
            commit('setLanguages', data[0])
            commit('setCurrencies', data[1])
            console.log('ЗАГРУЖЕННЫЕ ЯЗЫКИ:', state.languages)
            console.log('ЗАГРУЖЕННЫЕ ВАЛЮТЫ:', state.currencies)
            const primaryLanguage = state.languages.find(item => item.primary === true)
              if (primaryLanguage) {
                commit('setSelectedLanguages', [primaryLanguage.id])
                console.log('ВЫБРАННЫЕ ЯЗЫКИ:', state.output.selectedLanguages)
              }
            const primaryCurrency = state.currencies.find(item => item.primary === true)
              if (primaryCurrency) {
                commit('setSelectedCurrencies', [primaryCurrency.id])
                console.log('ВЫБРАННЫЕ ВАЛЮТЫ:', state.output.selectedCurrencies)
              }
          })
          .catch(error => {
            console.error('Failed fetching urls:', error)
          });
      },
      nextFormStep({ commit, state }) {
        commit('setStep', state.step + 1);
      },
      backFormStep({ commit, state }) {
        commit('setStep', state.step - 1);
      },
      submitOutput({ state }) {
        console.table(state.output)
      },
    },
    namespaced: true

   
}