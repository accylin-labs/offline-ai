import {StyleSheet} from 'react-native';
import {Theme} from '../../utils/types';

export const createStyles = ({theme}: {theme: Theme}) =>
  StyleSheet.create({
    container: {
      height: 250,
      backgroundColor: '#000',
      borderRadius: 12,
      overflow: 'hidden',
      marginHorizontal: 16,
      marginVertical: 8,
      zIndex: 1,
    },
    camera: {
      flex: 1,
    },
    controlsContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    closeButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    closeButtonText: {
      color: '#fff',
      fontSize: 14,
    },
    flipButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    flipButtonText: {
      color: '#fff',
      fontSize: 14,
    },
    permissionContainer: {
      height: 250,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      marginHorizontal: 16,
      marginVertical: 8,
      zIndex: 1,
    },
    permissionText: {
      color: theme.colors.onBackground,
      fontSize: 16,
      marginBottom: 20,
      textAlign: 'center',
      paddingHorizontal: 20,
    },
    intervalControlsContainer: {
      position: 'absolute',
      top: 16,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    intervalLabel: {
      color: '#fff',
      fontSize: 12,
      marginRight: 8,
    },
    intervalValue: {
      color: '#fff',
      fontSize: 12,
      marginHorizontal: 8,
      minWidth: 30,
      textAlign: 'center',
    },
    intervalButton: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    intervalButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
