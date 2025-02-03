import React, {useState, useEffect, memo} from 'react';
import {Button} from 'react-native-paper';

import {ModelSettings} from '../../screens/ModelsScreen/ModelSettings';
import {Sheet} from '../Sheet';
import {Model} from '../../utils/types';
import {modelStore} from '../../store';
import {chatTemplates} from '../../utils/chat';

import {styles} from './styles';
import {View} from 'react-native';

interface ModelSettingsSheetProps {
  isVisible: boolean;
  onClose: () => void;
  model?: Model;
}

export const ModelSettingsSheet: React.FC<ModelSettingsSheetProps> = memo(
  ({isVisible, onClose, model}) => {
    const [tempChatTemplate, setTempChatTemplate] = useState(
      model?.chatTemplate || chatTemplates.default,
    );
    const [tempStopWords, setTempStopWords] = useState<string[]>(
      model?.stopWords || [],
    );

    // Reset temp settings when model changes
    useEffect(() => {
      if (model) {
        setTempChatTemplate(model.chatTemplate);
        setTempStopWords(model.stopWords || []);
      }
    }, [model]);

    const handleSettingsUpdate = (name: string, value: any) => {
      setTempChatTemplate(prev => {
        const newTemplate =
          name === 'name' ? chatTemplates[value] : {...prev, [name]: value};
        return newTemplate;
      });
    };

    const handleSaveSettings = () => {
      if (model) {
        modelStore.updateModelChatTemplate(model.id, tempChatTemplate);
        modelStore.updateModelStopWords(model.id, tempStopWords);
        onClose();
      }
    };

    const handleCancelSettings = () => {
      if (model) {
        // Reset to store values
        setTempChatTemplate(model.chatTemplate);
        setTempStopWords(model.stopWords || []);
      }
      onClose();
    };

    const handleReset = () => {
      if (model) {
        // Reset to model default values
        modelStore.resetModelChatTemplate(model.id);
        modelStore.resetModelStopWords(model.id);
        setTempChatTemplate(model.chatTemplate);
        setTempStopWords(model.stopWords || []);
      }
    };

    if (!model) {
      return null;
    }

    return (
      <Sheet
        isVisible={isVisible}
        onClose={handleCancelSettings}
        title="Model Settings"
        snapPoints={['90%']}>
        <Sheet.ScrollView
          bottomOffset={16}
          contentContainerStyle={styles.sheetScrollViewContainer}>
          <ModelSettings
            chatTemplate={tempChatTemplate}
            stopWords={tempStopWords}
            onChange={handleSettingsUpdate}
            onStopWordsChange={value => setTempStopWords(value || [])}
          />
        </Sheet.ScrollView>
        <Sheet.Actions>
          <View style={styles.secondaryButtons}>
            <Button mode="text" onPress={handleReset}>
              Reset
            </Button>
            <Button mode="text" onPress={handleCancelSettings}>
              Cancel
            </Button>
          </View>
          <Button mode="contained" onPress={handleSaveSettings}>
            Save Changes
          </Button>
        </Sheet.Actions>
      </Sheet>
    );
  },
);
