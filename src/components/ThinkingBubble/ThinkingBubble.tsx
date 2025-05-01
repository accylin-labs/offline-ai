import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import {useTheme} from '../../hooks';
import {createStyles} from './styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Try to import BlurView if available
let BlurView: any = null;
try {
  BlurView = require('@react-native-community/blur').BlurView;
} catch (e) {
  // BlurView is not available, we'll use a fallback
}

// Enable LayoutAnimation for Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Define the three states
enum BubbleState {
  COLLAPSED = 'collapsed',
  PARTIAL = 'partial',
  EXPANDED = 'expanded',
}

interface ThinkingBubbleProps {
  text: string;
  children?: React.ReactNode;
}

export const ThinkingBubble: React.FC<ThinkingBubbleProps> = ({
  text,
  children,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  // State management
  const [bubbleState, setBubbleState] = useState<BubbleState>(
    BubbleState.PARTIAL,
  );

  // Animation values
  const chevronRotation = useRef(new Animated.Value(0)).current;
  const shimmerPosition = useRef(new Animated.Value(-300)).current;
  const contentOpacity = useRef(new Animated.Value(1)).current;

  // Animate shimmer effect - elegant border shimmer (8 seconds loop)
  useEffect(() => {
    // Reset position before starting animation
    shimmerPosition.setValue(-300);

    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmerPosition, {
        toValue: 300,
        duration: 8000, // Even slower for more elegance (8 seconds)
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    shimmerAnimation.start();

    return () => {
      shimmerAnimation.stop();
    };
  }, [shimmerPosition]);

  // Handle state transitions
  const toggleState = () => {
    // Animate content opacity
    Animated.sequence([
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 150,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Configure layout animation
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

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

  // Animate chevron rotation
  const animateChevron = (toValue: number) => {
    Animated.timing(chevronRotation, {
      toValue,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  // Calculate chevron rotation for each state
  const chevronRotationDeg = chevronRotation.interpolate({
    inputRange: [0, 90, 180],
    outputRange: ['0deg', '90deg', '180deg'],
  });

  // Determine container style based on state
  const containerStyle = [
    styles.container,
    bubbleState === BubbleState.COLLAPSED && styles.collapsedContainer,
    bubbleState === BubbleState.PARTIAL && styles.partialContainer,
    bubbleState === BubbleState.EXPANDED && styles.expandedContainer,
  ];

  // Determine if content should be scrollable
  const isScrollable = bubbleState === BubbleState.PARTIAL;

  // Determine if content should be visible
  const isContentVisible = bubbleState !== BubbleState.COLLAPSED;

  // Scale animation for chevron on tap
  const chevronScale = useRef(new Animated.Value(1)).current;

  // Animate chevron scale on state change
  const animateChevronScale = () => {
    Animated.sequence([
      Animated.timing(chevronScale, {
        toValue: 1.2,
        duration: 150,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(chevronScale, {
        toValue: 1,
        duration: 150,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
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

        {/* Blur effect if available */}
        {BlurView ? (
          <BlurView
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            blurType="light"
            blurAmount={55} // Increased blur amount
            reducedTransparencyFallbackColor="rgba(10, 10, 20, 0.8)"
          />
        ) : (
          <View style={styles.blurOverlay} />
        )}

        {/* Inner glow effect */}
        <View style={styles.innerGlow} />

        {/* Thin border with shimmering glow effect - only on the border */}
        <View style={styles.shimmerContainer}>
          {/* Thin border that will have the glow effect */}
          <View style={styles.borderGlow} />
        </View>

        {/* Glass border effect - under the shimmer */}
        <View style={styles.glassBorder} />

        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Reasoning</Text>
          <Animated.View
            style={[
              styles.chevronContainer,
              {
                transform: [
                  {rotate: chevronRotationDeg},
                  {scale: chevronScale},
                ],
              },
            ]}>
            <Icon
              name="chevron-down"
              size={18}
              color={theme.dark ? '#6abaff' : '#0a5999'} // Theme-specific color
            />
          </Animated.View>
        </View>

        {/* Content */}
        {isContentVisible && (
          <Animated.View style={{opacity: contentOpacity}}>
            {isScrollable ? (
              <ScrollView
                style={styles.contentContainer}
                showsVerticalScrollIndicator={false}>
                <Text style={styles.contentText}>{text}</Text>
                {children}
              </ScrollView>
            ) : (
              <View style={styles.contentContainer}>
                <Text style={styles.contentText}>{text}</Text>
                {children}
              </View>
            )}
          </Animated.View>
        )}
      </View>
    </TouchableOpacity>
  );
};
