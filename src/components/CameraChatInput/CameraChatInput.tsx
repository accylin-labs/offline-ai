import * as React from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  Animated,
  TouchableOpacity,
} from 'react-native';

import {observer} from 'mobx-react';
import {Text} from 'react-native-paper';

import {useTheme} from '../../hooks';
import Color from 'tinycolor2';
import {createStyles} from './styles';

import {chatSessionStore, modelStore, palStore, uiStore} from '../../store';

import {L10nContext} from '../../utils';

import {CircularActivityIndicatorProps} from '..';

export interface CameraChatInputTopLevelProps {
  /** Whether the AI is currently streaming tokens */
  isStreaming?: boolean;
  /** Whether the camera is active */
  isCameraActive?: boolean;
  /** Will be called when the start button is pressed */
  onStartPress: () => void;
  /** Will be called when the stop button is pressed */
  onStopPress?: () => void;
  /** Called when the Pal button is pressed */
  onPalBtnPress?: () => void;
  /** Whether the picker is visible */
  isPickerVisible?: boolean;
  /** Background color for the input */
  inputBackgroundColor?: string;
}

export interface CameraChatInputAdditionalProps {
  /** Props for the circular activity indicator shown when attachment is uploading */
  attachmentCircularActivityIndicatorProps?: CircularActivityIndicatorProps;
  /** Height of the chat input */
  chatInputHeight?: {height: number};
  /** Text input props */
  textInputProps?: TextInputProps;
}

export type CameraChatInputProps = CameraChatInputTopLevelProps &
  CameraChatInputAdditionalProps;

/** Modified chat input component for CameraPal that shows start/stop buttons instead of send */
export const CameraChatInput = observer(
  ({
    isStreaming = false,
    isCameraActive = false,
    onStartPress,
    onStopPress,
    onPalBtnPress,
    isPickerVisible,
    textInputProps,
    inputBackgroundColor,
  }: CameraChatInputProps) => {
    const l10n = React.useContext(L10nContext);
    const theme = useTheme();
    const inputRef = React.useRef<TextInput>(null);
    const iconRotation = React.useRef(new Animated.Value(0)).current;

    const activePal = React.useMemo(() => {
      if (chatSessionStore.activePalId) {
        return palStore.pals.find(p => p.id === chatSessionStore.activePalId);
      }
      return undefined;
    }, []);

    const hasActiveModel = !!modelStore.context;

    React.useEffect(() => {
      Animated.timing(iconRotation, {
        toValue: isPickerVisible ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }, [isPickerVisible, iconRotation]);

    const isBackgroundLight = Color(inputBackgroundColor).isLight();
    const inputTextColor = isBackgroundLight ? '#333333' : '#DADDE6';
    const buttonTextColor = theme.colors.primary;

    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <View style={styles.inputWrapper}>
              <TouchableOpacity
                style={[
                  styles.palBtn,
                  {
                    backgroundColor:
                      uiStore.colorScheme === 'dark'
                        ? theme.colors.inverseOnSurface
                        : theme.colors.inverseSurface,
                  },
                  activePal?.color && {
                    backgroundColor: activePal?.color?.[0],
                  },
                ]}
                onPress={onPalBtnPress}>
                <Animated.View
                  style={{
                    transform: [
                      {
                        rotate: iconRotation.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '180deg'],
                        }),
                      },
                    ],
                  }}>
                  <Text style={{color: theme.colors.onSurface}}>▼</Text>
                </Animated.View>
              </TouchableOpacity>
              <View style={styles.inputInnerContainer}>
                {activePal?.name && hasActiveModel && (
                  <Text
                    style={[
                      styles.palNameWrapper,
                      {
                        color: activePal.color?.[0],
                      },
                    ]}>
                    Pal:{' '}
                    <Text
                      style={[
                        styles.palName,
                        {
                          color: activePal.color?.[0],
                        },
                      ]}>
                      {activePal?.name}
                    </Text>
                  </Text>
                )}
                <TextInput
                  ref={inputRef}
                  multiline
                  key={inputTextColor}
                  placeholder={l10n.camera.analyzing}
                  placeholderTextColor={inputTextColor}
                  underlineColorAndroid="transparent"
                  editable={false}
                  {...textInputProps}
                  style={[
                    styles.input,
                    textInputProps?.style,
                    {
                      color: inputTextColor,
                    },
                  ]}
                />
              </View>
              {!isCameraActive && !isStreaming ? (
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    {backgroundColor: buttonTextColor},
                  ]}
                  onPress={onStartPress}>
                  <Text style={styles.actionButtonText}>
                    {l10n.camera.startCamera}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    {backgroundColor: theme.colors.error},
                  ]}
                  onPress={onStopPress}>
                  <Text style={styles.actionButtonText}>
                    {l10n.camera.stopCamera}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  },
);

const styles = createStyles();
