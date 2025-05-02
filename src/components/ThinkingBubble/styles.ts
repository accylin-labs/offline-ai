import {StyleSheet, Platform} from 'react-native';
import {Theme} from '../../utils/types';

export const createStyles = (theme: Theme) => {
  // Dark mode colors
  const darkModeBackground = '#142e4d'; // Deep blue background for dark mode
  const darkModeText = '#6abaff'; // More subtle blue text for dark mode

  // Light mode colors
  const lightModeBackground = '#f0f5fa'; // Light blue-gray background
  const lightModeText = '#0a5999'; // Darker blue text for contrast

  const isDarkMode = theme.dark;

  const bubbleBackground = isDarkMode
    ? darkModeBackground
    : lightModeBackground;
  const bubbleBorderColor = isDarkMode
    ? 'rgba(74, 140, 199, 0.6)'
    : 'rgba(10, 89, 153, 0.4)';
  const textColor = isDarkMode ? darkModeText : lightModeText;
  const shadowColor = isDarkMode ? '#4a9fff' : '#0a5999'; // Glow color that matches the theme

  return StyleSheet.create({
    shadowContainer: {
      ...Platform.select({
        ios: {
          shadowColor: shadowColor,
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.4,
          shadowRadius: 12,
        },
        android: {
          // No need here, shadows come from elevation in the inner container
        },
      }),
    },
    container: {
      marginVertical: 16, // Increased margin for better elevation appearance
      borderRadius: 20,
      overflow: 'hidden',
      backgroundColor: bubbleBackground,
      borderWidth: 1,
      borderColor: bubbleBorderColor,
      // Platform-specific styles to ensure consistent layout behavior
      ...Platform.select({
        ios: {
          // No need here, shadows come from parrent container - overflow: 'hidden', will hide the shadow
        },
        android: {
          elevation: 8, // Moderate elevation
        },
      }),
    },
    collapsedContainer: {
      height: 30, // Reduced height for more compact appearance
      width: 140,
      alignSelf: 'flex-start',
      opacity: 0.65, // Slightly reduced opacity
      justifyContent: 'center',
      // Reduced shadow/elevation for collapsed state
      ...Platform.select({
        ios: {
          shadowOpacity: 0.2, // Reduced shadow
          shadowRadius: 6, // Smaller shadow radius
        },
        android: {
          elevation: 1, // Reduced elevation
        },
      }),
    },
    partialContainer: {
      height: 150,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderBottomWidth: 0,
      backgroundColor: 'transparent',
    },
    collapsedHeaderContainer: {
      paddingHorizontal: 14,
      paddingVertical: 6,
      alignItems: 'center',
    },
    headerText: {
      color: textColor,
      letterSpacing: 0.5,
    },
    chevronContainer: {
      width: 28,
      height: 28,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 14,
      backgroundColor: isDarkMode
        ? 'rgba(74, 140, 199, 0.15)'
        : 'rgba(10, 89, 153, 0.1)',
      borderWidth: 1,
      borderColor: isDarkMode
        ? 'rgba(74, 140, 199, 0.3)'
        : 'rgba(10, 89, 153, 0.2)',
    },
    collapsedChevronContainer: {
      width: 20,
      height: 20,
      borderRadius: 10,
    },
    contentContainer: {
      paddingHorizontal: 16,
      paddingBottom: 16,
      backgroundColor: 'transparent',
      borderRadius: 0,
    },
    // Absolute fill style for BlurView
    absoluteFill: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    maskedContentContainer: {
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 0,
    },
    maskElementContainer: {
      flex: 1,
    },
    maskGradient: {
      height: 30,
      width: '100%',
    },
    maskSolid: {
      flex: 1,
      backgroundColor: 'black',
    },
  });
};
