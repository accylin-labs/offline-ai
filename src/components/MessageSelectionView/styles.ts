import {StyleSheet} from 'react-native';
import {MD3Theme} from 'react-native-paper';

export const getStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 16,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    headerText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.primary,
      flex: 1,
      textAlign: 'center',
    },
    contentText: {
      color: theme.colors.primary,
      fontSize: 16,
      lineHeight: 24,
      marginTop: 48,
    },
  });
