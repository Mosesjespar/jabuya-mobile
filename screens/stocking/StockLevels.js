import { View, FlatList } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Text } from "react-native";
import Colors from "../../constants/Colors";
import Snackbar from "../../components/Snackbar";
import { userData } from "../../context/UserContext";
import AppStatusBar from "../../components/AppStatusBar";
import TopHeader from "../../components/TopHeader";
import StockLevelCard from "./components/StockLevelCard";
import { PDT_ENTRY } from "../../navigation/ScreenNames";
import VerticalSeparator from "../../components/VerticalSeparator";
import ItemHeader from "../sales/components/ItemHeader";
import { formatNumberWithCommas } from "../../utils/Utils";
import { UserSessionUtils } from "../../utils/UserSessionUtils";

const StockLevel = ({ navigation }) => {
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [stockLevels, setStockLevels] = useState([]);
  const [stockLevelRecords, setStockLevelRecords] = useState(0);
  const [loading, setLoading] = useState(false);

  const [stock, setStock] = useState(0);

  const [pdtValue, setPdtValue] = useState(0);

  const snackbarRef = useRef(null);

  const { selectedShop } = userData();

  const fetchShopProducts = async () => {
    try {
      setLoading(true);
      const id = selectedShop?.name.includes("All") ? null : selectedShop?.id;

      let list = await UserSessionUtils.getShopProducts(id);

      list = list?.filter(filterCallback);

      setStockLevels(list);

      setStockLevelRecords(list?.length);

      const newList = list?.map((data) => {
        const summary = data?.performanceSummary;
        const productSoldQty = summary?.totalQuantitySold || 0;
        const productStockedQty = summary?.totalQuantityStocked || 0;
        const price = data?.salesPrice;

        let remainingStock = Math.round(productStockedQty - productSoldQty);

        if (
          remainingStock === undefined ||
          isNaN(remainingStock) ||
          remainingStock < 1
        ) {
          remainingStock = 0;
        }

        return {
          stockValue: Math.round(remainingStock * price),
          items: Math.round(remainingStock),
        };
      });

      const items = newList.reduce((a, b) => a + b?.items, 0);
      const stock = newList.reduce((a, b) => a + b?.stockValue, 0);

      setPdtValue(items);
      setStock(stock);
      setLoading(false);

      if (list.length === 0) {
        setMessage("No shop products found");
      }

      if (list.length === 0 && searchTerm !== "") {
        setMessage(`No results found for ${searchTerm}`);
      }
    } catch (error) {
      console.log(error);
      setMessage("Error fetching stock records");
      setLoading(false);
    }
  };

  const filterCallback = (item) =>
    item?.productName?.toLowerCase()?.includes(searchTerm.toLowerCase());

  useEffect(() => {
    fetchShopProducts();
  }, [selectedShop]);

  const toProductEntry = () => {
    if (selectedShop?.name.includes("All")) {
      snackbarRef.current.show("Please select a shop before listing");
    } else {
      navigation.navigate(PDT_ENTRY);
    }
  };

  const menuItems = [
    {
      name: "List product",
      onClick: () => toProductEntry(),
    },
  ];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.light_2,
      }}
    >
      <AppStatusBar />

      <TopHeader
        title="Stock levels"
        showSearch={true}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showMenuDots
        menuItems={menuItems}
        showShops
        onSearch={() => fetchShopProducts()}
      />
      <View
        style={{
          flexDirection: "row",
          paddingTop: 15,
          justifyContent: "space-between",
          paddingHorizontal: 12,
          backgroundColor: "#000",
          paddingBottom: 10,
        }}
      >
        <ItemHeader title="Products" value={stockLevelRecords} />

        <VerticalSeparator />
        <ItemHeader value={formatNumberWithCommas(pdtValue)} title="Items" />

        <VerticalSeparator />
        <ItemHeader title="Value " value={stock} isCurrency />
      </View>
      <FlatList
        keyExtractor={(item) => item.id.toString()}
        style={{ marginTop: 5 }}
        showsHorizontalScrollIndicator={false}
        data={stockLevels}
        renderItem={({ item }) => <StockLevelCard data={item} />}
        onRefresh={() => {
          setSearchTerm("");
          fetchShopProducts();
        }}
        refreshing={loading}
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>{message}</Text>
          </View>
        )}
      />
      <Snackbar ref={snackbarRef} />
    </View>
  );
};

export default StockLevel;
