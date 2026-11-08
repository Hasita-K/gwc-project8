import { Pressable, StyleSheet, Text } from "react-native";
import Icon from "./Icon";
import { colors, shadow } from "../theme";

type Props = {
  children: string;
  onPress: () => void;
  secondary?: boolean;
  showArrow?: boolean;
  height?: number;
};

export default function PrimaryButton({
  children,
  onPress,
  secondary = false,
  showArrow = false,
  height,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        secondary ? styles.secondary : styles.primary,
        height ? { minHeight: height } : null,
        pressed && { transform: [{ scale: 0.985 }], opacity: 0.9 },
      ]}
    >
      <Text style={[styles.text, secondary && { color: colors.primary }]}>
        {children}
      </Text>
      {showArrow && <Icon name="arrow" size={19} color={colors.white} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: "100%",
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    borderRadius: 17,
    paddingHorizontal: 20,
  },
  primary: {
    backgroundColor: colors.primary,
    ...shadow(0.2, 12, 6, 4),
  },
  secondary: {
    minHeight: 46,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
  },
  text: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
