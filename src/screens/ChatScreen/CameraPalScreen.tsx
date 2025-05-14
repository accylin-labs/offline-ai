import React, {useState, useCallback, useContext} from 'react';
import {View, StyleSheet, Alert, Text, TouchableOpacity} from 'react-native';
import {observer} from 'mobx-react';
import {ChatView, CameraView, Bubble} from '../../components';
import {useTheme} from '../../hooks';
import {L10nContext, UserContext} from '../../utils';
import {modelStore} from '../../store';
import {MessageType} from '../../utils/types';
import {v4 as uuidv4} from 'uuid';
import 'react-native-get-random-values';

export const CameraPalScreen = observer(() => {
  const theme = useTheme();
  const l10n = useContext(L10nContext);
  const user = useContext(UserContext);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImagePath, setCapturedImagePath] = useState<string | null>(
    null,
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [messages, setMessages] = useState<MessageType.Any[]>([]);
  const [responseText, setResponseText] = useState('');

  // We'll use a direct approach instead of a custom render function

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
  }, []);

  // Add a message to the chat
  const addMessage = useCallback((message: MessageType.Any) => {
    setMessages(prevMessages => [message, ...prevMessages]);
  }, []);

  // Handle image capture
  const handleImageCapture = useCallback(
    async (imagePath: string) => {
      setIsCameraActive(false);
      setCapturedImagePath(imagePath);
      setIsAnalyzing(true);
      setResponseText('');

      try {
        // Create a message with the image
        const imageMessage: MessageType.Image = {
          id: uuidv4(),
          author: user!,
          createdAt: Date.now(),
          type: 'image',
          uri: imagePath,
          name: 'Captured Image',
          size: 0,
        };

        // Add the image message to the chat
        addMessage(imageMessage);

        // Create a system message to indicate analysis is happening
        const systemMessage: MessageType.Text = {
          id: uuidv4(),
          createdAt: Date.now(),
          text: l10n.camera.analyzing,
          type: 'text',
          author: {
            id: 'system',
            firstName: 'System',
            lastName: '',
          },
        };

        addMessage(systemMessage);

        // Send the image to the model for analysis
        const prompt =
          'Analyze this image and describe what you see in detail.';

        // Start the completion with the image
        await modelStore.startImageCompletion({
          prompt,
          image_path: imagePath,
          onToken: token => {
            setResponseText(prev => prev + token);
          },
          onComplete: text => {
            // Create an AI message with the response
            const aiMessage: MessageType.Text = {
              id: uuidv4(),
              author: {
                id: 'ai',
                firstName: 'Lookie',
                lastName: '',
              },
              createdAt: Date.now(),
              text,
              type: 'text',
            };

            addMessage(aiMessage);
            setResponseText('');
            setIsAnalyzing(false);
          },
          onError: error => {
            console.error('Error processing image:', error);
            const errorMessage: MessageType.Text = {
              id: uuidv4(),
              createdAt: Date.now(),
              text: `Error analyzing image: ${error.message}`,
              type: 'text',
              author: {
                id: 'system',
                firstName: 'System',
                lastName: '',
              },
            };

            addMessage(errorMessage);
            setIsAnalyzing(false);
          },
        });
      } catch (error) {
        console.error('Error processing image:', error);
        const errorMessage: MessageType.Text = {
          id: uuidv4(),
          createdAt: Date.now(),
          text: `Error analyzing image: ${
            error instanceof Error ? error.message : String(error)
          }`,
          type: 'text',
          author: {
            id: 'system',
            firstName: 'System',
            lastName: '',
          },
        };

        addMessage(errorMessage);
        setIsAnalyzing(false);
      }
    },
    [user, l10n.camera.analyzing, addMessage],
  );

  // Custom bubble renderer to handle streaming response
  const renderBubble = useCallback(
    (props: any) => {
      // If we have a streaming response, show it
      if (isAnalyzing && responseText && props.message.author?.id === 'ai') {
        return (
          <Bubble
            {...props}
            message={{
              ...props.message,
              text: responseText,
            }}
          />
        );
      }

      // Otherwise, use the default bubble
      return <Bubble {...props} />;
    },
    [isAnalyzing, responseText],
  );

  // Render the camera or chat view based on state
  return (
    <View style={styles.container}>
      {isCameraActive ? (
        <CameraView onCapture={handleImageCapture} onClose={handleStopCamera} />
      ) : (
        <View style={styles.container}>
          <View style={styles.chatContainer}>
            <ChatView
              renderBubble={renderBubble}
              messages={messages}
              onSendPress={() => {}}
              onStopPress={() => modelStore.context?.stopCompletion()}
              user={user!}
              isStopVisible={modelStore.inferencing}
              isThinking={modelStore.inferencing && !modelStore.isStreaming}
              isStreaming={modelStore.isStreaming && !!responseText}
              sendButtonVisibilityMode="editing"
              textInputProps={{
                editable: false,
                placeholder: isAnalyzing
                  ? l10n.camera.analyzing
                  : capturedImagePath
                  ? 'Image captured and analyzed'
                  : 'Tap Start Camera to begin',
              }}
              inputProps={{}}
            />
          </View>
          <View style={styles.cameraButtonContainer}>
            <TouchableOpacity
              style={[
                styles.cameraButton,
                {backgroundColor: theme.colors.primary},
              ]}
              onPress={handleStartCamera}>
              <Text style={styles.cameraButtonText}>
                {l10n.camera.startCamera}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
  },
  cameraButtonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  cameraButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cameraButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
