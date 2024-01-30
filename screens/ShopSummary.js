import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import BlackAndWhiteScreen from "../components/BlackAndWhiteScreen";
import AppStatusBar from "../components/AppStatusBar";
import Colors from "../constants/Colors";
import { BaseApiService } from "../utils/BaseApiService";
import OrientationLoadingOverlay from "react-native-orientation-loading-overlay";
import { ItemHeader } from "./ViewSales";
import { BlackScreen } from "../components/BlackAndWhiteScreen";
import UserProfile from "../components/UserProfile";
import Loader from "../components/Loader";
const ShopSummary = ({ navigation, route }) => {
  const [performanceSummary, setPerformanceSummary] = useState({});
  const [initialCapital, setInitialCapital] = useState("");
  const [loading, setLoading] = useState(false);

  const { isShopOwner, isShopAttendant, attendantShopId, shopOwnerId } =
    route.params;

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
              {initialCapital}
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
              12,5000,000
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
                4,500,200
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
                  alignSelf: "flex-end",
                  fontSize: 16,
                }}
              >
                4,500,200
              </Text>
              <Text
                style={{
                  fontWeight: 300,
                  fontSize: 10,
                  alignSelf: "flex-end",
                }}
              >
                Sold capital value
              </Text>
            </View>
          </View>

          <View style={{ width: 10 }}></View>
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
              source={require("../assets/icons/icons8-box-502.png")}
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
                3,500,200
              </Text>
              <Text
                style={{
                  fontWeight: 300,
                  fontSize: 10,
                  alignSelf: "flex-end",
                }}
              >
                Restocking
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
                Gross profit
              </Text>
              <Text style={{ fontWeight: 300, fontSize: 10 }}>
                Before expenses
              </Text>
            </View>
          </View>

          <View>
            <Text style={{ fontWeight: 500, fontSize: 20, marginEnd: 10 }}>
              1,5000,000
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
              source={require("../assets/icons/icons8-current-expenses-64.png")}
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
              120,000
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
              880,200
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ShopSummary;
