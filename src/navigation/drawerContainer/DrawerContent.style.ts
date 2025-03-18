import { StyleSheet } from "react-native";
import { colors } from "src/shared/theme/themes";

const drawerStyle = StyleSheet.create({
  container: {
    borderTopRightRadius: 34,
    borderBottomRightRadius: 34,
    backgroundColor: colors.secondary,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingStart: 15,
  },
  button: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    paddingHorizontal: 10,
  },

  drawerItem: {
    paddingStart: 20,
    paddingVertical: 13,
    width: "100%",
  },
  avatar: {
    height: 55,
    width: 55,
    borderRadius: 8,
    borderWidth: 3,
    overflow: "hidden",
  },
});
export default drawerStyle;
