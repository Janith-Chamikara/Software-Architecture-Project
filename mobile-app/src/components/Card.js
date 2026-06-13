import React from "react";
import { View, StyleSheet } from "react-native";
import { colors, radius, spacing, shadow } from "../theme/theme";

export default function Card({ children, style, variant = "default" }) {
  const cardStyle = variant === "flat"
    ? [styles.card, styles.flat, style]
    : variant === "highlight"
    ? [styles.card, styles.highlight, style]
    : [styles.card, style];

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.md,
  },
  flat: {
    ...shadow.sm,
    borderColor: colors.divider,
  },
  highlight: {
    borderColor: colors.primaryLight,
    backgroundColor: colors.primaryLight,
    ...shadow.sm,
  },
});
