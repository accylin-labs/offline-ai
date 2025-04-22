import React, {useState, useContext, useEffect} from 'react';
import {View, Linking, Platform} from 'react-native';
import {Text, Button, TextInput, Snackbar} from 'react-native-paper';
import {observer} from 'mobx-react';

import {Sheet} from '../../../../components';
import {useTheme} from '../../../../hooks';
import {hfStore} from '../../../../store';
import {L10nContext} from '../../../../utils';

import {createStyles} from './styles';

interface HFTokenSheetProps {
  isVisible: boolean;
  onDismiss: () => void;
  onSave?: () => void;
}

export const HFTokenSheet: React.FC<HFTokenSheetProps> = observer(
  ({isVisible, onDismiss, onSave}) => {
    const theme = useTheme();
    const l10n = useContext(L10nContext);
    const styles = createStyles(theme);

    const [token, setToken] = useState(hfStore.hfToken || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Update token state when hfToken changes in store
    useEffect(() => {
      if (hfStore.hfToken) {
        setToken(hfStore.hfToken);
      }
    }, []);

    const handleSaveToken = async () => {
      if (!token.trim()) {
        return;
      }

      console.log('1- Saving token:', token.trim());
      setIsSubmitting(true);

      try {
        const success = await hfStore.setToken(token.trim());

        if (success) {
          setSuccessMessage(l10n.models.hfToken.saved);
          setShowSuccess(true);

          // Call onSave callback if provided
          if (onSave) {
            onSave();
          }
        } else {
          setShowError(true);
        }
      } catch (error) {
        console.error('Error saving token:', error);
        setShowError(true);
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleResetToken = async () => {
      setIsResetting(true);

      try {
        const success = await hfStore.clearToken();

        if (success) {
          setToken('');
          setSuccessMessage(l10n.models.hfToken.resetSuccess);
          setShowSuccess(true);

          // Call onSave callback if provided
          if (onSave) {
            onSave();
          }
        } else {
          setShowError(true);
        }
      } catch (error) {
        console.error('Error resetting token:', error);
        setShowError(true);
      } finally {
        setIsResetting(false);
      }
    };

    const handleTokenWebsite = () => {
      Linking.openURL('https://huggingface.co/settings/tokens');
    };

    return (
      <>
        <Sheet
          isVisible={isVisible}
          onClose={onDismiss}
          title={l10n.models.hfToken.title}
          snapPoints={['60%']}>
          <Sheet.ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.description}>
              {l10n.models.hfToken.description}
            </Text>

            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsTitle}>
                {l10n.models.hfToken.instructions}
              </Text>
              {l10n.models.hfToken.instructionsSteps.map((step, index) => (
                <Text key={index} style={styles.instructionItem}>
                  {index + 1}. {step}
                </Text>
              ))}
              <Text onPress={handleTokenWebsite} style={styles.linkButton}>
                {l10n.models.hfToken.getTokenLink}
              </Text>
            </View>

            <TextInput
              label={l10n.models.hfToken.inputLabel}
              value={token}
              onChangeText={setToken}
              mode="outlined"
              style={styles.input}
              placeholder={l10n.models.hfToken.inputPlaceholder}
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              secureTextEntry={Platform.OS === 'ios'} // secureTextEntry for iOS
            />
          </Sheet.ScrollView>
          <Sheet.Actions>
            <View style={styles.buttonsContainer}>
              {hfStore.isTokenPresent && (
                <Button
                  mode="text"
                  onPress={handleResetToken}
                  loading={isResetting}
                  disabled={isSubmitting || isResetting}
                  style={styles.resetButton}>
                  {l10n.models.hfToken.reset}
                </Button>
              )}
              <Button
                mode="contained"
                onPress={handleSaveToken}
                loading={isSubmitting}
                disabled={isSubmitting || isResetting || !token.trim()}
                style={styles.saveButton}>
                {l10n.models.hfToken.save}
              </Button>
            </View>
          </Sheet.Actions>
        </Sheet>

        <Snackbar
          visible={showSuccess}
          onDismiss={() => setShowSuccess(false)}
          duration={3000}>
          {successMessage}
        </Snackbar>

        <Snackbar
          visible={showError}
          onDismiss={() => setShowError(false)}
          duration={3000}
          style={styles.errorSnackbar}
          action={{
            label: l10n.common.dismiss,
            onPress: () => setShowError(false),
          }}>
          {l10n.models.hfToken.error.saving}
        </Snackbar>
      </>
    );
  },
);
