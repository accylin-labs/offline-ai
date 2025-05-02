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
  const textColor = isDarkMode ? darkModeText : lightModeText;
  const glowColor = isDarkMode ? '#4a9fff' : '#0a5999'; // Glow color that matches the theme

  return StyleSheet.create({
    container: {
      marginVertical: 16, // Increased margin for better elevation appearance
      borderRadius: 20,
      overflow: 'hidden',
      backgroundColor: bubbleBackground,
      borderWidth: 0, // No border - we'll use the glowing border instead
      // Enhanced elevation and glow effects
      ...Platform.select({
        ios: {
          shadowColor: glowColor,
          shadowOffset: {width: 0, height: 2}, // Slight offset for better elevation
          shadowOpacity: 0.4, // Slightly reduced opacity for more subtle effect
          shadowRadius: 12, // Diffuse glow
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
    expandedContainer: {
      // Dynamic height based on content
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
      paddingVertical: 6, // Smaller padding for collapsed state
      alignItems: 'center', // Ensure vertical centering
    },
    headerText: {
      color: textColor, // Theme-specific text color
      //fontWeight: '600', // Bolder text
      //fontSize: 14,
      letterSpacing: 0.5,
      //opacity: 1, // Fully visible text
      //textShadowColor: glowColor, // Text glow
      //textShadowOffset: {width: 0, height: 0},
      //textShadowRadius: isDarkMode ? 3 : 0, // Only add glow in dark mode
      //marginStart: 0, // No margin for better alignment
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
      borderRadius: 0, // No border radius to avoid affecting the main border
    },
    borderGlow: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 20,
      borderWidth: 1, // Thin border
      borderColor: isDarkMode
        ? 'rgba(74, 140, 199, 0.6)'
        : 'rgba(10, 89, 153, 0.4)',
      backgroundColor: 'transparent',
    },
    // Very subtle glass effect - almost invisible
    glassBorder: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 20,
      borderWidth: 0.5,
      borderColor: isDarkMode
        ? 'rgba(74, 140, 199, 0.1)'
        : 'rgba(10, 89, 153, 0.1)',
      opacity: 0.3,
    },
    // Inner glow effect - very subtle
    innerGlow: {
      position: 'absolute',
      top: 1,
      left: 1,
      right: 1,
      bottom: 1,
      borderRadius: 19,
      borderWidth: 0,
      // Only add inner shadow in dark mode
      ...Platform.select({
        ios: {
          shadowColor: isDarkMode ? glowColor : 'transparent',
          shadowOffset: {width: 0, height: 0},
          shadowOpacity: isDarkMode ? 0.2 : 0,
          shadowRadius: 6,
        },
        android: {
          // No special effect for Android
        },
      }),
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
    // Secondary glow effect for depth
    secondaryGlow: {
      position: 'absolute',
      top: -3,
      left: -3,
      right: -3,
      bottom: -3,
      borderRadius: 23,
      borderWidth: 1,
      borderColor: isDarkMode ? '#3a7ac5' : '#84b6e0',
      opacity: 0.2,
    },
  });
};
