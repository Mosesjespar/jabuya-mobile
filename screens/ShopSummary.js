import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AppStatusBar from "../components/AppStatusBar";
import Colors from "../constants/Colors";
import { BaseApiService } from "../utils/BaseApiService";
import { ItemHeader } from "./ViewSales";
import { BlackScreen } from "../components/BlackAndWhiteScreen";
import UserProfile from "../components/UserProfile";
import Loader from "../components/Loader";
import { formatNumberWithCommas } from "../utils/Utils";
import { UserContext } from "../context/UserContext";

const ShopSummary = ({ navigation, route }) => {
  const [initialCapital, setInitialCapital] = useState("");
  const [loading, setLoading] = useState(true);
  const [stock, setStock] = useState(null);
  const [totalSalesValue, setTotalSalesValue] = useState(null); //cash at hand
  const [financialRecords, setFinancialRecords] = useState(null);

  const { userParams } = useContext(UserContext);

  const { shopOwnerId } = userParams; // changes the id when done

  const fetchShopProducts = () => {
    let searchParameters = {
      offset: 0,
      limit: 0,
      shopOwnerId: 2453,
    };
    let itemsStockValues = [];
    let itemsSaleValues = [];

    new BaseApiService("/shop-products")
      .getRequestWithJsonResponse(searchParameters)
      .then(async (response) => {
        response.records.forEach((item) => {
          const { salesPrice } = item;
          let summary = item?.performanceSummary;

          let qtyStocked = summary?.totalQuantityStocked || 0;
          let qtySold = summary?.totalQuantitySold || 0;

          let remainingStock = qtyStocked - qtySold;
          let soldValue = summary?.totalValueSold || 0;

          const itemValue = salesPrice * remainingStock; //itemstock value

          itemsStockValues.push(itemValue);
          itemsSaleValues.push(soldValue);
        });

        let stockValue = itemsStockValues.reduce((a, b) => a + b, 0);
        let cash = itemsSaleValues.reduce((a, b) => a + b, 0);
        setStock(stockValue);
        setTotalSalesValue(cash);

        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const fetchShopDetails = () => {
    let searchParameters = {
      offset: 0,
      limit: 0,
      shopOwnerId: shopOwnerId //1427, // 2453,
    };

    new BaseApiService("/shops")
      .getRequestWithJsonResponse(searchParameters)
      .then(async (response) => {
        // console.log(response.records);
        let totalCapital = 0;
        let stockValue = 0;
        let cashAtHand = 0;
        let expenses = 0;
        let grossProfit = 0;
        let initialCap = 0;

        response.records.forEach(async (item) => {
          totalCapital += item?.initialCapital;

          stockValue += item?.performanceSummary?.totalStockValue || 0;

          cashAtHand += item?.performanceSummary?.totalSalesValue || 0;

          expenses += item?.performanceSummary?.totalExpenses || 0;

          grossProfit += item?.performanceSummary?.totalStockValue || 0;
          initialCap += item?.initialCapital;
        });

        setFinancialRecords({
          totalCapital,
          stockValue,
          cashAtHand,
          expenses,
          grossProfit,
        });
        setInitialCapital(initialCap);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchShopProducts();
    fetchShopDetails();
  }, []);

  return (
    <View style={{ backgroundColor: Colors.light_2, flex: 1 }}>
      <BlackScreen flex={0.45}>
        <UserProfile navigation={navigation} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 20,
            paddingHorizontal: 13,
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 12,
                color: Colors.primary,
                opacity: 0.6,
                marginBottom: 3,
              }}
            >
              Investment
            </Text>
            <Text
              style={{ fontSize: 15, color: Colors.primary, fontWeight: "600" }}
            >
              <Text
                style={{
                  fontSize: 10,
                }}
              >
                UGX
              </Text>{" "}
              {formatNumberWithCommas(initialCapital)}
            </Text>
          </View>
          <View
            style={{
              width: 1,
              height: "inherit",
              backgroundColor: Colors.primary,
            }}
          />
          <View>
            <Text
              style={{
                fontSize: 12,
                color: Colors.primary,
                opacity: 0.6,
                marginBottom: 3,
                alignSelf: "flex-end",
              }}
            >
              Shops
            </Text>
            <Text style={{ color: Colors.primary, alignSelf: "flex-end" }}>
              01
            </Text>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: Colors.primary,
              borderRadius: 3,
              height: 25,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: Colors.dark,
                paddingHorizontal: 6,
                alignSelf: "center",
                justifyContent: "center",
                fontSize: 12,
              }}
            >
              ADD CAPITAL
            </Text>
          </TouchableOpacity>
        </View>
      </BlackScreen>
      <AppStatusBar bgColor="black" content="light-content" />
      <Loader loading={loading} />

      <View style={{ paddingHorizontal: 10, marginTop: 8 }}>
        <View
          style={{
            backgroundColor: Colors.primary,
            flexDirection: "row",
            alignItems: "center",
            padding: 6,
            borderRadius: 3,
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Image
              source={require("../assets/icons/icons8-box-501.png")}
              style={{
                width: 40,
                height: 40,
                tintColor: Colors.dark,
                marginEnd: 10,
              }}
            />
            <View>
              <Text style={{ fontWeight: 400, fontWeight: 16 }}>Stock</Text>
              <Text style={{ fontWeight: 300, fontSize: 10 }}>Total Value</Text>
            </View>
          </View>

          <View>
            <Text style={{ fontWeight: 500, fontSize: 20, marginEnd: 10 }}>
              {formatNumberWithCommas(stock)}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
            borderRadius: 3,
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <View
            style={{
              backgroundColor: Colors.light,
              flexDirection: "row",
              alignItems: "center",
              padding: 6,
              borderRadius: 3,
              justifyContent: "space-between",
              flex: 1,
            }}
          >
            <Image
              source={require("../assets/icons/bank1.png")}
              style={{
                width: 40,
                height: 40,
                tintColor: Colors.dark,
                marginEnd: 10,
              }}
            />

            <View>
              <Text
                style={{
                  fontWeight: 500,
                  fontSize: 16,
                  alignSelf: "flex-end",
                }}
              >
                {formatNumberWithCommas(0)}
              </Text>
              <Text
                style={{
                  fontWeight: 300,
                  fontSize: 10,
                  alignSelf: "flex-end",
                }}
              >
                Banked
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: Colors.light,
              flexDirection: "row",
              alignItems: "center",
              padding: 6,
              borderRadius: 3,
              justifyContent: "space-between",
              flex: 1,
            }}
          >
            <Image
              source={require("../assets/icons/open-hand.png")}
              style={{
                width: 40,
                height: 40,
                tintColor: Colors.dark,
                marginEnd: 10,
              }}
            />

            <View>
              <Text
                style={{
                  fontWeight: 500,
                  alignSelf: "flex-end",
                  fontSize: 16,
                }}
              >
                {formatNumberWithCommas(totalSalesValue)}
              </Text>
              <Text
                style={{
                  fontWeight: 300,
                  fontSize: 10,
                  alignSelf: "flex-end",
                }}
              >
                Cash at hand
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
            borderRadius: 3,
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <View
            style={{
              backgroundColor: Colors.light,
              flexDirection: "row",
              alignItems: "center",
              padding: 6,
              borderRadius: 3,
              justifyContent: "space-between",
              flex: 1,
            }}
          >
            <Image
              source={require("../assets/icons/icons8-cash-50.png")}
              style={{
                width: 40,
                height: 40,
                tintColor: Colors.dark,
                marginEnd: 10,
              }}
            />

            <View>
              <Text
                style={{
                  fontWeight: 500,
                  alignSelf: "flex-end",
                  fontSize: 16,
                }}
              >
                0
              </Text>
              <Text
                style={{
                  fontWeight: 300,
                  fontSize: 10,
                  alignSelf: "flex-end",
                }}
              >
                Debt
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: Colors.light,
              flexDirection: "row",
              alignItems: "center",
              padding: 6,
              borderRadius: 3,
              justifyContent: "space-between",
              flex: 1,
            }}
          >
            <Image
              source={require("../assets/icons/icons8-money-50.png")}
              style={{
                width: 40,
                height: 40,
                tintColor: Colors.dark,
                marginEnd: 10,
              }}
            />

            <View>
              <Text
                style={{
                  fontWeight: 500,
                  fontSize: 16,
                  alignSelf: "flex-end",
                }}
              >
                0
              </Text>
              <Text
                style={{
                  fontWeight: 300,
                  fontSize: 10,
                  alignSelf: "flex-end",
                }}
              >
                Credit
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            backgroundColor: Colors.light,
            flexDirection: "row",
            alignItems: "center",
            padding: 6,
            borderRadius: 3,
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Image
              source={require("../assets/icons/icons8-money-bag-64.png")}
              style={{
                width: 40,
                height: 40,
                tintColor: Colors.dark,
                marginEnd: 10,
              }}
            />
            <View>
              <Text style={{ fontWeight: 400, fontSize: 16 }}>
                Gross income
              </Text>
              <Text style={{ fontWeight: 300, fontSize: 10 }}>
                Before expenses
              </Text>
            </View>
          </View>

          <View>
            <Text style={{ fontWeight: 500, fontSize: 20, marginEnd: 10 }}>
              {formatNumberWithCommas(financialRecords?.grossProfit)}
            </Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: Colors.light,
            flexDirection: "row",
            alignItems: "center",
            padding: 6,
            borderRadius: 3,
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Image
              source={require("../assets/icons/spending.png")}
              style={{
                width: 40,
                height: 40,
                tintColor: Colors.dark,
                marginEnd: 10,
              }}
            />
            <View>
              <Text style={{ fontWeight: 400, fontSize: 16 }}>Expenses</Text>
              <Text style={{ fontWeight: 300, fontSize: 10 }}>
                Monthly total
              </Text>
            </View>
          </View>

          <View>
            <Text style={{ fontWeight: 500, fontSize: 20, marginEnd: 10 }}>
              {formatNumberWithCommas(financialRecords?.expenses)}
            </Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: Colors.dark,
            flexDirection: "row",
            alignItems: "center",
            padding: 6,
            borderRadius: 3,
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Image
              source={require("../assets/icons/icons8-money-bag-48.png")}
              style={{
                width: 40,
                height: 40,
                tintColor: Colors.primary,
                marginEnd: 10,
              }}
            />
            <View>
              <Text
                style={{ fontWeight: 400, color: Colors.primary, fontSize: 16 }}
              >
                Net profit
              </Text>
              <Text
                style={{ fontWeight: 300, fontSize: 10, color: Colors.primary }}
              >
                After expenses
              </Text>
            </View>
          </View>

          <View>
            <Text
              style={{
                fontWeight: 500,
                fontSize: 20,
                marginEnd: 10,
                color: Colors.primary,
              }}
            >
              {formatNumberWithCommas(0)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ShopSummary;
