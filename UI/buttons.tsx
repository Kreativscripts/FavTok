import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  disabled?: boolean;
  label?: string;
  size?: 'default' | 'small';
}

export const DownloadButton: React.FC<ButtonProps> = ({ onPress, disabled, label = 'Download Video', size = 'default' }) => (
  <TouchableOpacity
    style={[
      styles.downloadButton,
      size === 'small' && styles.smallButton,
      disabled && styles.disabledButton
    ]}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.7}
  >
    <Text style={[
      styles.downloadButtonText,
      size === 'small' && styles.smallButtonText
    ]}>
      {label}
    </Text>
  </TouchableOpacity>
);

export const ClearButton: React.FC<ButtonProps> = ({ onPress, disabled, label = 'Clear', size = 'default' }) => (
  <TouchableOpacity
    style={[
      styles.clearButton,
      size === 'small' && styles.smallButton,
      disabled && styles.disabledButton
    ]}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.7}
  >
    <Text style={[
      styles.clearButtonText,
      size === 'small' && styles.smallButtonText
    ]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  downloadButton: {
    backgroundColor: '#ff2d55',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 30,
    alignItems: 'center',
    flex: 0.48,
    shadowColor: '#ff2d55',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  clearButton: {
    backgroundColor: 'transparent',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 30,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#555',
    flex: 0.48,
  },
  smallButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  clearButtonText: {
    color: '#aaa',
    fontSize: 18,
    fontWeight: '600',
  },
  smallButtonText: {
    fontSize: 14,
  },
  disabledButton: {
    opacity: 0.5,
  },
});