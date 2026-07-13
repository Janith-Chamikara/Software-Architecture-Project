import React, { useState } from "react";
import { TextInput, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { colors, radius, spacing } from "../theme/theme";

export default function AppInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize = "none",
  icon,
  hint,
  returnKeyType,
  onSubmitEditing,
  blurOnSubmit,
}) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(secureTextEntry);

  return (
    <View style={styles.container}>
      {label ? (
        <Text style={[styles.label, focused && styles.labelFocused]}>{label}</Text>
      ) : null}
      <View style={[styles.inputWrap, focused && styles.inputWrapFocused]}>
        {icon ? <Text style={styles.icon}>{icon}</Text> : null}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={hidden}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          blurOnSubmit={blurOnSubmit}
        />
        {secureTextEntry ? (
          <TouchableOpacity onPress={() => setHidden(!hidden)} style={styles.eyeBtn}>
            <Text style={styles.eye}>{hidden ? "👁" : "🙈"}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: 6,
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  labelFocused: {
    color: colors.primaryMid,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.input,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  inputWrapFocused: {
    borderColor: colors.primaryMid,
    backgroundColor: colors.card,
  },
  icon: {
    fontSize: 16,
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.text,
  },
  eyeBtn: {
    padding: 4,
    marginLeft: 8,
  },
  eye: {
    fontSize: 16,
  },
  hint: {
    marginTop: 5,
    fontSize: 12,
    color: colors.textMuted,
  },
});
