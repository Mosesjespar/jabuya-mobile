import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
} from "react-native";
import React from "react";
import ModalContent from "./ModalContent";
import Card from "./Card";
import Colors from "../constants/Colors";
import MaterialButton from "./MaterialButton";
import { SaleItem } from "./TransactionItems";
import { formatDate, formatNumberWithCommas } from "../utils/Utils";

function ConfirmSalesDialog({
  visible,
  addSale,
  sales,
  total,
  setVisible,
  length,
  balanceGivenOut,
  amountPaid,
  resetList,
  dateCreated,
}) {
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
                resetList();
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
              {formatDate(dateCreated)}
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
            renderItem={({ item }) => (
              <SaleItem data={item} itemCount={length} total={total} />
            )}
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
                {length >= 1 && (
                  <Text>
                    {length}
                    {length > 1 ? <Text> items</Text> : <Text> item</Text>}
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
              {formatNumberWithCommas(total)}
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
                resetList();
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
              buttonPress={() => addSale()}
            />
          </View>
        </View>
      </Card>
    </ModalContent>
  );
}

export default ConfirmSalesDialog;
