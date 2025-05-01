import {StyleSheet, Platform} from 'react-native';
import {Theme} from '../../utils/types';

export const createStyles = (theme: Theme) => {
  // Create a sophisticated holographic color palette with specific colors
  // Dark mode colors (as specified)
  const darkModeBackground = '#142e4d'; // Deep blue background for dark mode
  const darkModeText = '#6abaff'; // More subtle blue text for dark mode

  // Light mode colors (complementary to dark mode)
  const lightModeBackground = '#f0f5fa'; // Light blue-gray background
  const lightModeText = '#0a5999'; // Darker blue text for contrast

  // Determine if we're in dark mode
  const isDarkMode = theme.colors.background === '#000000' || theme.dark;

  // Set colors based on theme
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
      backgroundColor: bubbleBackground, // Use our theme-specific background color
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
      height: 40, // Reduced height for more compact appearance
      width: '70%', // Take up less horizontal space
      alignSelf: 'flex-start', // Align to the left
      opacity: 0.85, // Slightly reduced opacity
      justifyContent: 'center', // Center content vertically
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
      paddingVertical: 8, // Reduced vertical padding
      borderBottomWidth: 0, // Removed separator line
      backgroundColor: 'transparent', // Transparent background to match content area
    },
    collapsedHeaderContainer: {
      paddingHorizontal: 12, // Smaller padding for collapsed state
      paddingVertical: 6, // Smaller padding for collapsed state
      alignItems: 'center', // Ensure vertical centering
    },
    headerText: {
      color: textColor, // Theme-specific text color
      fontWeight: '600', // Bolder text
      fontSize: 14,
      letterSpacing: 0.5,
      opacity: 1, // Fully visible text
      textShadowColor: glowColor, // Text glow
      textShadowOffset: {width: 0, height: 0},
      textShadowRadius: isDarkMode ? 3 : 0, // Only add glow in dark mode
      marginStart: 2, // No margin for better alignment
    },
    chevronContainer: {
      width: 28,
      height: 28,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 14,
      backgroundColor: isDarkMode
        ? 'rgba(74, 140, 199, 0.15)'
        : 'rgba(10, 89, 153, 0.1)', // Theme-specific background
      borderWidth: 1,
      borderColor: isDarkMode
        ? 'rgba(74, 140, 199, 0.3)'
        : 'rgba(10, 89, 153, 0.2)', // Theme-specific border
    },
    contentContainer: {
      paddingHorizontal: 16,
      paddingTop: 6, // Reduced top padding to bring content closer to title
      paddingBottom: 16,
      backgroundColor: 'transparent', // No background - let the container background show
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
        : 'rgba(10, 89, 153, 0.4)', // Theme-specific border
      backgroundColor: 'transparent', // Transparent background
    },
    // Very subtle glass effect - almost invisible
    glassBorder: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 20,
      borderWidth: 0.5, // Very thin inner border
      borderColor: isDarkMode
        ? 'rgba(74, 140, 199, 0.1)'
        : 'rgba(10, 89, 153, 0.1)', // Very subtle theme-specific border
      opacity: 0.3, // Very subtle opacity
    },
    // Inner glow effect - very subtle
    innerGlow: {
      position: 'absolute',
      top: 1,
      left: 1,
      right: 1,
      bottom: 1,
      borderRadius: 19,
      borderWidth: 0, // No border
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
    // Secondary glow effect for depth
    secondaryGlow: {
      position: 'absolute',
      top: -3,
      left: -3,
      right: -3,
      bottom: -3,
      borderRadius: 23,
      borderWidth: 1,
      borderColor: isDarkMode ? '#3a7ac5' : '#84b6e0', // Secondary glow color based on theme
      opacity: 0.2,
    },
  });
};
