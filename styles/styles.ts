import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 50,
  },
  input: {
    height: 60,
    borderWidth: 2,
    padding: 10,
    width: "100%",
    borderRadius: 100,
    color: "white",
    borderColor: "#ffffffac",
  },
  inputContainer: {
    backgroundColor: "#1c1c1e",
    width: "100%",
    padding: 10,
    height: "auto",
  },
  dropdown: {
    width: "100%",
    backgroundColor: "#1c1c1e",
    color: "white",
    flex: 1,
    justifyContent: "center",
  },
  flat: {
    borderWidth: 1,
    padding: 10,
    height: 40,
  },
  list: {
    fontSize: 16,
    minHeight: "auto",
    alignSelf: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: 200,
  },
  imagePic: {
    color: "white",
    alignSelf: "center",
  },
  error: {
    color: "white",
    justifyContent: "center",
    alignSelf: "center",
    fontSize: 16,
    fontWeight: 200,
  },
});
