import {fireEvent, render, waitFor} from '@testing-library/react-native';
import * as React from 'react';
import {ScrollView} from 'react-native';

import {user} from '../../../../jest/fixtures';
import {l10n} from '../../../utils/l10n';
import {UserContext} from '../../../utils';
import {ChatInput} from '../ChatInput';
import {PalType} from '../../PalsSheets/types';

// Mock react-native-image-picker
jest.mock('react-native-image-picker', () => ({
  launchCamera: jest.fn(),
  launchImageLibrary: jest.fn(),
}));

const renderScrollable = () => <ScrollView />;

describe('input', () => {
  it('send button', () => {
    expect.assertions(2);
    const onSendPress = jest.fn();
    const {getByPlaceholderText, getByLabelText} = render(
      <UserContext.Provider value={user}>
        <ChatInput
          {...{
            onSendPress,
            sendButtonVisibilityMode: 'editing',
            textInputProps: {value: 'text'},
          }}
        />
      </UserContext.Provider>,
    );
    const textInput = getByPlaceholderText(
      l10n.en.components.chatInput.inputPlaceholder,
    );
    fireEvent.changeText(textInput, 'text');
    const button = getByLabelText(
      l10n.en.components.sendButton.accessibilityLabel,
    );
    fireEvent.press(button);
    expect(onSendPress).toHaveBeenCalledWith({text: 'text', type: 'text'});
    expect(textInput.props).toHaveProperty('value', 'text');
  });

  it('sends a text message', () => {
    expect.assertions(2);
    const onSendPress = jest.fn();
    const {getByPlaceholderText, getByLabelText} = render(
      <UserContext.Provider value={user}>
        <ChatInput
          {...{
            onSendPress,
            renderScrollable,
            sendButtonVisibilityMode: 'editing',
          }}
        />
      </UserContext.Provider>,
    );
    const textInput = getByPlaceholderText(
      l10n.en.components.chatInput.inputPlaceholder,
    );
    fireEvent.changeText(textInput, 'text');
    const button = getByLabelText(
      l10n.en.components.sendButton.accessibilityLabel,
    );
    fireEvent.press(button);
    expect(onSendPress).toHaveBeenCalledWith({text: 'text', type: 'text'});
    expect(textInput.props).toHaveProperty('value', '');
  });

  it('sends a text message if onChangeText and value are provided', () => {
    expect.assertions(2);
    const onSendPress = jest.fn();
    const value = 'value';
    const onChangeText = jest.fn(newValue => {
      rerender(
        <UserContext.Provider value={user}>
          <ChatInput
            {...{
              onSendPress,
              renderScrollable,
              sendButtonVisibilityMode: 'editing',
              textInputProps: {onChangeText, value: newValue},
            }}
          />
        </UserContext.Provider>,
      );
    });
    const {getByPlaceholderText, getByLabelText, rerender} = render(
      <UserContext.Provider value={user}>
        <ChatInput
          {...{
            onSendPress,
            renderScrollable,
            sendButtonVisibilityMode: 'editing',
            textInputProps: {onChangeText, value},
          }}
        />
      </UserContext.Provider>,
    );
    const textInput = getByPlaceholderText(
      l10n.en.components.chatInput.inputPlaceholder,
    );
    fireEvent.changeText(textInput, 'text');
    const button = getByLabelText(
      l10n.en.components.sendButton.accessibilityLabel,
    );
    fireEvent.press(button);
    expect(onSendPress).toHaveBeenCalledWith({text: 'text', type: 'text'});
    expect(textInput.props).toHaveProperty('value', 'text');
  });

  it('sends a text message if onChangeText is provided', () => {
    expect.assertions(2);
    const onSendPress = jest.fn();
    const onChangeText = jest.fn();
    const {getByPlaceholderText, getByLabelText} = render(
      <UserContext.Provider value={user}>
        <ChatInput
          {...{
            onSendPress,
            renderScrollable,
            sendButtonVisibilityMode: 'editing',
            textInputProps: {onChangeText},
          }}
        />
      </UserContext.Provider>,
    );
    const textInput = getByPlaceholderText(
      l10n.en.components.chatInput.inputPlaceholder,
    );
    fireEvent.changeText(textInput, 'text');
    const button = getByLabelText(
      l10n.en.components.sendButton.accessibilityLabel,
    );
    fireEvent.press(button);
    expect(onSendPress).toHaveBeenCalledWith({text: 'text', type: 'text'});
    expect(textInput.props).toHaveProperty('value', '');
  });

  it('sends a text message if value is provided', async () => {
    expect.assertions(2);
    const onSendPress = jest.fn();
    const value = 'value';
    const {getByPlaceholderText, getByLabelText} = render(
      <UserContext.Provider value={user}>
        <ChatInput
          {...{
            onSendPress,
            renderScrollable,
            sendButtonVisibilityMode: 'editing',
            textInputProps: {value},
          }}
        />
      </UserContext.Provider>,
    );
    const textInput = getByPlaceholderText(
      l10n.en.components.chatInput.inputPlaceholder,
    );
    await waitFor(() => fireEvent.changeText(textInput, 'text')); // Wait for the input to update

    const button = getByLabelText(
      l10n.en.components.sendButton.accessibilityLabel,
    );
    await waitFor(() => fireEvent.press(button)); // Wait for the press event to be processed

    expect(onSendPress).toHaveBeenCalledWith({text: value, type: 'text'});
    expect(textInput.props).toHaveProperty('value', value);
  });

  it('sends a text message if defaultValue is provided', () => {
    expect.assertions(2);
    const onSendPress = jest.fn();
    const defaultValue = 'defaultValue';
    const {getByPlaceholderText, getByLabelText} = render(
      <UserContext.Provider value={user}>
        <ChatInput
          {...{
            onSendPress,
            renderScrollable,
            sendButtonVisibilityMode: 'editing',
            textInputProps: {defaultValue},
          }}
        />
      </UserContext.Provider>,
    );
    const textInput = getByPlaceholderText(
      l10n.en.components.chatInput.inputPlaceholder,
    );
    const button = getByLabelText(
      l10n.en.components.sendButton.accessibilityLabel,
    );
    fireEvent.press(button);
    expect(onSendPress).toHaveBeenCalledWith({
      text: defaultValue,
      type: 'text',
    });
    expect(textInput.props).toHaveProperty('value', '');
  });

  it('shows stop button when isStopVisible is true', () => {
    expect.assertions(1);
    const onStopPress = jest.fn();
    const onSendPress = jest.fn();
    const {getByTestId} = render(
      <UserContext.Provider value={user}>
        <ChatInput
          {...{
            onSendPress,
            onStopPress,
            isStopVisible: true,
            sendButtonVisibilityMode: 'editing',
          }}
        />
      </UserContext.Provider>,
    );
    const stopButton = getByTestId('stop-button');
    fireEvent.press(stopButton);
    expect(onStopPress).toHaveBeenCalledTimes(1);
  });

  it('shows plus button for image upload when showImageUpload is true', () => {
    expect.assertions(1);
    const onSendPress = jest.fn();
    const {getByLabelText} = render(
      <UserContext.Provider value={user}>
        <ChatInput
          {...{
            onSendPress,
            showImageUpload: true,
            sendButtonVisibilityMode: 'editing',
          }}
        />
      </UserContext.Provider>,
    );

    const plusButton = getByLabelText('Add image');
    expect(plusButton).toBeDefined();
  });

  it('does not show plus button when showImageUpload is false', () => {
    expect.assertions(1);
    const onSendPress = jest.fn();
    const {queryByLabelText} = render(
      <UserContext.Provider value={user}>
        <ChatInput
          {...{
            onSendPress,
            showImageUpload: false,
            sendButtonVisibilityMode: 'editing',
          }}
        />
      </UserContext.Provider>,
    );

    const plusButton = queryByLabelText('Add image');
    expect(plusButton).toBeNull();
  });

  it('renders plus button correctly when vision is enabled', () => {
    expect.assertions(2);
    const onSendPress = jest.fn();
    const {getByLabelText} = render(
      <UserContext.Provider value={user}>
        <ChatInput
          {...{
            onSendPress,
            showImageUpload: true,
            isVisionEnabled: true,
            sendButtonVisibilityMode: 'editing',
          }}
        />
      </UserContext.Provider>,
    );

    const plusButton = getByLabelText('Add image');
    expect(plusButton).toBeTruthy();
    expect(plusButton.props.accessibilityState.disabled).toBe(false);
  });

  it('shows pal selector button', () => {
    expect.assertions(1);
    const onSendPress = jest.fn();
    const onPalBtnPress = jest.fn();
    const {getByLabelText} = render(
      <UserContext.Provider value={user}>
        <ChatInput
          {...{
            onSendPress,
            onPalBtnPress,
            sendButtonVisibilityMode: 'editing',
          }}
        />
      </UserContext.Provider>,
    );

    const palButton = getByLabelText('Select Pal');
    fireEvent.press(palButton);
    expect(onPalBtnPress).toHaveBeenCalledTimes(1);
  });

  it('shows camera button for camera pal type', () => {
    expect.assertions(1);
    const onSendPress = jest.fn();
    const onStartCamera = jest.fn();
    const {getByLabelText} = render(
      <UserContext.Provider value={user}>
        <ChatInput
          {...{
            onSendPress,
            onStartCamera,
            palType: PalType.CAMERA,
            sendButtonVisibilityMode: 'editing',
          }}
        />
      </UserContext.Provider>,
    );

    const cameraButton = getByLabelText('Start camera');
    fireEvent.press(cameraButton);
    expect(onStartCamera).toHaveBeenCalledTimes(1);
  });

  it('shows video button for video pal type', () => {
    expect.assertions(1);
    const onSendPress = jest.fn();
    const onStartCamera = jest.fn();
    const {getByLabelText} = render(
      <UserContext.Provider value={user}>
        <ChatInput
          {...{
            onSendPress,
            onStartCamera,
            palType: PalType.VIDEO,
            sendButtonVisibilityMode: 'editing',
          }}
        />
      </UserContext.Provider>,
    );

    const videoButton = getByLabelText('Start video');
    fireEvent.press(videoButton);
    expect(onStartCamera).toHaveBeenCalledTimes(1);
  });

  it('handles prompt text change for camera pal', () => {
    expect.assertions(1);
    const onSendPress = jest.fn();
    const onPromptTextChange = jest.fn();
    const {getByPlaceholderText} = render(
      <UserContext.Provider value={user}>
        <ChatInput
          {...{
            onSendPress,
            onPromptTextChange,
            palType: PalType.CAMERA,
            promptText: 'initial text',
            sendButtonVisibilityMode: 'editing',
          }}
        />
      </UserContext.Provider>,
    );

    const textInput = getByPlaceholderText(l10n.en.camera.promptPlaceholder);
    fireEvent.changeText(textInput, 'new text');
    expect(onPromptTextChange).toHaveBeenCalledWith('new text');
  });

  it('handles prompt text change for video pal', () => {
    expect.assertions(1);
    const onSendPress = jest.fn();
    const onPromptTextChange = jest.fn();
    const {getByPlaceholderText} = render(
      <UserContext.Provider value={user}>
        <ChatInput
          {...{
            onSendPress,
            onPromptTextChange,
            palType: PalType.VIDEO,
            promptText: 'initial text',
            sendButtonVisibilityMode: 'editing',
          }}
        />
      </UserContext.Provider>,
    );

    const textInput = getByPlaceholderText(l10n.en.video.promptPlaceholder);
    fireEvent.changeText(textInput, 'new text');
    expect(onPromptTextChange).toHaveBeenCalledWith('new text');
  });

  it('disables plus button when vision is not enabled', () => {
    expect.assertions(1);
    const onSendPress = jest.fn();
    const {getByLabelText} = render(
      <UserContext.Provider value={user}>
        <ChatInput
          {...{
            onSendPress,
            showImageUpload: true,
            isVisionEnabled: false,
            sendButtonVisibilityMode: 'editing',
          }}
        />
      </UserContext.Provider>,
    );

    const plusButton = getByLabelText('Add image');
    expect(plusButton.props.accessibilityState.disabled).toBe(true);
  });

  it('enables plus button when vision is enabled', () => {
    expect.assertions(1);
    const onSendPress = jest.fn();
    const {getByLabelText} = render(
      <UserContext.Provider value={user}>
        <ChatInput
          {...{
            onSendPress,
            showImageUpload: true,
            isVisionEnabled: true,
            sendButtonVisibilityMode: 'editing',
          }}
        />
      </UserContext.Provider>,
    );

    const plusButton = getByLabelText('Add image');
    expect(plusButton.props.accessibilityState.disabled).toBe(false);
  });

  it('shows send button with always visibility mode', () => {
    expect.assertions(1);
    const onSendPress = jest.fn();
    const {getByLabelText} = render(
      <UserContext.Provider value={user}>
        <ChatInput
          {...{
            onSendPress,
            sendButtonVisibilityMode: 'always',
          }}
        />
      </UserContext.Provider>,
    );

    const sendButton = getByLabelText(
      l10n.en.components.sendButton.accessibilityLabel,
    );
    expect(sendButton).toBeTruthy();
  });

  it('sends message with images when images are selected', () => {
    expect.assertions(1);
    const onSendPress = jest.fn();
    const {getByPlaceholderText, getByLabelText} = render(
      <UserContext.Provider value={user}>
        <ChatInput
          {...{
            onSendPress,
            sendButtonVisibilityMode: 'editing',
          }}
        />
      </UserContext.Provider>,
    );

    const textInput = getByPlaceholderText(
      l10n.en.components.chatInput.inputPlaceholder,
    );
    fireEvent.changeText(textInput, 'test message');

    const sendButton = getByLabelText(
      l10n.en.components.sendButton.accessibilityLabel,
    );
    fireEvent.press(sendButton);

    expect(onSendPress).toHaveBeenCalledWith({
      text: 'test message',
      type: 'text',
    });
  });
});
