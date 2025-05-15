import React, {useState, useCallback, useContext, useEffect} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {observer} from 'mobx-react';
import {ChatView, VideoView} from '../../components';
import {useTheme} from '../../hooks';
import {L10nContext, UserContext} from '../../utils';
import {modelStore, palStore} from '../../store';
import 'react-native-get-random-values';
import {user as defaultUser} from '../../utils/chat';
import {PalType} from '../../components/PalsSheets/types';
import {VideoPal} from '../../store/PalStore';

export const VideoPalScreen = observer(() => {
  const theme = useTheme();
  const l10n = useContext(L10nContext);

  const contextUser = useContext(UserContext);
  const user = contextUser || defaultUser;

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImagePath, setCapturedImagePath] = useState<string | null>(
    null,
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [promptText, setPromptText] = useState(
    'What do you see in this video stream?',
  );
  const [captureInterval, setCaptureInterval] = useState(1000); // Default to 1 second
  const [lastAnalysisTime, setLastAnalysisTime] = useState(0);

  // Get the active VideoPal to access its captureInterval setting
  const activeVideoPal = React.useMemo(() => {
    if (palStore.pals.length > 0) {
      const videoPal = palStore.pals.find(p => p.palType === PalType.VIDEO) as
        | VideoPal
        | undefined;

      if (videoPal) {
        return videoPal;
      }
    }
    return undefined;
  }, []);

  // Initialize captureInterval from the active VideoPal
  useEffect(() => {
    if (activeVideoPal?.captureInterval) {
      setCaptureInterval(activeVideoPal.captureInterval);
    }
  }, [activeVideoPal]);

  // Initialize the model with the projection model if needed
  useEffect(() => {
    if (
      activeVideoPal &&
      !modelStore.activeModel &&
      activeVideoPal.defaultModel
    ) {
      const palDefaultModel = modelStore.availableModels.find(
        m => m.id === activeVideoPal.defaultModel?.id,
      );

      if (palDefaultModel) {
        console.log('Initializing Video Pal model with projection model');

        // Find the projection model if it exists
        const projectionModel = activeVideoPal.projectionModel
          ? modelStore.availableModels.find(
              m => m.id === activeVideoPal.projectionModel?.id,
            )
          : null;

        if (projectionModel) {
          console.log('Found projection model:', projectionModel.name);
          // Get the projection model path
          modelStore
            .getModelFullPath(projectionModel)
            .then(projectionModelPath => {
              console.log(
                'Initializing with projection model path:',
                projectionModelPath,
              );
              // Initialize with both the main model and projection model
              modelStore.initContext(palDefaultModel, projectionModelPath);
            })
            .catch(error => {
              console.error('Failed to get projection model path:', error);
              // Fall back to initializing without projection model
              modelStore.initContext(palDefaultModel);
            });
        } else {
          console.warn(
            'No projection model found for Video Pal, initializing without it',
          );
          modelStore.initContext(palDefaultModel);
        }
      }
    }
  }, [activeVideoPal]);

  // Handle starting the camera
  const handleStartCamera = useCallback(async () => {
    if (!modelStore.context) {
      Alert.alert(l10n.chat.modelNotLoaded, l10n.chat.pleaseLoadModel, [
        {
          text: l10n.common.ok,
        },
      ]);
      return;
    }

    // Check if multimodal is enabled
    try {
      const isEnabled = await modelStore.isMultimodalEnabled();
      if (!isEnabled) {
        Alert.alert(
          'Multimodal Not Enabled',
          'This model does not support image analysis. Please load a multimodal model.',
          [
            {
              text: l10n.common.ok,
            },
          ],
        );
        return;
      }

      setIsCameraActive(true);
    } catch (error) {
      console.error('Error checking multimodal capability:', error);
      Alert.alert('Error', 'Failed to check if model supports images.', [
        {
          text: l10n.common.ok,
        },
      ]);
    }
  }, [l10n]);

  // Handle stopping the camera
  const handleStopCamera = useCallback(() => {
    if (modelStore.inferencing) {
      modelStore.context?.stopCompletion();
    }
    setIsCameraActive(false);
    setCapturedImagePath(null);
    setResponseText('');
  }, []);

  // Handle capture interval change
  const handleCaptureIntervalChange = useCallback(
    (interval: number) => {
      setCaptureInterval(interval);

      // Update the VideoPal's captureInterval setting
      if (activeVideoPal) {
        palStore.updatePal(activeVideoPal.id, {
          captureInterval: interval,
        });
      }
    },
    [activeVideoPal],
  );

  // Handle image capture from the video stream
  const handleImageCapture = useCallback(
    async (imagePath: string) => {
      setCapturedImagePath(imagePath);

      // Throttle analysis to avoid overwhelming the model
      const now = Date.now();
      if (now - lastAnalysisTime < captureInterval) {
        return;
      }

      setLastAnalysisTime(now);
      setIsAnalyzing(true);

      try {
        // Start the completion with the image using the user-editable prompt
        await modelStore.startImageCompletion({
          prompt: promptText,
          image_path: imagePath,
          systemMessage:
            'You are LiveLens, an AI assistant that provides real-time commentary on video streams.',
          onToken: token => {
            setResponseText(prev => prev + token);
          },
          onComplete: text => {
            setResponseText(text);
            setIsAnalyzing(false);
          },
          onError: error => {
            console.error('Error processing image:', error);
            setIsAnalyzing(false);
          },
        });
      } catch (error) {
        console.error('Error processing image:', error);
        setIsAnalyzing(false);
      }
    },
    [promptText, captureInterval, lastAnalysisTime],
  );

  // Render the camera or chat view based on state
  return (
    <UserContext.Provider value={user}>
      <View style={styles.container}>
        {isCameraActive ? (
          <VideoView
            onCapture={handleImageCapture}
            onClose={handleStopCamera}
            captureInterval={captureInterval}
            onCaptureIntervalChange={handleCaptureIntervalChange}
            analysisText={responseText}
          />
        ) : (
          <View style={styles.container}>
            <View style={styles.chatContainer}>
              <ChatView
                messages={[]}
                onSendPress={() => {}}
                onStopPress={() => modelStore.context?.stopCompletion()}
                user={user}
                isStopVisible={modelStore.inferencing}
                isThinking={modelStore.inferencing && !modelStore.isStreaming}
                isStreaming={modelStore.isStreaming}
                sendButtonVisibilityMode="editing"
                textInputProps={{
                  placeholder: l10n.video.promptPlaceholder,
                  editable: !modelStore.isStreaming && !isCameraActive,
                  value: promptText,
                  onChangeText: setPromptText,
                }}
                inputProps={{
                  palType: PalType.VIDEO,
                  isCameraActive: isCameraActive,
                  onStartCamera: handleStartCamera,
                  promptText: promptText,
                  onPromptTextChange: setPromptText,
                }}
              />
            </View>
          </View>
        )}
      </View>
    </UserContext.Provider>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
  },
});
