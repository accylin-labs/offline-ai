import {StyleSheet} from 'react-native';

import {Theme} from '../../utils/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      padding: 16,
    },
    scrollViewContent: {
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
    card: {
      marginVertical: 8,
      borderRadius: 12,
      backgroundColor: theme.colors.surface,
    },
    settingItemContainer: {
      marginVertical: 8,
    },
    switchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 8,
    },
    textContainer: {
      flex: 1,
      marginRight: 16,
    },
    textLabel: {
      color: theme.colors.onSurface,
    },
    textDescription: {
      color: theme.colors.onSurfaceVariant,
      marginTop: 4,
    },
    nGPUSlider: {
      marginTop: 1,
    },
    textInput: {
      marginVertical: 8,
      //backgroundColor: theme.colors.surface,
    },
    invalidInput: {
      borderColor: theme.colors.error,
      borderWidth: 1,
    },
    errorText: {
      color: theme.colors.error,
      marginTop: 4,
    },
    menuContainer: {
      position: 'relative',
    },
    menuButton: {
      //backgroundColor: theme.colors.surface,
      minWidth: 100,
    },
    buttonContent: {
      flexDirection: 'row-reverse',
    },
  });
