<template>
  <v-row class="home">
    <v-col cols="12">
      <v-row>
        <v-col cols="12">
          <v-btn @click="showConfig = !showConfig">
            <v-icon left> mdi-cog </v-icon>
            Configuración
          </v-btn>
        </v-col>

        <template v-if="showConfig">
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
                <v-btn
                  v-if="currencies.length > 1"
                  @click="deleteItem(currencies, currencyItem._id)"
                >
                  eliminar
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" class="d-flex align-center">
            <span class="caption">Caminos pre armados</span>
          </v-col>

          <v-col
            cols="12"
            sm="6"
            md="4"
            lg="3"
            v-for="preAssembledPathItem in preAssembledPaths"
            :key="preAssembledPathItem._id"
          >
            <v-card>
              <v-card-text>
                <v-text-field
                  label="Nombre"
                  disabled
                  :value="preAssembledPathItem.name"
                ></v-text-field>

                <v-text-field
                  label="Comisiones"
                  disabled
                  :value="
                    preAssembledPathItem.commissions
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
                    addItem(paths, { ...preAssembledPathItem, _id: Date.now() })
                  "
                >
                  Usar camino
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-divider></v-divider>
          </v-col>
        </template>
      </v-row>

      <v-row>
        <v-col cols="12" class="d-flex align-center">
          <span class="caption">Caminos</span>

          <v-spacer></v-spacer>

          <v-btn @click="addItem(paths, { _id: Date.now(), ...DEFAULT_PATH })">
            <v-icon>mdi-plus</v-icon>
            nuevo camino
          </v-btn>
        </v-col>
      </v-row>

      <v-row class="home__paths">
        <v-col
          cols="12"
          sm="6"
          md="4"
          xl="3"
          v-for="(pathItem, pathIndex) in paths"
          :key="pathIndex"
        >
          <v-card>
            <v-card-text>
              <v-text-field
                :label="`Camino ${pathIndex + 1} `"
                v-model="pathItem.name"
              ></v-text-field>

              <v-text-field
                label="Valor"
                type="number"
                v-model="pathItem.value"
              ></v-text-field>

              <v-text-field
                v-for="(
                  commissionItem, commissionIndex
                ) in pathItem.commissions"
                v-model="commissionItem.value"
                :label="`Comisión: ${
                  commissionItem.name
                    ? commissionItem.name
                    : commissionIndex + 1
                }`"
                :key="commissionIndex"
                type="number"
                min="0"
              >
                <template v-slot:append>
                  <v-icon
                    left
                    @click="
                      setModal(modalCommission, {
                        data: {
                          name: commissionItem.name,
                          value: commissionItem.value,
                          _id: commissionItem._id,
                          pathIndex,
                          commissionIndex,
                        },
                      })
                    "
                  >
                    mdi-pencil
                  </v-icon>

                  <v-icon
                    left
                    v-if="pathItem.commissions.length > 1"
                    @click="
                      deleteItem(
                        paths[pathIndex].commissions,
                        commissionItem._id
                      )
                    "
                  >
                    mdi-close
                  </v-icon>
                </template>
              </v-text-field>

              <v-btn
                @click="
                  setModal(modalCommission, {
                    data: { ...DEFAULT_COMMISSION, pathIndex },
                  })
                "
                class="mb-4"
              >
                <v-icon>mdi-plus</v-icon>
                nueva comisión
              </v-btn>

              <v-radio-group v-model="pathItem.currencySelected">
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
                  calculatedPaths,
                  `${pathIndex}.currency.name`,
                  '-'
                )}`"
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
                disabled
                :label="`Valor del ${get(
                  calculatedPaths,
                  `${pathIndex}.currency.name`,
                  '-'
                )}`"
                :value="
                  get(calculatedPaths, `${pathIndex}.currency.price`, '-')
                "
              ></v-text-field>

              <v-text-field
                label="Total ARS"
                readonly
                :value="get(calculatedPaths, `${pathIndex}.totalArs`, '-')"
              ></v-text-field>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-text>
              <v-btn
                v-if="paths.length > 1"
                @click="deleteItem(paths, pathItem._id)"
              >
                eliminar
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>

    <ModalFormCommission
      :active="modalCommission.active"
      :data="modalCommission.data"
      :isLoading="modalCommission.isLoading"
      @close="closeModal(modalCommission)"
      @submit="submitCommission"
    />
  </v-row>
</template>

<script>
import formatMoney from "format-money2";
import { get } from "lodash";
import ModalFormCommission from "@/components/Shared/ModalFormCommission";
import modalFormUtilsMixin from "@/mixins/modal-form-utils";

export default {
  mixins: [modalFormUtilsMixin],

  components: {
    ModalFormCommission,
  },

  data() {
    return {
      showConfig: true,

      currencies: [
        { price: 161.5, name: "USDT", _id: 1 },
        { price: 148.0, name: "USD", _id: 2 },
      ],

      modalCommission: {
        data: {},
        active: false,
        isLoading: false,
      },

      DEFAULT_PATH: {
        commissions: [{ value: 0, name: null, _id: 1 }],
        value: 0,
        currencySelected: 1,
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
          commissions: [
            { value: "1.73", name: "Wise", _id: 1 },
            { value: "2.62", name: "Binance", _id: 2 },
          ],
          value: 0,
          name: "WISE>BINANCE>ARS",
          currencySelected: 1,
          _id: 1,
        },
        {
          commissions: [
            { value: "1.73", name: "Wise", _id: 3 },
            { value: "2.62", name: "Binance", _id: 4 },
            { value: "2", name: "Dolar fisico", _id: 5 },
          ],
          value: 0,
          name: "WISE>BINANCE>DOLAR_FISICO>ARS",
          currencySelected: 2,
          _id: 2,
        },
        {
          commissions: [
            { value: "3", name: "Payoneer", _id: 6 },
            { value: "5", name: "Dolar fisico", _id: 7 },
          ],
          value: 0,
          name: "PAYONEER>DOLAR_FISICO>ARS",
          currencySelected: 2,
          _id: 3,
        },
        {
          commissions: [
            { value: "3", name: "Payoneer", _id: 8 },
            { value: "6", name: "Binance", _id: 9 },
            { value: "2", name: "Dolar Fisico", _id: 10 },
          ],
          value: 0,
          name: "PAYONEER>BINANCE>DOLAR_FISICO>ARS",
          currencySelected: 2,
          _id: 4,
        },
      ],

      paths: [
        {
          commissions: [
            { value: "1.73", name: "Wise", _id: 1 },
            { value: "2.62", name: "Binance", _id: 2 },
          ],
          value: "400",
          name: "WISE>BINANCE>ARS",
          currencySelected: 1,
          _id: 1,
        },
        {
          commissions: [
            { value: "1.73", name: "Wise", _id: 3 },
            { value: "2.62", name: "Binance", _id: 4 },
            { value: "2", name: "Dolar fisico", _id: 5 },
          ],
          value: "400",
          name: "WISE>BINANCE>DOLAR_FISICO>ARS",
          currencySelected: 2,
          _id: 2,
        },
        {
          commissions: [
            { value: "3", name: "Payoneer", _id: 6 },
            { value: "5", name: "Dolar fisico", _id: 7 },
          ],
          value: "400",
          name: "PAYONEER>DOLAR_FISICO>ARS",
          currencySelected: 2,
          _id: 3,
        },
        {
          commissions: [
            { value: "3", name: "Payoneer", _id: 8 },
            { value: "6", name: "Binance", _id: 9 },
            { value: "2", name: "Dolar Fisico", _id: 10 },
          ],
          value: "400",
          name: "PAYONEER>BINANCE>DOLAR_FISICO>ARS",
          currencySelected: 2,
          _id: 4,
        },
      ],
    };
  },

  computed: {
    calculatedPaths() {
      return this.paths.map((pathItem) => ({
        ...pathItem,
        currency: this.find(this.currencies, pathItem.currencySelected),
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

    totalDolar({ commissions, value = 0 }) {
      return commissions.reduce((ant, comissionItem) => {
        const resultCommission = parseFloat(
          (parseFloat(ant).toFixed(2) *
            parseFloat(comissionItem.value).toFixed(2)) /
            100
        ).toFixed(2);
        return parseFloat(ant - resultCommission).toFixed(2);
      }, value);
    },

    totalArs(pathItem) {
      const currency = this.find(this.currencies, pathItem.currencySelected);

      return (this.totalDolar(pathItem) * parseFloat(currency.price)).toFixed(
        2
      );
    },

    totalFee(pathItem) {
      return (pathItem.value - this.totalDolar(pathItem)).toFixed(2);
    },

    percentageFee(pathItem) {
      return ((this.totalFee(pathItem) * 100) / pathItem.value).toFixed(2);
    },

    submitCommission({ name, value, pathIndex, commissionIndex, _id }) {
      if (_id) {
        this.paths[pathIndex].commissions[commissionIndex].name = name;
        this.paths[pathIndex].commissions[commissionIndex].value = value;
      } else {
        this.addItem(this.paths[pathIndex].commissions, {
          _id: Date.now(),
          name,
          value,
        });
      }

      this.closeModal(this.modalCommission);
    },
  },
};
</script>


<style lang="scss" scoped>
.home__paths {
  flex-wrap: nowrap;
  overflow-x: auto;
}
</style>