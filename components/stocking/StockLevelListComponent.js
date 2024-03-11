import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { formatDate } from "../../utils/Utils";
import Colors from "../../constants/Colors";

function StockLevelListComponent({ data }) {
  const [expanded, setExpanded] = useState(false);
  const summary = data?.performanceSummary;
  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  let remainingStock =
    summary?.totalQuantityStocked - summary?.totalQuantitySold;

  if (
    remainingStock === undefined ||
    isNaN(remainingStock) ||
    remainingStock < 1
  ) {
    remainingStock = 0;
  }
  return (
    <View
      style={{
        marginTop: 10,
        marginHorizontal: 10,
        borderRadius: 3,
        backgroundColor: "white",
        paddingVertical: 15,
        paddingHorizontal: 10,
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
            fontSize: 12,
            fontWeight: "bold",
            color: Colors.dark,
            marginBottom: 2,
          }}
        >
          SN: {data?.serialNumber}
        </Text>

        <View>
          <Text
            style={{
              fontSize: 12,
              color: Colors.gray,
              alignSelf: "flex-end",
            }}
          >
            {formatDate(data?.dateCreated)}
          </Text>
        </View>
      </View>
      <>
        <View
          style={{
            flexDirection: "row",
            marginVertical: 10,
          }}
        >
          <View style={{ alignItems: "left", flex: 2 }}>
            <Text
              style={{
                fontWeight: 600,
                marginBottom: 3,
              }}
            >
              Product
            </Text>
            <Text>{data?.productName}</Text>
          </View>

          <View style={{ alignItems: "center", flex: 1 }}>
            <Text
              style={{
                fontWeight: 600,
                marginBottom: 3,
              }}
            >
              Sold
            </Text>
            <Text
              style={{
                alignSelf: "center",
                marginEnd: 2,
              }}
            >
              {summary?.totalQuantitySold || 0}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end", flex: 1, marginEnd: 5 }}>
            <Text
              style={{
                fontWeight: 600,
                marginBottom: 3,
              }}
            >
              Stock
            </Text>
            <Text style={{ fontWeight: 600 }}>{remainingStock}</Text>
          </View>
        </View>

        {expanded && (
          <View
            style={{
              justifyContent: "space-between",
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{
                  fontWeight: 400,
                  fontSize: 12,
                }}
              >
                Restock date:{" "}
              </Text>
              <Text
                style={{
                  fontWeight: 300,
                  fontSize: 12,
                }}
              >
                {formatDate(data?.dateChanged, true)}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginVertical: 2,
              }}
            >
              <Text
                style={{
                  fontWeight: 400,
                  fontSize: 12,
                  marginBottom: 10,
                }}
              >
                Manufacturer:{" "}
              </Text>
              <Text
                style={{
                  fontWeight: 300,
                  fontSize: 12,
                }}
              >
                {data?.manufacturerName}
              </Text>
            </View>
          </View>
        )}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text
              style={{
                fontWeight: 600,
                fontSize: 12,
              }}
            >
              Restock by:{" "}
              <Text
                style={{
                  fontWeight: 300,
                  fontSize: 12,
                }}
              >
                {data?.createdByFullName}
              </Text>
            </Text>
            {/* <Text
              style={{
                fontWeight: 300,
                fontSize: 12,
              }}
            >
              {data?.shopName}
            </Text> */}
          </View>
          <TouchableOpacity
            onPress={toggleExpand}
            style={{
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: Colors.dark,
              borderRadius: 3,
              paddingHorizontal: 12,
              paddingVertical: 4,
            }}
          >
            <Text
              style={{
                color: Colors.primary,
                fontSize: 13,
                fontWeight: 300,
              }}
            >
              {expanded ? "Hide" : "More"}
            </Text>
          </TouchableOpacity>
        </View>
      </>
    </View>
  );
}

export default StockLevelListComponent;
