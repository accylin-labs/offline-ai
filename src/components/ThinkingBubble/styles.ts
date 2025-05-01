import {StyleSheet, Dimensions, Platform} from 'react-native';
import {Theme} from '../../utils/types';

const {width} = Dimensions.get('window');

export const createStyles = (theme: Theme) => {
  // Create a sophisticated holographic color palette with specific colors
  // Dark mode colors (as specified)
  const darkModeBackground = '#142e4d'; // Deep blue background for dark mode
  const darkModeText = '#6abaff'; // Light blue text for dark mode

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
      height: 48,
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
    headerText: {
      color: textColor, // Theme-specific text color
      fontWeight: '600', // Bolder text
      fontSize: 14,
      letterSpacing: 0.5,
      opacity: 1, // Fully visible text
      textShadowColor: glowColor, // Text glow
      textShadowOffset: {width: 0, height: 0},
      textShadowRadius: isDarkMode ? 3 : 0, // Only add glow in dark mode
    },
    chevronContainer: {
      width: 28,
      height: 28,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 14,
      backgroundColor: isDarkMode
        ? 'rgba(106, 186, 255, 0.15)'
        : 'rgba(10, 89, 153, 0.1)', // Theme-specific background
      borderWidth: 1,
      borderColor: isDarkMode
        ? 'rgba(106, 186, 255, 0.3)'
        : 'rgba(10, 89, 153, 0.2)', // Theme-specific border
    },
    contentContainer: {
      paddingHorizontal: 16,
      paddingTop: 6, // Reduced top padding to bring content closer to title
      paddingBottom: 16,
      backgroundColor: 'transparent', // No background - let the container background show
    },
    contentText: {
      color: textColor, // Theme-specific text color
      fontSize: 14,
      lineHeight: 20,
      opacity: 1, // Fully visible text
      // Only add shadow in dark mode
      ...(isDarkMode
        ? {
            textShadowColor: 'rgba(0, 0, 0, 0.5)',
            textShadowOffset: {width: 0, height: 1},
            textShadowRadius: 2,
          }
        : {}),
    },
    // Glowing border container
    shimmerContainer: {
      position: 'absolute',
      top: -2, // Extend beyond the container for glow effect
      left: -2,
      right: -2,
      bottom: -2,
      overflow: 'hidden',
      borderRadius: 22, // Slightly larger to accommodate the glow
    },
    // Thin border with glow
    shimmer: {
      position: 'absolute',
      width: width * 3,
      height: width * 3,
      backgroundColor: 'transparent',
      // Diagonal gradient will be applied in the component
    },
    // Border outline that will glow - theme specific
    borderGlow: {
      position: 'absolute',
      top: 2, // Position to align with the container
      left: 2,
      right: 2,
      bottom: 2,
      borderRadius: 20,
      borderWidth: 1, // Thin border
      borderColor: isDarkMode
        ? 'rgba(106, 186, 255, 0.6)'
        : 'rgba(10, 89, 153, 0.4)', // Theme-specific border
      backgroundColor: 'transparent', // Transparent background to allow shimmer to show through
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
        ? 'rgba(106, 186, 255, 0.1)'
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
    // Blur overlay (simulated) - theme specific
    blurOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: isDarkMode
        ? 'rgba(0, 10, 30, 0.1)' // Dark mode - subtle dark overlay
        : 'rgba(255, 255, 255, 0.05)', // Light mode - subtle light overlay
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
