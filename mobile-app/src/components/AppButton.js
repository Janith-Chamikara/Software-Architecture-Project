import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from "react-native";
import { colors, radius, spacing } from "../theme/theme";

export default function AppButton({ title, onPress, loading, variant = "primary", disabled, icon }) {
  const getStyle = () => {
    if (disabled || loading) return [styles.base, styles.disabled];
    if (variant === "accent") return [styles.base, styles.accent];
    if (variant === "outline") return [styles.base, styles.outline];
    if (variant === "danger") return [styles.base, styles.danger];
    if (variant === "ghost") return [styles.base, styles.ghost];
    if (variant === "success") return [styles.base, styles.success];
    return [styles.base, styles.primary];
  };

  const getTextStyle = () => {
    if (variant === "outline") return [styles.text, styles.outlineText];
    if (variant === "ghost") return [styles.text, styles.ghostText];
    return [styles.text];
  };

  return (
    <TouchableOpacity
      style={getStyle()}
      onPress={onPress}
      disabled={loading || disabled}
      activeOpacity={0.82}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" || variant === "ghost" ? colors.primary : colors.textLight}
          size="small"
        />
      ) : (
        <View style={styles.inner}>
          {icon ? <Text style={styles.icon}>{icon}</Text> : null}
          <Text style={getTextStyle()}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 16,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 6,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  accent: {
    backgroundColor: colors.accent,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  success: {
    backgroundColor: colors.success,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  disabled: {
    backgroundColor: colors.textMuted,
    opacity: 0.6,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  text: {
    color: colors.textLight,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  outlineText: {
    color: colors.primary,
  },
  ghostText: {
    color: colors.primary,
  },
  icon: {
    fontSize: 16,
  },
});
