import React from "react";
import Colors from "../constants/Colors";
import OrientationLoadingOverlay from "react-native-orientation-loading-overlay";

const Loader = ({ loading }) => {
  return (
    <OrientationLoadingOverlay
      visible={loading}
      color={Colors.primary}
      indicatorSize="large"
      messageFontSize={24}
      message=""
    />
  );
};

export default Loader;
