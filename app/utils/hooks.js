import { Dimensions, useWindowDimensions } from "react-native";
import { getHeaderHeight, getHeaderSafeAreaHeight, getOrientation} from '../services/sizeHelper';
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Platform.OS === "ios"
    ? Dimensions.get("window").height
    : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");

export const useWidth = () => {
	return useWindowDimensions().width;
};

export const useHeight = () => {
	return useWindowDimensions().height;
};