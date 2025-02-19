import React, {useContext, useRef, useEffect} from 'react';
import {View, TextInput as RNTextInput} from 'react-native';
import {Button} from 'react-native-paper';
import {observer} from 'mobx-react-lite';
import {useForm, FormProvider, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';

import {Sheet} from '../Sheet/Sheet';
import {useTheme} from '../../hooks';
import {createStyles} from './styles';
import {L10nContext} from '../../utils';
import {palStore} from '../../store';
import {FormField} from './FormField';
import {SystemPromptSection} from './SystemPromptSection';
import {ColorSection} from './ColorSection';
import {ModelSelector} from './ModelSelector';
import {assistantFormSchema, PalType, type AssistantFormData} from './types';

interface AssistantPalSheetProps {
  isVisible: boolean;
  onClose: () => void;
  editPal?: AssistantFormData & {id: string};
}

const INITIAL_STATE: Omit<AssistantFormData, 'palType'> = {
  name: '',
  defaultModel: '',
  useAIPrompt: false,
  systemPrompt: '',
  originalSystemPrompt: '',
  isSystemPromptChanged: false,
  color: undefined,
  promptGenerationModel: '',
  generatingPrompt: '',
};

export const AssistantPalSheet: React.FC<AssistantPalSheetProps> = observer(
  ({isVisible, onClose, editPal}) => {
    const theme = useTheme();
    const styles = createStyles(theme);
    const l10n = useContext(L10nContext);

    const inputRefs = useRef<{[key: string]: RNTextInput | null}>({});

    const methods = useForm<AssistantFormData>({
      resolver: zodResolver(assistantFormSchema),
      defaultValues: {...INITIAL_STATE, palType: PalType.ASSISTANT},
    });

    useEffect(() => {
      if (editPal) {
        methods.reset(editPal);
      }
    }, [editPal, methods]);

    const validateAssistantFields = async () => {
      const formState = methods.getValues();
      if (formState.useAIPrompt) {
        if (!formState.generatingPrompt) {
          methods.setError('generatingPrompt', {
            message: 'Generating prompt is required',
          });
        }
        if (!formState.promptGenerationModel) {
          methods.setError('promptGenerationModel', {
            message: 'Prompt generation model is required',
          });
        }
        return Boolean(
          formState.generatingPrompt && formState.promptGenerationModel,
        );
      }
      return true;
    };

    const handleClose = () => {
      if (editPal) {
        methods.reset(editPal);
      } else {
        methods.reset({...INITIAL_STATE, palType: PalType.ASSISTANT});
      }
      onClose();
    };

    const onSubmit = (data: AssistantFormData) => {
      if (editPal) {
        palStore.updatePal(editPal.id, data);
      } else {
        palStore.addPal(data);
      }
      handleClose();
    };

    return (
      <Sheet
        title={`${editPal ? 'Edit' : 'Create'} Assistant Pal`}
        isVisible={isVisible}
        displayFullHeight
        onClose={handleClose}>
        <FormProvider {...methods}>
          <Sheet.ScrollView
            bottomOffset={16}
            contentContainerStyle={styles.scrollviewContainer}>
            <View style={styles.form}>
              <FormField
                ref={ref => (inputRefs.current.name = ref)}
                name="name"
                label="Pal Name"
                placeholder="Name"
                required
                onSubmitEditing={() => inputRefs.current.defaultModel?.focus()}
              />

              <Controller
                name="defaultModel"
                control={methods.control}
                render={({field: {onChange, value}, fieldState: {error}}) => (
                  <ModelSelector
                    value={value}
                    onChange={onChange}
                    label="Default Model"
                    placeholder="Select model"
                    error={!!error}
                    helperText={error?.message}
                    inputRef={ref => (inputRefs.current.defaultModel = ref)}
                    onSubmitEditing={() =>
                      inputRefs.current.description?.focus()
                    }
                  />
                )}
              />
              <SystemPromptSection validateFields={validateAssistantFields} />
              <ColorSection />
            </View>
          </Sheet.ScrollView>

          <Sheet.Actions>
            <View style={styles.actions}>
              <Button
                style={styles.actionBtn}
                mode="text"
                onPress={handleClose}>
                {l10n.cancel}
              </Button>
              <Button
                style={styles.actionBtn}
                mode="contained"
                onPress={methods.handleSubmit(onSubmit)}>
                {editPal ? l10n.save : 'Create'}
              </Button>
            </View>
          </Sheet.Actions>
        </FormProvider>
      </Sheet>
    );
  },
);
