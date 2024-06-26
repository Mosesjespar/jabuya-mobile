import { View, Text, SafeAreaView, KeyboardAvoidingView } from "react-native";
import React, { useState, useContext, useRef } from "react";
import TopHeader from "../../components/TopHeader";
import AppStatusBar from "../../components/AppStatusBar";
import Colors from "../../constants/Colors";
import MyInput from "../../components/MyInput";
import { MyDropDown } from "../../components/DropdownComponents";
import { UserContext } from "../../context/UserContext";
import { convertToServerDate } from "../../utils/Utils";
import Loader from "../../components/Loader";
import { BaseApiService } from "../../utils/BaseApiService";
import Snackbar from "../../components/Snackbar";
import { BaseStyle } from "../../utils/BaseStyle";
import PrimaryButton from "../../components/buttons/PrimaryButton";

const NewClient = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState(null);
  const [dob, setDOB] = useState(new Date());
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [loading, setLoading] = useState(false);

  const { selectedShop } = useContext(UserContext);

  const snackRef = useRef(null);

  const clearForm = () => {
    setFirstName("");
    setLastName("");
    setPhone1("");
    setPhone2("");
    setEmail("");
    setGender(null);
    setAddress("");
  };

  const handleSubmit = () => {
    setLoading(true);
    const payload = {
      id: 0,
      phoneNumber: phone1,
      fullName: firstName + " " + lastName,
      shopId: selectedShop?.id,
      dateOfBirth: convertToServerDate(dob),
      email,
      address,
      gender,
    };

    new BaseApiService("/clients-controller")
      .saveRequestWithJsonResponse(payload, false)
      .then((response) => {
        setLoading(false);
        clearForm();
        snackRef.current.show("Client details saved", 4000);
      })
      .catch((e) => {
        setLoading(false);

        snackRef.current.show(e?.message, 4000);
      });
  };

  return (
    <KeyboardAvoidingView
      enabled={true}
      behavior={"height"}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light }}>
        <AppStatusBar />
        <TopHeader title="Add Debtor" />
        <Loader loading={loading} />
        <View
          style={{
            marginVertical: 10,
            paddingHorizontal: 10,
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <View>
            <Text
              style={{
                marginTop: 10,
                fontSize: 16,
              }}
            >
              Client Details
            </Text>

            <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
              <MyInput
                label="First name"
                value={firstName}
                style={{ flex: 1 }}
                onValueChange={(text) => setFirstName(text)}
              />
              <MyInput
                label="Last name"
                value={lastName}
                style={{ flex: 1 }}
                onValueChange={(text) => setLastName(text)}
              />
            </View>

            <View style={{ flexDirection: "row", gap: 10, marginTop: 5 }}>
              <View style={{ flex: 1, gap: 5 }}>
                <Text>Gender</Text>
                <MyDropDown
                  search={false}
                  style={{
                    backgroundColor: Colors.light,
                    borderColor: Colors.dark,
                  }}
                  data={[
                    { id: 0, value: "Male" },
                    { id: 1, value: "Female" },
                  ]}
                  value={gender}
                  onChange={(e) => {
                    setGender(e.id);
                  }}
                  placeholder="Select "
                  labelField="value"
                  valueField="id"
                />
              </View>
              <View style={{ flex: 1 }}>
                <MyInput
                  label="Date of birth"
                  dateValue={dob}
                  isDateInput
                  onDateChange={(date) => setDOB(date)}
                />
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
              <MyInput
                inputMode="numeric"
                label="Phone number"
                value={phone1}
                style={{ flex: 1 }}
                onValueChange={(text) => setPhone1(text)}
              />
              <MyInput
                label="Alternate phone number"
                value={phone2}
                style={{ flex: 1 }}
                inputMode="numeric"
                onValueChange={(text) => setPhone2(text)}
              />
            </View>

            <MyInput
              label="Email"
              value={email}
              inputMode="email"
              onValueChange={(text) => setEmail(text)}
            />
            <MyInput
              label="Physical address"
              value={address}
              onValueChange={(text) => setAddress(text)}
            />
          </View>

          <View style={{ flexDirection: "row" }}>
            <PrimaryButton title={"Save"} onPress={handleSubmit} />
          </View>
        </View>

        <Snackbar ref={snackRef} />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default NewClient;
