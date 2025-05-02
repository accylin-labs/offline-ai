import React, {useState, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  Animated,
  Easing,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import {Text} from 'react-native-paper';

import {useTheme} from '../../hooks';
import {createStyles} from './styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {BlurView} from '@react-native-community/blur';

// Enable LayoutAnimation for Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

enum BubbleState {
  COLLAPSED = 'collapsed',
  PARTIAL = 'partial',
  EXPANDED = 'expanded',
}

interface ThinkingBubbleProps {
  children?: React.ReactNode;
}

export const ThinkingBubble: React.FC<ThinkingBubbleProps> = ({children}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [bubbleState, setBubbleState] = useState<BubbleState>(
    BubbleState.PARTIAL,
  );

  const chevronRotation = useRef(new Animated.Value(0)).current;

  const toggleState = () => {
    const isCollapsingTransition =
      bubbleState === BubbleState.EXPANDED ||
      bubbleState === BubbleState.PARTIAL;

    if (isCollapsingTransition) {
      // When collapsing, use a spring animation with bounce
      LayoutAnimation.configureNext({
        duration: 450, // Longer duration
        create: {
          type: LayoutAnimation.Types.spring,
          property: LayoutAnimation.Properties.opacity,
          springDamping: 0.7, // Less damping for more bounce
        },
        update: {
          type: LayoutAnimation.Types.spring, // Bring back the spring for collapse
          springDamping: 0.7, // Less damping for more bounce
          initialVelocity: 0.5, // Higher initial velocity for more spring effect
        },
        delete: {
          type: LayoutAnimation.Types.spring,
          property: LayoutAnimation.Properties.opacity,
          springDamping: 0.7,
        },
      });
    } else {
      // When expanding, use a slower, more gradual animation
      LayoutAnimation.configureNext({
        duration: 500, // Much longer duration for smoother expansion
        create: {
          type: LayoutAnimation.Types.easeInEaseOut,
          property: LayoutAnimation.Properties.opacity,
          //delay: 100, // Delay creation slightly
        },
        update: {
          type: LayoutAnimation.Types.spring,
          springDamping: 0.85, // Higher damping for less bounce
          initialVelocity: 0.3, // Lower initial velocity for gentler start
        },
      });
    }

    // Update state
    switch (bubbleState) {
      case BubbleState.COLLAPSED:
        setBubbleState(BubbleState.PARTIAL);
        animateChevron(90);
        break;
      case BubbleState.PARTIAL:
        setBubbleState(BubbleState.EXPANDED);
        animateChevron(180);
        break;
      case BubbleState.EXPANDED:
        setBubbleState(BubbleState.COLLAPSED);
        animateChevron(0);
        break;
    }
  };

  // Animate chevron rotation with spring effect for collapsing
  const animateChevron = (toValue: number) => {
    // Determine if we're rotating to collapsed state (0 degrees)
    const isCollapsingRotation = toValue === 0;

    if (isCollapsingRotation) {
      // Use spring animation for collapsing to match the layout spring
      Animated.spring(chevronRotation, {
        toValue,
        friction: 8, // Lower friction for more bounce
        tension: 40, // Lower tension for more natural spring
        useNativeDriver: true,
      }).start();
    } else {
      // Use timing for expanding for more control
      Animated.timing(chevronRotation, {
        toValue,
        duration: 600, // Match the layout animation duration
        easing: Easing.bezier(0.2, 0, 0.2, 1), // Material standard for expand
        useNativeDriver: true,
      }).start();
    }
  };

  // Chevron rotation for each state
  const chevronRotationDeg = chevronRotation.interpolate({
    inputRange: [0, 90, 180],
    outputRange: ['0deg', '90deg', '180deg'],
  });

  const containerStyle = [
    styles.container,
    bubbleState === BubbleState.COLLAPSED && styles.collapsedContainer,
    bubbleState === BubbleState.PARTIAL && styles.partialContainer,
    bubbleState === BubbleState.EXPANDED && styles.expandedContainer,
  ];

  const isScrollable = bubbleState === BubbleState.PARTIAL;

  const isContentVisible = bubbleState !== BubbleState.COLLAPSED;

  // Scale animation for chevron on tap
  const chevronScale = useRef(new Animated.Value(1)).current;

  // Animate chevron scale on state change
  const animateChevronScale = () => {
    // Determine if we're transitioning to collapsed state
    const isCollapsingTransition =
      bubbleState === BubbleState.EXPANDED ||
      bubbleState === BubbleState.PARTIAL;

    if (isCollapsingTransition) {
      // More spring-like scale effect when collapsing
      Animated.sequence([
        Animated.timing(chevronScale, {
          toValue: 1.2, // Moderate scale
          duration: 200, // Slightly faster for more responsive feel
          easing: Easing.out(Easing.cubic), // Cubic easing for quick expansion
          useNativeDriver: true,
        }),
        Animated.spring(chevronScale, {
          toValue: 1,
          friction: 7, // Lower friction for more bounce
          tension: 40, // Lower tension for more natural spring
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Very subtle scale effect when expanding
      Animated.sequence([
        Animated.timing(chevronScale, {
          toValue: 1.1, // Smaller scale change
          duration: 250, // Longer duration
          easing: Easing.bezier(0.4, 0, 0.2, 1), // Material standard
          useNativeDriver: true,
        }),
        Animated.timing(chevronScale, {
          toValue: 1,
          duration: 350, // Much longer duration for smoother return
          easing: Easing.bezier(0, 0, 0.2, 1), // Material standard
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => {
        toggleState();
        animateChevronScale();
      }}>
      <View style={containerStyle}>
        {/* Secondary glow effect for depth */}
        <View style={styles.secondaryGlow} />

        {/* Blur effect - theme specific */}
        <BlurView
          style={styles.absoluteFill}
          blurType={theme.dark ? 'dark' : 'light'}
          blurAmount={32}
          reducedTransparencyFallbackColor="rgba(10, 10, 20, 0.8)"
        />

        {/* Inner glow effect */}
        <View style={styles.innerGlow} />

        {/* Simple border without shimmer */}
        <View style={styles.borderGlow} />

        {/* Glass border effect - under the shimmer */}
        <View style={styles.glassBorder} />

        {/* Header */}
        <View
          style={[
            styles.headerContainer,
            bubbleState === BubbleState.COLLAPSED &&
              styles.collapsedHeaderContainer,
          ]}>
          <Text variant="titleSmall" style={styles.headerText}>
            Reasoning
          </Text>
          <Animated.View
            style={[
              styles.chevronContainer,
              bubbleState === BubbleState.COLLAPSED &&
                styles.collapsedChevronContainer, // Smaller chevron in collapsed state
              {
                transform: [
                  {rotate: chevronRotationDeg},
                  {scale: chevronScale},
                ],
              },
            ]}>
            <Icon
              name="chevron-down"
              size={bubbleState === BubbleState.COLLAPSED ? 16 : 18} // Smaller icon in collapsed state
              color={theme.dark ? '#4a8cc7' : '#0a5999'} // Theme-specific color
            />
          </Animated.View>
        </View>

        {/* Content */}
        {isContentVisible &&
          (isScrollable ? (
            <ScrollView
              style={styles.contentContainer}
              showsVerticalScrollIndicator={false}>
              {children}
            </ScrollView>
          ) : (
            <View style={styles.contentContainer}>{children}</View>
          ))}
      </View>
    </TouchableOpacity>
  );
};
