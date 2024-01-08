<template>
  <div>
    <el-form prevent class="form">
      <div v-show="step === 1" class="form__step-1">
        <h2>Product Settings</h2>
        <el-form-item class="form__item" label="Sale%">
          <el-switch
            :model-value="isSale"
            @update:model-value="setIsSale"
            active-text="On"
            inactive-text="Off"/>
        </el-form-item>
        <h2>Prime currency</h2>
        <el-form-item class="form__item form__item_bordered-bottom" label="Currency">
          <el-select
            class="form__multiselect"
            :model-value="selectedCurrencies"
            @update:model-value="setSelectedCurrencies"
            multiple
            size="large"
            >
            <el-option
              v-for="currency in currencies"
              :key="currency.id"
              :label="currency.name"
              :value="currency.id"
              :selected="currency.primary"
              />
          </el-select>
        </el-form-item>
        <h2 style="padding-top: 20px;">Product name</h2>
        <el-form-item class="form__item" label="Language">
          <el-select
            class="form__multiselect"
            :model-value="selectedLanguages"
            @update:model-value="setSelectedLanguages"
            multiple
            size="large"
            >
            <el-option
              v-for="language in languages"
              :key="language.id"
              :label="language.name"
              :value="language.id"
              :selected="language.primary"
              />
          </el-select>
        </el-form-item>
        <el-form-item
          class="form__product-name-input-list"
          v-for="lang in selectedLanguages"
          :key="lang"
          size="large"
          :prop="`productNames.${lang}`"
          >
            <div  class="form__product-name-input-item">
              <h3>{{ getLanguageNameById(lang) }}</h3>
              <el-input
                class="form__product-name-input"
                placeholder="Create product name"
                :model-value="getProductName(lang)"
                @update:model-value="updateProductName(lang, $event)"
              />
            </div>
        </el-form-item>
        <form-button @click="nextFormStep">Next</form-button>
      </div>

      <!-- STEP 2  -->

      <div v-show="step === 2" class="form__step-2">
        <h2>Price settings</h2>
        <el-form-item
          class="form__item"
          label="Price Amount"
          >
          <div class="form__price-amount-input-list"
            >
            <el-input
              class="form__price-amount-input"
              placeholder="0.00"
              v-for="currency in selectedCurrencies"
              :key="currency"
              :model-value="getProductPrices(currency)"
              @update:model-value="updateProductPrices(currency, $event)"
              size="large"
              :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '\.')"
              :parser="(value) => value.replace(/$\s?|(\.*)/g, '')"
              >
              <template class="currency-indicator" #append>{{ currency }}</template>
            </el-input>
          </div>
        </el-form-item>
        <form-button class="form__back-btn" @click="backFormStep"><el-icon><ArrowLeftBold /></el-icon>Back</form-button>
        <form-button class="form__submit-btn" @click="submitOutput">Submit</form-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import FormButton from '@/components/UI/FormButton.vue';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
export default {
  data() {
    return {
      
    }
  },
  
  methods: {
    ...mapMutations({
      setCurrencies: 'form/setCurrencies',
      setLanguages: 'form/setLanguages',
      setStep: 'form/setStep',
      setIsSale: 'form/setIsSale',
      setOutput: 'form/setOutput',
      setSelectedLanguages: 'form/setSelectedLanguages',
      setSelectedCurrencies: 'form/setSelectedCurrencies',
      setProductNames: 'form/setProductNames',
      setProductPrices: 'form/setProductPrices',
    }),
    ...mapActions({
      fetchUrls: 'form/fetchUrls',
      nextFormStep: 'form/nextFormStep',
      backFormStep: 'form/backFormStep',
      submitOutput: 'form/submitOutput',
    }),
    
    getProductName(lang) {
      return this.productNames[lang];
    },
    getProductPrices(currency) {
      return this.productPrices[currency]
    },
    updateProductPrices(currency, value) {
      const ProductPrices = { ...this.productPrices };
      ProductPrices[currency] = value;
      this.setProductPrices(ProductPrices);
    },
    updateProductName(lang, value) {
      const productNames = { ...this.productNames };
      productNames[lang] = value;
      this.setProductNames(productNames);
    },
  },

  mounted() {
    this.fetchUrls()
  },
  
  computed: {

    ...mapState({
      currencies: state => state.form.currencies,
      languages: state => state.form.languages,
      step: state => state.form.step,
      output: state => state.form.output,
      isSale: state => state.form.output.isSale,
      selectedLanguages: state => state.form.output.selectedLanguages,
      selectedCurrencies: state => state.form.output.selectedCurrencies,
      productNames: state => state.form.output.productNames,
      productPrices: state => state.form.output.productPrices,
      urls: state => state.form.urls,
    }),

    ...mapGetters({
      getLanguageNameById: 'form/getLanguageNameById',
    }),
  },
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.form {
  padding: 20px;
  width: 80%;
  min-width: 500px;
  margin: 0 auto;
}
.el-form-item__content {
  flex-direction: column;
}
:root {
  --el-font-size-base: 20px
}

.form__item {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.form__product-name-input-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.form__item_bordered-bottom {
  padding-bottom: 60px; border-bottom: 1px solid lightgray;
}
.form__multiselect {
  width: 500px;
}
.form__product-name-input {
  width: 500px;
}
.form__price-amount-input {
  padding: 10px 0;
  width: 150px;
}
.form__price-amount-input-list {
  display: flex;
  flex-direction: column;
}
.form__back-btn {
  background: none;
  color: rgb(21,158,142);
  border: solid 2px rgb(21,158,142);
}
.form__back-btn, .form__submit-btn {
  width: 120px;
}
.currency-indicator {
  background: none;
  border: none;
}

.el-input-group__append, .el-input-group__prepend {
  min-width: 10px;
}
</style>