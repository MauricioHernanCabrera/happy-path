<template>
  <v-row>
    <v-col cols="12">
      <v-btn @click="addItem(paths, { _id: Date.now(), ...DEFAULT_PATH })">
        <v-icon>mdi-plus</v-icon>
        nuevo camino
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
            @click="deleteItem(paths, pathItem._id)"
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
            v-for="(commissionItem, commissionIndex) in pathItem.commissions"
            v-model="commissionItem.value"
            :label="`Comisión: ${
              commissionItem.name ? commissionItem.name : commissionIndex + 1
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
                  deleteItem(paths[pathIndex].commissions, commissionItem._id)
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
      modalCommission: {
        data: {},
        active: false,
        isLoading: false,
      },

      DEFAULT_PATH: {
        commissions: [{ value: 0, name: null, _id: 1 }],
        value: 0,
        dolarPrice: 0,
        money: "USDT",
        name: null,
      },

      DEFAULT_COMMISSION: {
        value: 0,
        name: null,
      },

      moneyConfig: [2, ",", "."],

      paths: [
        {
          commissions: [
            { value: "1.73", name: "Wise", _id: 1 },
            { value: "2.62", name: "Binance", _id: 2 },
          ],
          value: "400",
          dolarPrice: "162.08",
          name: "WISE>BINANCE>ARS",
          money: "USDT",
          _id: 1,
        },
        {
          commissions: [
            { value: "1.73", name: "Wise", _id: 3 },
            { value: "2.62", name: "Binance", _id: 4 },
            { value: "2", name: "Dolar fisico", _id: 5 },
          ],
          value: "400",
          dolarPrice: "146",
          name: "WISE>BINANCE>DOLAR_FISICO>ARS",
          money: "USD",
          _id: 2,
        },
        {
          commissions: [
            { value: "3", name: "Payoneer", _id: 6 },
            { value: "5", name: "Dolar fisico", _id: 7 },
          ],
          value: "400",
          dolarPrice: "146",
          name: "PAYONEER>DOLAR_FISICO>ARS",
          money: "USD",
          _id: 3,
        },
        {
          commissions: [
            { value: "3", name: "Payoneer", _id: 8 },
            { value: "6", name: "Binance", _id: 9 },
            { value: "2", name: "Dolar Fisico", _id: 10 },
          ],
          value: "400",
          dolarPrice: "146",
          name: "PAYONEER>BINANCE>DOLAR_FISICO>ARS",
          money: "USD",
          _id: 4,
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
      return (this.totalDolar(pathItem) * pathItem.dolarPrice).toFixed(2);
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
