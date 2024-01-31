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
          :class="{ 'is-error': inputErrors[lang] }"
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
        <form-button 
          @click="validateStep_1"
          >Next</form-button>
      </div>

      <!-- STEP 2  -->

      <div v-show="step === 2" class="form__step-2">
        <h2>Price settings</h2>
        <el-form-item
          class="form__item"
          label="Price Amount"
          v-for="currency in selectedCurrencies"
          :key="currency"
          :class="{ 'is-error': inputErrors[currency] }"
          
          >
          <el-form-item>
            <div class="form__price-amount-input-list">
              <el-input
                class="form__price-amount-input"
                placeholder="0.00"
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
        </el-form-item>
        <form-button class="form__back-btn" @click="backFormStep"><el-icon><ArrowLeftBold /></el-icon>Back</form-button>
        <form-button class="form__submit-btn" @click="validateStep_2">Submit</form-button>
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
      inputErrors: {}, // Объект для хранения ошибок
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
    updateProductName(lang, value) {
      const productNames = { ...this.productNames };
      productNames[lang] = value;
      this.setProductNames(productNames);
    },
    getProductPrices(currency) {
      return this.productPrices[currency]
    },
    updateProductPrices(currency, value) {
      const ProductPrices = { ...this.productPrices };
      ProductPrices[currency] = value;
      this.setProductPrices(ProductPrices);
    },

    //------------------------------------------ VALIDATION ----------------------------------------------


    validateStep_1() {
      this.inputErrors = {} // Сброс ошибок перед проверкой при каждом нажатии Next
      // Проверка, заполнены ли все названия товара
      this.selectedLanguages.forEach(lang => {
        if (!this.productNames[lang]) {
          this.inputErrors = {...this.inputErrors, [lang]: true} // Устанавливаем ошибку для соответствующего инпута
        }
      })
      // Запускает переход на следующий шаг, если в inputErrors на каждый input стоит false
      if (Object.values(this.inputErrors).every(error => !error)) {
        this.nextFormStep()
      }
    },

    validateStep_2() {
      this.inputErrors = {}
      this.selectedCurrencies.forEach(currency => {
        if (!this.productPrices[currency]) {
          this.inputErrors = {...this.inputErrors, [currency]: true}
        }
      })

      if (Object.values(this.inputErrors).every(error => !error)) {
        this.submitOutput()
      }
    }
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

    isRequiredFilled() {
      return (
        Object.values(this.productNames).every(name => name.trim())
      );
    },
  },
}
</script>

<style>
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
:root {
  --el-font-size-base: 20px
}

.form__item {
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
}
.form__product-name-input-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 500px;
}
.form__price-amount-input-list {
  display: flex;
}
.form__item_bordered-bottom {
  padding-bottom: 60px; border-bottom: 1px solid lightgray;
}
.form__multiselect {
  width: 500px;
}
.form__price-amount-input {
  padding: 10px 0;
}
.form__price-amount-input-list {
  display: flex;
  flex-direction: column;
  width: 150px;
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

/* Выключаю кнопку крестик из первого элемента в мультиселектах */

.el-select__tags > .el-select-tags-wrapper > .el-tag:nth-child(1) > .el-tag__close {
  display: none;
}

.is-error-price-input {
  box-shadow: 0 0 0 1px var(--el-color-danger) inset;;
}

</style>