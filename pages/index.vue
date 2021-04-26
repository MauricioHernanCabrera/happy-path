<template>
  <v-row class="home">
    <v-col cols="12">
      <v-tabs v-model="tab" centered dark icons-and-text>
        <v-tabs-slider></v-tabs-slider>

        <v-tab
          v-for="tabItem in tabs"
          :key="tabItem.name"
          :href="`#${tabItem.value}`"
        >
          {{ tabItem.name }}
          <v-icon>mdi-{{ tabItem.icon }}</v-icon>
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab" class="home__tabs_items">
        <v-tab-item value="tab-paths">
          <v-row>
            <v-col cols="12">
              <v-row>
                <v-col cols="12" class="d-flex align-center">
                  <span class="caption">Caminos</span>

                  <v-spacer></v-spacer>

                  <v-btn
                    @click="
                      addItem(paths, { _id: Date.now(), ...DEFAULT_PATH })
                    "
                  >
                    <v-icon>mdi-plus</v-icon>
                    nuevo camino
                  </v-btn>
                </v-col>
              </v-row>

              <v-row v-if="calculatedPaths.length === 0">
                <v-col cols="12" class="text-center">
                  No hay caminos cargados
                </v-col>
              </v-row>

              <v-row class="home__list" v-else>
                <v-col
                  cols="12"
                  sm="6"
                  md="4"
                  xl="3"
                  v-for="(pathItem, pathIndex) in calculatedPaths"
                  :key="pathIndex"
                >
                  <v-card class="home__path_item">
                    <v-card-text class="pb-0">
                      <v-text-field
                        :label="`Camino ${pathIndex + 1} `"
                        v-model="paths[pathIndex].name"
                      ></v-text-field>

                      <v-text-field
                        label="Valor"
                        type="number"
                        v-model="paths[pathIndex].value"
                      ></v-text-field>

                      <v-select
                        v-for="(commissionItem, commissionIndex) in paths[
                          pathIndex
                        ].commissions"
                        :key="`${pathIndex}_${commissionIndex}`"
                        :items="commissions"
                        :value="commissionItem"
                        :label="`Selecciona comisión ${commissionIndex + 1}`"
                        @input="
                          (value) =>
                            updatePathCommission(
                              value,
                              pathIndex,
                              commissionIndex
                            )
                        "
                        item-text="name"
                        item-value="_id"
                      >
                        <template v-slot:selection="{ item }">
                          ({{ item.value | formatMoney(...moneyConfig) }}%)
                          {{ item.name }}
                        </template>

                        <template v-slot:append>
                          <v-icon
                            left
                            @click="
                              deletePathCommission(pathIndex, commissionIndex)
                            "
                          >
                            mdi-close
                          </v-icon>
                        </template>
                      </v-select>

                      <v-btn @click="addPathCommission(pathIndex)" class="mb-4">
                        <v-icon>mdi-plus</v-icon>
                        nueva comisión
                      </v-btn>
                    </v-card-text>

                    <v-spacer></v-spacer>

                    <v-divider></v-divider>

                    <v-card-text class="pt-0">
                      <v-radio-group
                        v-model="paths[pathIndex].currencySelected"
                      >
                        <template v-slot:label>
                          <div>Moneda</div>
                        </template>

                        <v-radio
                          v-for="currencyItem in currencies"
                          :key="currencyItem._id"
                          :value="currencyItem._id"
                          :label="currencyItem.name"
                        >
                        </v-radio>
                      </v-radio-group>

                      <v-text-field
                        :label="`Total en ${get(
                          pathItem,
                          'currency.name',
                          '-'
                        )}`"
                        :value="pathItem.totalDolar"
                        disabled
                      ></v-text-field>

                      <v-text-field
                        :label="`Comisión total`"
                        disabled
                        :value="pathItem.totalFee"
                      ></v-text-field>

                      <v-text-field
                        :label="`Porcentaje de comision`"
                        disabled
                        :value="`${pathItem.percentageFee}%`"
                      ></v-text-field>

                      <v-text-field
                        disabled
                        :label="`Valor del ${get(
                          pathItem,
                          'currency.name',
                          '-'
                        )}`"
                        :value="get(pathItem, 'currency.price', '-')"
                      ></v-text-field>

                      <v-text-field
                        label="Total ARS"
                        readonly
                        :value="pathItem.totalArs"
                      ></v-text-field>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-text>
                      <v-btn @click="deleteItem(paths, paths[pathIndex]._id)">
                        eliminar
                      </v-btn>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-tab-item>

        <v-tab-item value="tab-commissions">
          <v-row>
            <v-col cols="12" class="d-flex align-center">
              <span class="caption">Comisiones</span>

              <v-spacer></v-spacer>

              <v-btn
                @click="
                  addItem(commissions, {
                    _id: Date.now(),
                    ...DEFAULT_COMMISSION,
                  })
                "
              >
                <v-icon>mdi-plus</v-icon>
                nueva comisión
              </v-btn>
            </v-col>

            <v-col
              cols="12"
              v-if="commissions.length === 0"
              class="text-center"
            >
              No hay comisiones cargadas
            </v-col>

            <v-col v-else cols="12">
              <v-row class="home__list">
                <v-col
                  cols="12"
                  sm="6"
                  md="4"
                  lg="3"
                  xl="2"
                  v-for="commissionItem in commissions"
                  :key="commissionItem._id"
                >
                  <v-card>
                    <v-card-text>
                      <v-text-field
                        label="Nombre"
                        v-model="commissionItem.name"
                      ></v-text-field>

                      <v-text-field
                        label="Porcentaje"
                        type="number"
                        v-model.number="commissionItem.value"
                      ></v-text-field>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-text>
                      <v-btn
                        @click="deleteItem(commissions, commissionItem._id)"
                      >
                        eliminar
                      </v-btn>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-tab-item>

        <v-tab-item value="tab-currencies">
          <v-row>
            <v-col cols="12" class="d-flex align-center">
              <span class="caption">Monedas</span>

              <v-spacer></v-spacer>

              <v-btn
                @click="
                  addItem(currencies, { _id: Date.now(), ...DEFAULT_CURRENCY })
                "
              >
                <v-icon>mdi-plus</v-icon>
                nueva moneda
              </v-btn>
            </v-col>

            <v-col cols="12" v-if="currencies.length === 0" class="text-center">
              No hay monedas cargadas
            </v-col>

            <v-col v-else cols="12">
              <v-row class="home__list">
                <v-col
                  cols="12"
                  sm="6"
                  md="4"
                  lg="3"
                  xl="2"
                  v-for="currencyItem in currencies"
                  :key="currencyItem._id"
                >
                  <v-card>
                    <v-card-text>
                      <v-text-field
                        label="Nombre"
                        v-model="currencyItem.name"
                      ></v-text-field>

                      <v-text-field
                        label="Valor"
                        type="number"
                        v-model.number="currencyItem.price"
                      ></v-text-field>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-text>
                      <v-btn @click="deleteItem(currencies, currencyItem._id)">
                        eliminar
                      </v-btn>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-tab-item>

        <v-tab-item value="tab-pre-assembled-path">
          <v-row>
            <v-col cols="12" class="d-flex align-center">
              <span class="caption">Caminos pre armados</span>
            </v-col>

            <v-col
              cols="12"
              v-if="preAssembledPaths.length === 0"
              class="text-center"
            >
              No hay caminos pre armados
            </v-col>

            <v-col v-else cols="12">
              <v-row class="home__list">
                <v-col
                  cols="12"
                  sm="6"
                  md="4"
                  lg="3"
                  v-for="(
                    preAssembledPathItem, preAssembledPathIndex
                  ) in preAssembledPaths"
                  :key="preAssembledPathItem._id"
                >
                  <v-card>
                    <v-card-text>
                      <v-text-field
                        label="Nombre"
                        readonly
                        :value="
                          preAssembledPathsMap[
                            preAssembledPathIndex
                          ].commissions
                            .map((commissionItem) => commissionItem.name)
                            .join(' > ')
                        "
                      ></v-text-field>

                      <v-text-field
                        label="Comisiones"
                        disabled
                        :value="
                          preAssembledPathsMap[
                            preAssembledPathIndex
                          ].commissions
                            .map(
                              (commissionItem) =>
                                `${formatMoney(commissionItem.value)}%`
                            )
                            .join(' > ')
                        "
                      ></v-text-field>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-text>
                      <v-btn
                        @click="
                          addItem(paths, {
                            ...preAssembledPathItem,
                            _id: Date.now(),
                          })
                        "
                      >
                        Usar camino
                      </v-btn>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-tab-item>

        <v-tab-item value="tab-global-config">
          <v-row>
            <v-col cols="12" class="d-flex align-center">
              <span class="caption">Global</span>
            </v-col>

            <v-col cols="12">
              <v-row>
                <v-col cols="12" sm="6" md="4" lg="3" xl="2">
                  <v-card>
                    <v-card-text>
                      <v-text-field
                        label="Valor"
                        type="number"
                        v-model.number="config.value"
                        @input="updatePathsValues"
                      ></v-text-field>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
    </v-col>
  </v-row>
</template>

<script>
import formatMoney from "format-money2";
import { get } from "lodash";

import modalFormUtilsMixin from "@/mixins/modal-form-utils";

export default {
  name: "Home",

  mixins: [modalFormUtilsMixin],

  data() {
    return {
      tabs: [
        {
          value: "tab-paths",
          name: "Caminos",
          icon: "highway",
        },
        {
          value: "tab-commissions",
          name: "Comisiones",
          icon: "thumb-down-outline",
        },
        {
          value: "tab-currencies",
          name: "Monedas",
          icon: "cash-multiple",
        },
        {
          value: "tab-pre-assembled-path",
          name: "Pre armados",
          icon: "shape-outline",
        },
        {
          value: "tab-global-config",
          name: "Configuración global",
          icon: "cog",
        },
      ],

      tab: "tab-",

      config: {
        value: 0,
        showConfig: false,
        showCommissions: false,
        showCurrencies: false,
        showPreAssembledPaths: false,
      },

      currencies: [
        { price: 161.5, name: "USDT", _id: "currency_1" },
        { price: 148.0, name: "USD", _id: "currency_2" },
      ],

      commissions: [
        { value: 1.73, name: "Recibir en Wise", _id: "commission_1" },
        { value: 1.39, name: "Recibir en Binance", _id: "commission_2" },
        { value: 3, name: "Recibir en Payoneer", _id: "commission_3" },
        { value: 2, name: "Binance a dolar fisico", _id: "commission_4" },
        { value: 4, name: "Wise a dolar fisico", _id: "commission_5" },
        { value: 5, name: "Payoneer a dolar fisico", _id: "commission_6" },
        { value: 6, name: "Payoneer a binance", _id: "commission_7" },
      ],

      modalCommission: {
        data: {},
        active: false,
        isLoading: false,
      },

      DEFAULT_PATH: {
        commissions: [{ value: 0, name: null, _id: 1 }],
        value: 0,
        currencySelected: "currency_1",
        name: null,
      },

      DEFAULT_COMMISSION: {
        value: 0,
        name: null,
      },

      DEFAULT_CURRENCY: {
        price: 0,
        name: null,
      },

      moneyConfig: [2, ",", "."],

      preAssembledPaths: [
        {
          commissions: ["commission_1", "commission_2"],
          value: 0,
          name: "WISE>BINANCE>ARS",
          currencySelected: "currency_1",
          _id: "path_1",
        },
        {
          commissions: ["commission_1", "commission_5"],
          value: 0,
          name: "WISE>DOLAR_FISICO>ARS",
          currencySelected: "currency_2",
          _id: "path_2",
        },
        {
          commissions: ["commission_1", "commission_2", "commission_4"],
          value: 0,
          name: "WISE>BINANCE>DOLAR_FISICO>ARS",
          currencySelected: "currency_2",
          _id: "path_3",
        },
        {
          commissions: ["commission_3", "commission_5"],
          value: 0,
          name: "PAYONEER>DOLAR_FISICO>ARS",
          currencySelected: "currency_2",
          _id: "path_4",
        },
        {
          commissions: ["commission_3", "commission_7", "commission_4"],
          value: 0,
          name: "PAYONEER>BINANCE>DOLAR_FISICO>ARS",
          currencySelected: "currency_2",
          _id: "path_5",
        },
      ],

      paths: [
        {
          commissions: ["commission_1", "commission_2"],
          value: 0,
          name: "WISE>BINANCE>ARS",
          currencySelected: "currency_1",
          _id: "path_1",
        },
        {
          commissions: ["commission_1", "commission_2", "commission_4"],
          value: 0,
          name: "WISE>BINANCE>DOLAR_FISICO>ARS",
          currencySelected: "currency_2",
          _id: "path_2",
        },
        {
          commissions: ["commission_1", "commission_5"],
          value: 0,
          name: "WISE>DOLAR_FISICO>ARS",
          currencySelected: "currency_2",
          _id: "path_3",
        },
        {
          commissions: ["commission_3", "commission_5"],
          value: 0,
          name: "PAYONEER>DOLAR_FISICO>ARS",
          currencySelected: "currency_2",
          _id: "path_4",
        },
        {
          commissions: ["commission_3", "commission_7", "commission_4"],
          value: 0,
          name: "PAYONEER>BINANCE>DOLAR_FISICO>ARS",
          currencySelected: "currency_2",
          _id: "path_5",
        },
      ],
    };
  },

  computed: {
    preAssembledPathsMap() {
      return this.preAssembledPaths.map((preAssembledPathItem) => {
        const commissions = preAssembledPathItem.commissions
          .map((commissionItem) => this.find(this.commissions, commissionItem))
          .filter((commissionItem) => commissionItem && commissionItem._id);

        return {
          ...preAssembledPathItem,
          commissions,
        };
      });
    },

    calculatedPaths() {
      const clonePaths = JSON.parse(JSON.stringify(this.paths));

      return clonePaths.map((pathItem) => {
        pathItem.currency =
          this.find(this.currencies, pathItem.currencySelected) || 0;

        pathItem.commissions = pathItem.commissions
          .map((commissionItem) => this.find(this.commissions, commissionItem))
          .filter((commissionItem) => commissionItem && commissionItem._id);

        return {
          ...pathItem,
          totalDolar: this.formatMoney(this.totalDolar(pathItem), ...this.moneyConfig), // prettier-ignore
          totalFee: this.formatMoney(this.totalFee(pathItem), ...this.moneyConfig), // prettier-ignore
          percentageFee: this.formatMoney(this.percentageFee(pathItem), ...this.moneyConfig), // prettier-ignore
          totalArs: this.formatMoney(this.totalArs(pathItem), ...this.moneyConfig), // prettier-ignore
        };
      });
    },
  },

  methods: {
    formatMoney,

    get,

    totalDolar({ commissions, value = 0 }) {
      return commissions.reduce((ant, comissionItem) => {
        if (comissionItem && comissionItem.value) {
          const resultCommission = parseFloat(
            (parseFloat(ant).toFixed(2) *
              parseFloat(comissionItem.value).toFixed(2)) /
              100
          ).toFixed(2);

          return parseFloat(ant - resultCommission).toFixed(2);
        }

        return parseFloat(ant).toFixed(2);
      }, value);
    },

    totalArs(pathItem) {
      return (
        this.totalDolar(pathItem) *
        parseFloat(get(pathItem, "currency.price", 0))
      ).toFixed(2);
    },

    totalFee(pathItem) {
      return (pathItem.value - this.totalDolar(pathItem)).toFixed(2);
    },

    percentageFee(pathItem) {
      return ((this.totalFee(pathItem) * 100) / pathItem.value).toFixed(2);
    },

    updatePathsValues(value) {
      if (!value) {
        return;
      }

      this.paths.forEach((pathItem) => {
        pathItem.value = value;
      });
    },

    deletePathCommission(pathIndex, commissionIndex) {
      this.paths[pathIndex].commissions.splice(commissionIndex, 1);
    },

    updatePathCommission(value, pathIndex, commissionIndex) {
      const commissions = JSON.parse(
        JSON.stringify(this.paths[pathIndex].commissions)
      );

      commissions[commissionIndex] = value;
      this.paths[pathIndex].commissions = commissions;
    },

    addPathCommission(pathIndex) {
      this.paths[pathIndex].commissions.push(null);
    },
  },

  filters: {
    formatMoney,
  },
};
</script>


<style lang="scss" scoped>
.home__list {
  flex-wrap: nowrap;
  overflow-x: auto;
}

.home__path_item {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.home__tabs_items {
  background-color: transparent !important;
  padding: 24px;
}
</style>