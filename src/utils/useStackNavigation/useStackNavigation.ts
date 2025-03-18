// This code is the function to be used as custom hook for stack navigation in the main stack.
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack/lib/typescript/src/types";

const useStackNavigation = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return navigation;
};

export default useStackNavigation;