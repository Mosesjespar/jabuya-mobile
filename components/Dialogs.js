import {
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
} from "react-native";
import React from "react";
import { Calendar } from "react-native-calendars";

import Card from "./Card";
import ModalContent from "./ModalContent";
import MaterialButton from "./MaterialButton";
import { SaleItem } from "./TransactionItems";

import Colors from "../constants/Colors";
import { formatDate, formatNumberWithCommas } from "../utils/Utils";

export function SalesQtyInputDialog({
  showMoodal,
  selection,
  errors,
  setErrors,
  setShowModal,
  quantity,
  setQuantity,
  saveSelection,
  setUnitCost,
  unitCost,
  setSelection,
  setScanned,
}) {
  return (
    <ModalContent visible={showMoodal} style={{ padding: 35 }}>
      <Card
        style={{
          paddingHorizontal: 15,
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 2,
          }}
        >
          <View
            style={{
              marginTop: 10,
              marginBottom: 5,
              marginTop: 20,
            }}
          >
            <Text
              style={{
                fontWeight: "600",
                fontSize: 20,
                marginBottom: 5,
              }}
            >
              Successfull
            </Text>
            <Text>{selection && selection.productName} has been selected.</Text>
            <Text
              style={{
                fontWeight: "600",
                fontSize: 13,
                marginTop: 10,
              }}
            >
              Quantity
            </Text>
          </View>

          <TextInput
            onFocus={() => setErrors(null)}
            onBlur={() => setErrors(null)}
            textAlign="right"
            inputMode="numeric"
            value={quantity}
            onChangeText={(text) => setQuantity(text)}
            maxLength={3}
            autoFocus
            style={{
              backgroundColor: Colors.light_3,
              borderRadius: 5,
              padding: 6,
              borderWidth: 1,
              borderColor: errors?.qtyZeroError ? Colors.error : "transparent",
            }}
          />
          {errors?.qtyZeroError && (
            <Text
              style={{
                fontSize: 12,
                color: Colors.error,
              }}
            >
              {errors?.qtyZeroError}
            </Text>
          )}
          <Text
            style={{
              fontWeight: "600",
              fontSize: 13,
              marginTop: 10,
              marginBottom: 5,
            }}
          >
            Unit cost
          </Text>
          <TextInput
            textAlign="right"
            value={unitCost}
            inputMode="numeric"
            onChangeText={(e) => setUnitCost(e)}
            style={{
              backgroundColor: Colors.light_3,
              borderRadius: 5,
              padding: 6,
              borderColor: errors?.lessPriceError
                ? Colors.error
                : "transparent",
            }}
          />
          {errors?.lessPriceError && (
            <Text
              style={{
                fontSize: 12,
                color: Colors.error,
              }}
            >
              {errors?.lessPriceError}
            </Text>
          )}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 15,
              marginBottom: 5,
            }}
          >
            <MaterialButton
              title="Cancel"
              style={{
                backgroundColor: "transparent",
                borderRadius: 5,
                borderWidth: 1,
                borderColor: Colors.dark,
                marginStart: -2,
                margin: 10,
                height: 40,
              }}
              titleStyle={{
                fontWeight: "bold",
                color: Colors.dark,
              }}
              buttonPress={() => {
                setShowModal(false);
                setErrors({});
                setSelection(null);
                setScanned(false);
              }}
            />
            <MaterialButton
              title="Confirm"
              style={{
                backgroundColor: Colors.dark,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: Colors.dark,
                marginStart: 2,
                marginEnd: -2,
                margin: 10,
                height: 40,
              }}
              titleStyle={{
                fontWeight: "bold",
                color: Colors.primary,
              }}
              buttonPress={() => {
                saveSelection();
              }}
            />
          </View>
        </View>
      </Card>
    </ModalContent>
  );
}

export function ConfirmSalesDialog({
  visible,
  addSale,
  sales,
  totalCost,
  setVisible,
  cartLength,
  balanceGivenOut,
  amountPaid,
}) {
  const date = new Date();

  return (
    <ModalContent visible={visible} style={{ padding: 10 }}>
      <Card
        style={{
          alignSelf: "center",
          minHeight: 120,
          maxHeight: 490,
          width: 315,
          paddingBottom: 7,
        }}
      >
        <View
          style={{
            backgroundColor: Colors.light,
            padding: 2,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                marginTop: 10,
                fontWeight: "bold",
                fontSize: 18,
                marginBottom: 12,
                marginStart: 1,
              }}
            >
              Confirm sale
            </Text>
            <TouchableOpacity
              onPress={() => {
                setVisible();
              }}
            >
              <Image
                source={require("../assets/icons/ic_close.png")}
                style={{
                  height: 12,
                  width: 12,
                  resizeMode: "contain",
                  marginStart: 15,
                  alignSelf: "center",
                  marginTop: 10,
                }}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{
                fontSize: 12,
                color: Colors.gray,
                alignSelf: "flex-end",
              }}
            >
              {formatDate(date)}
            </Text>
            <Text>Currency : UGX</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              height: 25,
              paddingEnd: 10,
              borderBottomColor: Colors.gray,
              borderBottomWidth: 0.3,
              marginTop: 10,
            }}
          >
            <Text style={{ flex: 2.5, fontWeight: 600 }}>Item</Text>
            <Text style={{ flex: 0.5, textAlign: "center", fontWeight: 600 }}>
              Qty
            </Text>
            <Text style={{ flex: 1, textAlign: "right", fontWeight: 600 }}>
              Cost
            </Text>

            <Text style={{ flex: 1, textAlign: "right", fontWeight: 600 }}>
              Amount
            </Text>
          </View>
          <FlatList
            data={sales}
            renderItem={({ item }) => <SaleItem data={item} key={item.id} />}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Recieved </Text>
            <Text
              style={{
                alignSelf: "flex-end",
                fontWeight: "bold",
                marginEnd: 4,
              }}
            >
              {formatNumberWithCommas(amountPaid)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginVertical: 3,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>
              Sold{" "}
              <Text style={{ fontWeight: "400" }}>
                {cartLength >= 1 && (
                  <Text>
                    {cartLength}
                    {cartLength > 1 ? <Text> items</Text> : <Text> item</Text>}
                  </Text>
                )}
              </Text>
            </Text>

            <Text
              style={{
                alignSelf: "flex-end",
                fontWeight: "bold",
                marginEnd: 4,
              }}
            >
              {formatNumberWithCommas(totalCost)}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Balance</Text>
            <Text
              style={{
                alignSelf: "flex-end",
                fontWeight: "bold",
                marginEnd: 4,
                fontSize: 15,
              }}
            >
              {formatNumberWithCommas(balanceGivenOut)}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <MaterialButton
              title="Cancel"
              style={{
                backgroundColor: "transparent",
                borderRadius: 5,
                borderWidth: 1,
                borderColor: Colors.dark,
                marginStart: -2,
                margin: 10,
                height: 40,
              }}
              titleStyle={{
                fontWeight: "bold",
                color: Colors.dark,
              }}
              buttonPress={() => {
                setVisible();
              }}
            />
            <MaterialButton
              title="OK"
              style={{
                backgroundColor: Colors.dark,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: Colors.dark,
                marginStart: 2,
                marginEnd: -2,
                margin: 10,
                height: 40,
              }}
              titleStyle={{
                fontWeight: "bold",
                color: Colors.primary,
              }}
              buttonPress={() => {
                setVisible();
                addSale();
              }}
            />
          </View>
        </View>
      </Card>
    </ModalContent>
  );
}
