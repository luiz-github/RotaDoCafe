import { StyleSheet } from "react-native";

export default StyleSheet.create({
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    fontSize: 18,
    fontWeight: "bold",
  },

  primaryButton: {
    backgroundColor: "#FFF",
  },

  secondaryButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 2,
    borderColor: "#FFF",
  },

  dangerButton: {
    backgroundColor: "#FF6B6B",
  },

  primaryText: {
    color: "#6F4E37",
  },

  secondaryText: {
    color: "#FFF",
  },

  dangerText: {
    color: "#FFF",
  },
});