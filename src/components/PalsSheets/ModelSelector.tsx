import React from 'react';
import {observer} from 'mobx-react-lite';
import {View, TextInput as RNTextInput} from 'react-native';
import {Text} from 'react-native-paper';
import {Menu} from '../Menu';
import {TextInput} from '../TextInput';
import {modelStore} from '../../store';
import {useTheme} from '../../hooks';
import {createStyles} from './styles';

interface ModelSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  label: string;
  sublabel?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  inputRef?: (ref: RNTextInput | null) => void;
  onSubmitEditing?: () => void;
  disabled?: boolean;
}

export const ModelSelector = observer(
  ({
    value,
    onChange,
    label,
    sublabel,
    placeholder = 'Select model',
    error,
    helperText,
    required,
    inputRef,
    onSubmitEditing,
    disabled,
  }: ModelSelectorProps) => {
    const [menuVisible, setMenuVisible] = React.useState(false);
    const selectedModel = modelStore.availableModels.find(m => m.id === value);
    const theme = useTheme();
    const styles = createStyles(theme);

    return (
      <View style={styles.field}>
        <Text style={theme.fonts.titleMediumLight}>
          {label}
          {required && '*'}
        </Text>
        {sublabel && <Text style={styles.sublabel}>{sublabel}</Text>}
        <Menu
          visible={menuVisible}
          selectable
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <TextInput
              ref={inputRef}
              value={selectedModel?.name || ''}
              placeholder={placeholder}
              onPressIn={() => setMenuVisible(true)}
              disabled={disabled}
              editable={false}
              error={error}
              helperText={helperText}
              onSubmitEditing={onSubmitEditing}
              returnKeyType="next"
            />
          }>
          {modelStore.availableModels.map(model => (
            <Menu.Item
              key={model.id}
              label={model.name}
              onPress={() => {
                onChange(model.id);
                setMenuVisible(false);
                onSubmitEditing?.();
              }}
              selectable
              selected={model.id === value}
            />
          ))}
        </Menu>
      </View>
    );
  },
);
