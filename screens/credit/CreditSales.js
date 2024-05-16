import { View, Text, SafeAreaView, FlatList, StyleSheet } from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../../context/UserContext";
import { formatNumberWithCommas } from "../../utils/Utils";
import AppStatusBar from "../../components/AppStatusBar";
import TopHeader from "../../components/TopHeader";
import ItemHeader from "../sales/components/ItemHeader";
import VerticalSeparator from "../../components/VerticalSeparator";
import Snackbar from "../../components/Snackbar";
import Colors from "../../constants/Colors";
import { BaseApiService } from "../../utils/BaseApiService";
import CreditSaleCard from "./components/CreditSaleCard";
import { CLIENT_FORM } from "../../navigation/ScreenNames";
import { CLIENTS_ENDPOINT } from "../../utils/EndPointUtils";

const CreditSales = () => {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState(null);

  const [debt, setDebt] = useState(0);
  const [paid, setPaid] = useState(0);
  const [bal, setBal] = useState(0);
  const [clients, setClients] = useState([]);
  const [adds, setAdds] = useState(0);

  const snackbarRef = useRef(null);
  const { selectedShop, userParams } = useContext(UserContext);

  const fetchClients = async () => {
    setMessage(null);
    setLoading(true);
    setBal(0);
    setDebt(0);
    setPaid(0);
    setClients([]);
    setAdds(0);
    const allShops = selectedShop?.id === userParams?.shopOwnerId;

    const serachParams = {
      limit: 0,
      ...(allShops &&
        userParams?.isShopOwner && {
          shopOwnerId: selectedShop?.id,
        }),
      ...(!allShops && { shopId: selectedShop?.id }),
      offset: 0,
    };

    await new BaseApiService(CLIENTS_ENDPOINT)
      .getRequestWithJsonResponse(serachParams)
      .then((response) => {
        setClients(response?.records);
        if (response?.totalItems === 0) {
          setMessage("No records found");
        }
      })
      .catch((error) => {
        setLoading(false);
        setMessage("Error fetching shop clients");
        console.log(error);
      });
  };

  const appendDebtValue = (value = 0) => {
    setDebt((prev) => prev + value);
    setAdds((prev) => prev + 1);
  };

  const appendPaidValue = (value = 0) => {
    setPaid((prev) => prev + value);
  };
  const appendBalValue = (value = 0) => {
    setBal((prev) => prev + value);
  };

  const handleRefresh = () => {
    fetchClients();
  };
  useEffect(() => {
    fetchClients();
  }, [selectedShop]);

  const menuItems = [
    ...(userParams?.isShopOwner === true
      ? [
          {
            name: "Add debtor",
            onClick: () => navigation.navigate(CLIENT_FORM),
          },
        ]
      : []),
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.dark }}>
      <AppStatusBar />
      <TopHeader
        title="Debt records"
        showMenuDots={!userParams?.isShopAttendant}
        menuItems={menuItems}
        showShops
      />
      <View style={{ paddingBottom: 10 }}>
        <View style={styles.debtHeader}>
          <Text
            style={{
              color: Colors.primary,
              fontSize: 16,
            }}
          >
            Debt summary
          </Text>
        </View>

        <View style={styles.summaryContainer}>
          <ItemHeader value={clients?.length} title="Debtors" ugx={false} />

          <VerticalSeparator />

          <ItemHeader title="Debt" value={formatNumberWithCommas(debt)} />

          <VerticalSeparator />

          <ItemHeader title="Paid " value={formatNumberWithCommas(paid)} />

          <VerticalSeparator />

          <ItemHeader title="Balance" value={formatNumberWithCommas(bal)} />
        </View>
      </View>

      <View style={{ flex: 1, backgroundColor: Colors.light_2 }}>
        <FlatList
          style={{ marginTop: 10 }}
          data={clients}
          renderItem={({ item }) => {
            if (clients?.length === adds) {
              setLoading(false);
            }
            return (
              <CreditSaleCard
                client={item}
                appendDebtValue={appendDebtValue}
                appendBalValue={appendBalValue}
                appendPaidValue={appendPaidValue}
              />
            );
          }}
          keyExtractor={(item) => item.id.toString()}
          refreshing={loading}
          onRefresh={() => handleRefresh()}
          ListEmptyComponent={() => (
            <View style={styles.errorMsg}>
              <Text>{message}</Text>
            </View>
          )}
        />
        <Snackbar ref={snackbarRef} />
      </View>
    </SafeAreaView>
  );
};

export default CreditSales;

const styles = StyleSheet.create({
  debtHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  errorMsg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryContainer: {
    flexDirection: "row",
    marginTop: 15,
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
});
