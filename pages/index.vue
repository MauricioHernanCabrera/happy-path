<template>
  <v-row>
    <v-col cols="12">
      <v-btn @click="addItem">
        <v-icon>mdi-plus</v-icon>
        nuevo
      </v-btn>
    </v-col>

    <v-col
      cols="12"
      sm="6"
      md="4"
      xl="3"
      v-for="(pathItem, pathIndex) in paths"
      :key="pathIndex"
    >
      <v-card>
        <v-card-title class="headline">
          <v-text-field
            :label="`Camino ${pathIndex + 1} `"
            v-model="pathItem.name"
          ></v-text-field>

          <v-btn
            v-if="paths.length > 1"
            @click="removeItem(pathIndex)"
            class="mb-4 ml-3"
          >
            eliminar
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-text-field
            label="Valor"
            type="number"
            v-model="pathItem.value"
          ></v-text-field>

          <v-text-field
            :label="`Comisión ${commissionIndex + 1}`"
            type="number"
            v-for="(commission, commissionIndex) in pathItem.commissions"
            :key="commissionIndex"
            v-model="commission.value"
            min="0"
            :append-icon="pathItem.commissions.length > 1 ? 'mdi-close' : ''"
            @click:append="removeCommision(pathIndex, commissionIndex)"
          ></v-text-field>

          <v-btn @click="addCommision(pathIndex)" class="mb-4">
            <v-icon>mdi-plus</v-icon>
            nuevo
          </v-btn>

          <v-radio-group v-model="pathItem.money">
            <template v-slot:label>
              <div>Moneda</div>
            </template>

            <v-radio value="USDT" label="USDT"> </v-radio>

            <v-radio value="USD" label="USD"> </v-radio>
          </v-radio-group>

          <v-text-field
            :label="`Total en ${pathItem.money}`"
            disabled
            :value="get(calculatedPaths, `${pathIndex}.totalDolar`, '-')"
          ></v-text-field>

          <v-text-field
            :label="`Comisión total`"
            disabled
            :value="get(calculatedPaths, `${pathIndex}.totalFee`, '-')"
          ></v-text-field>

          <v-text-field
            :label="`Porcentaje de comision`"
            disabled
            :value="`${get(
              calculatedPaths,
              `${pathIndex}.percentageFee`,
              '0'
            )}%`"
          ></v-text-field>

          <v-text-field
            :label="`Valor del ${pathItem.money}`"
            type="number"
            v-model="pathItem.dolarPrice"
          ></v-text-field>

          <v-text-field
            label="Total ARS"
            readonly
            :value="get(calculatedPaths, `${pathIndex}.totalArs`, '-')"
          ></v-text-field>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import formatMoney from "format-money2";
import { get } from "lodash";

export default {
  data() {
    return {
      radios: "Duckduckgo",
      moneyConfig: [2, ",", "."],
      paths: [
        {
          commissions: [{ value: "1.73" }, { value: "2.62" }],
          value: "400",
          dolarPrice: "162.08",
          name: "WISE>BINANCE>ARS",
          money: "USDT",
        },
        {
          commissions: [{ value: "1.73" }, { value: "2.62" }, { value: "2" }],
          value: "400",
          dolarPrice: "146",
          name: "WISE>BINANCE>DOLAR_FISICO>ARS",
          money: "USDT",
        },
        {
          commissions: [{ value: "3" }, { value: "5" }],
          value: "400",
          dolarPrice: "146",
          name: "PAYONEER>DOLAR_FISICO>ARS",
          money: "USDT",
        },
        {
          commissions: [{ value: "3" }, { value: "6" }, { value: "2" }],
          value: "400",
          dolarPrice: "146",
          name: "PAYONEER>BINANCE>DOLAR_FISICO>ARS",
          money: "USDT",
        },
      ],
    };
  },

  computed: {
    calculatedPaths() {
      return this.paths.map((pathItem) => ({
        ...pathItem,
        totalDolar: this.formatMoney(
          this.totalDolar(pathItem),
          ...this.moneyConfig
        ),
        totalFee: this.formatMoney(
          this.totalFee(pathItem),
          ...this.moneyConfig
        ),
        percentageFee: this.formatMoney(
          this.percentageFee(pathItem),
          ...this.moneyConfig
        ),
        totalArs: this.formatMoney(
          this.totalArs(pathItem),
          ...this.moneyConfig
        ),
      }));
    },
  },

  methods: {
    formatMoney,

    get,

    addCommision(pathIndex) {
      this.paths[pathIndex].commissions.push({ value: 0 });
    },

    removeCommision(pathIndex, commisionIndex) {
      if (this.paths[pathIndex].commissions.length > 1) {
        this.paths[pathIndex].commissions.splice(commisionIndex, 1);
      }
    },

    totalDolar({ commissions, value = 0 }) {
      return commissions.reduce((ant, comissionItem) => {
        const resultCommision = parseFloat(
          (parseFloat(ant).toFixed(2) *
            parseFloat(comissionItem.value).toFixed(2)) /
            100
        ).toFixed(2);
        return parseFloat(ant - resultCommision).toFixed(2);
      }, value);
    },

    totalArs(pathItem) {
      return (this.totalDolar(pathItem) * pathItem.dolarPrice).toFixed(2);
    },

    totalFee(pathItem) {
      return (pathItem.value - this.totalDolar(pathItem)).toFixed(2);
    },

    percentageFee(pathItem) {
      return ((this.totalFee(pathItem) * 100) / pathItem.value).toFixed(2);
    },

    addItem() {
      this.paths.push({
        commissions: [{ value: 0 }],
        value: 0,
        dolarPrice: 0,
      });
    },

    removeItem(index) {
      if (this.paths.length > 1) {
        this.paths.splice(index, 1);
      }
    },
  },
};
</script>
