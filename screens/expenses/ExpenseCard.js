import { View,Text } from "react-native";
import React from "react";
import { BaseStyle } from "../../utils/BaseStyle";
import CardHeader from "../../components/card_components/CardHeader";
import { formatDate } from "../../utils/Utils";
import CardFooter2 from "../../components/card_components/CardFooter2";
import DataColumn from "../../components/card_components/DataColumn";
import Colors from "../../constants/Colors";

const ExpenseCard = ({ exp }) => {
  return (
    <View style={BaseStyle.card}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: "bold",
          }}
        >
          {exp?.shopName}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: Colors.gray,
            alignSelf: "flex-end",
          }}
        >
          {formatDate(exp?.dateCreated)}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          marginVertical: 10,
        }}
      >
        <DataColumn value={exp?.categoryName} title={"Category"} left />

        <DataColumn value={exp?.description} title={"Description"} />

        <DataColumn value={exp?.amount} title={"Amount"} end isCurrency />
      </View>

      <CardFooter2
        btnTitle="More"
        label={`Entered by ${exp?.createdByFullName}`}
        renderBtn={false}
      />
    </View>
  );
};

export default ExpenseCard;
