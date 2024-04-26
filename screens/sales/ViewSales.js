import { View, Text, SafeAreaView, FlatList } from "react-native";
import React, { useContext, useEffect, useState } from "react";

import { BaseApiService } from "../../utils/BaseApiService";

import Colors from "../../constants/Colors";

import AppStatusBar from "../../components/AppStatusBar";
import {
  convertDateFormat,
  formatNumberWithCommas,
  getCurrentDay,
} from "../../utils/Utils";
import UserProfile from "../../components/UserProfile";
import { UserContext } from "../../context/UserContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SaleTransactionItem } from "./components/SaleTransactionItem";
import ItemHeader from "./components/ItemHeader";
import VerticalSeparator from "../../components/VerticalSeparator";
import { SHOP_SUMMARY } from "../../navigation/ScreenNames";

export default function ViewSales({ navigation }) {
  const [sales, setSales] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalSalesQty, setTotalSalesQty] = useState(0); //total quantity for all sold items
  const [visible, setVisible] = useState(false);
  const [salesValue, setSalesValue] = useState(0); //total money value sold
  const [saleCapital, setSaleCapital] = useState([]); //capital list
  const [profits, setProfits] = useState([]); //profits list
  const [daysProfit, setDaysProfit] = useState(0);
  const [daysCapital, setDaysCapital] = useState(0);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const { userParams, shops, selectedShop, setSelectedShop } =
    useContext(UserContext);

  const { isShopOwner, shopOwnerId } = userParams;

  const menuItems = [
    {
      name: "Refresh",
      onClick: () => handleRefresh(),
    },
    {
      name: "Select date",
      onClick: () => setVisible(true),
    },
    isShopOwner && {
      name: "Investment",
      onClick: () => navigation.navigate(SHOP_SUMMARY),
    },
    ...(shops?.length > 1
      ? shops?.map((shop) => {
          return {
            ...shop,
            onClick: () => setSelectedShop(shop),
            bold: shop?.id === selectedShop.id,
          };
        })
      : []),
  ];

  const [date, setDate] = useState(new Date());

  const onChange = (event, selectedDate) => {
    setVisible(false);
    getSales(selectedDate);
    setDate(selectedDate);
  };

  const clearFields = () => {
    //reseting calculatable fields
    setSales([]);
    setSalesValue(0);
    setTotalSalesQty(0);
    setProfits([]);
    setSaleCapital([]);
    setDaysCapital(0);
    setDaysProfit(0);
    setMessage(null);
    setTotalItems(0);
    setDate(new Date());
  };

  const getSales = async (day = null) => {
    setLoading(true);
    setMessage(null);
    const allShops = selectedShop?.id === shopOwnerId;

    let searchParameters = {
      offset: 0,
      limit: 0,
      ...(allShops && {
        shopOwnerId: selectedShop?.id,
      }),
      ...(!allShops && { shopId: selectedShop?.id }),
      startDate: getCurrentDay(),
      ...(day && {
        startDate: convertDateFormat(day),
        endDate: convertDateFormat(day, true),
      }),
    };

    clearFields();

    new BaseApiService("/shop-sales")
      .getRequestWithJsonResponse(searchParameters)
      .then((response) => {
        const data = [...response.records].filter(
          (sale) => sale?.balanceGivenOut >= 0
        ); //to filter out credit sales

        let sV = data.reduce((a, sale) => a + sale?.totalCost, 0); //sales value

        if (response.totalItems === 0) {
          setMessage("No sales made on this today");
        }

        data.forEach((item) => {
          const { lineItems } = item;
          if (lineItems !== undefined) {
            let cartQty = lineItems.reduce((a, item) => a + item.quantity, 0);

            let cartProfit = lineItems.reduce((a, i) => a + i.totalProfit, 0);

            let cap = lineItems.reduce((a, i) => a + i.totalPurchaseCost, 0); // cart capital

            profits.push(cartProfit);
            saleCapital.push(cap);

            setCount(cartQty);
          }
        });

        let income = profits.reduce((a, b) => a + b, 0); //getting the sum profit in all carts
        let capital = saleCapital.reduce((a, b) => a + b, 0);

        setDaysProfit(formatNumberWithCommas(Math.round(income)));
        setDaysCapital(formatNumberWithCommas(Math.round(capital)));
        setSalesValue(sV);
        setSales(response?.records);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setMessage("Cannot get sales!", error?.message);
      });
  };

  const setCount = (count) => {
    setTotalSalesQty((prevCount) => prevCount + count);
  };

  useEffect(() => {
    getSales();
  }, [selectedShop]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light_2 }}>
      <AppStatusBar />

      <View style={{ backgroundColor: Colors.dark }}>
        <UserProfile renderNtnIcon={false} renderMenu menuItems={menuItems} />

        <View style={{ marginTop: 5, paddingBottom: 10 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 10,
              marginVertical: 10,
            }}
          >
            <Text
              style={{
                color: Colors.primary,
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              Sales summary
            </Text>

            <Text
              style={{
                color: Colors.primary,
                fontWeight: 600,
                opacity: 0.7,
              }}
            >
              {selectedShop?.name}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              marginTop: 15,
              justifyContent: "space-between",
              paddingHorizontal: 12,
            }}
          >
            <ItemHeader value={totalSalesQty || 0} title="Qty" ugx={false} />

            <VerticalSeparator />

            <ItemHeader
              title="Sales"
              value={formatNumberWithCommas(salesValue)}
            />

            <VerticalSeparator />

            <ItemHeader title="Capital " value={daysCapital} />

            <VerticalSeparator />

            <ItemHeader title="Income" value={daysProfit} />
          </View>
        </View>
      </View>

      <FlatList
        containerStyle={{ padding: 5 }}
        showsHorizontalScrollIndicator={false}
        data={sales}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, i }) => (
          <SaleTransactionItem key={i} data={item} isShopOwner={isShopOwner} />
        )}
        ListEmptyComponent={() => (
          <Text style={{ flex: 1, textAlign: "center", alignSelf: "center" }}>
            {message}
          </Text>
        )}
        onRefresh={() => getSales()}
        refreshing={loading}
      />

      {visible && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={"date"}
          onChange={onChange}
          maximumDate={new Date()}
        />
      )}
    </SafeAreaView>
  );
}
