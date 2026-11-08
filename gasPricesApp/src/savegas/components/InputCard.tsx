import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Icon, { type IconName } from "./Icon";
import { colors, shadow } from "../theme";

type Props = {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  icon?: IconName;
  type?: "text" | "number";
  suffix?: string;
};

export default function InputCard({
  label,
  value,
  onChange,
  icon,
  type = "text",
  suffix,
}: Props) {
  // keep the raw text locally so typing "28." or clearing the box feels natural
  const [text, setText] = useState(String(value));

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {icon && (
          <View style={styles.icon}>
            <Icon name={icon} size={20} color={colors.primary} />
          </View>
        )}
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={(t) => {
            setText(t);
            onChange(t);
          }}
          keyboardType={type === "number" ? "decimal-pad" : "default"}
          placeholderTextColor={colors.muted}
        />
        {suffix && <Text style={styles.suffix}>{suffix}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(226,232,227,0.9)",
    borderRadius: 20,
    backgroundColor: colors.white,
    paddingVertical: 14,
    paddingHorizontal: 15,
    ...shadow(0.05, 10, 3, 1),
  },
  label: {
    marginBottom: 9,
    color: colors.muted,
    fontSize: 12,
    fontWeight: "600",
  },
  row: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    backgroundColor: colors.primaryPale,
    paddingHorizontal: 13,
  },
  icon: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    minWidth: 0,
    color: colors.ink,
    fontSize: 16,
    fontWeight: "600",
    paddingVertical: 0,
  },
  suffix: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "600",
  },
});
