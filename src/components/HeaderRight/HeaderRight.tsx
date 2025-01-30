import React, {useContext} from 'react';
import {View} from 'react-native';

import {observer} from 'mobx-react';
import {IconButton, useTheme} from 'react-native-paper';

import {styles} from './styles';

import {chatSessionStore, modelStore, uiStore} from '../../store';

import {UsageStats} from '..';
import {
  ClockFastForwardIcon,
  DotsVerticalIcon,
  DuplicateIcon,
  EditBoxIcon,
  EditIcon,
  GridIcon,
  SettingsIcon,
  ShareIcon,
  TrashIcon,
} from '../../assets/icons';
import {Menu} from '../Menu';
import {L10nContext} from '../../utils';

export const HeaderRight: React.FC = observer(() => {
  const theme = useTheme();
  const [menuVisible, setMenuVisible] = React.useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
  const i10n = useContext(L10nContext);

  const models = modelStore.availableModels;
  const activeModelId = modelStore.activeModelId;

  const onSelectModel = (modelId: string) => {
    modelStore.setActiveModel(modelId);
    closeMenu();
  };

  return (
    <View style={styles.headerRightContainer}>
      {uiStore.displayMemUsage && <UsageStats width={40} height={20} />}
      <IconButton
        icon={() => <EditBoxIcon stroke={theme.colors.primary} />}
        testID="reset-button"
        onPress={() => {
          chatSessionStore.resetActiveSession();
        }}
      />
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchorPosition="bottom"
        anchor={
          <IconButton
            icon={() => <DotsVerticalIcon fill={theme.colors.primary} />}
            onPress={openMenu}
          />
        }>
        <Menu.Item
          onPress={() => {}}
          label={i10n.generationSettings}
          leadingIcon={() => <SettingsIcon stroke={theme.colors.primary} />}
        />
        <Menu.Item
          disabled={models.length === 0}
          submenu={models.map(model => (
            <Menu.Item
              label={model.name}
              onPress={() => onSelectModel(model.id)}
              key={model.id}
              selectable
              selected={model.id === activeModelId}
            />
          ))}
          label={i10n.model}
          leadingIcon={() => <GridIcon stroke={theme.colors.primary} />}
        />
        <Menu.Separator />
        <Menu.Item
          onPress={() => {}}
          label={i10n.duplicateChatHistory}
          leadingIcon={() => <DuplicateIcon stroke={theme.colors.primary} />}
        />
        <Menu.Item
          onPress={() => {}}
          label={i10n.exportChatSession}
          leadingIcon={() => <ShareIcon stroke={theme.colors.primary} />}
        />
        <Menu.Item
          onPress={() => {}}
          label={i10n.rename}
          leadingIcon={() => <EditIcon stroke={theme.colors.primary} />}
        />
        <Menu.Item
          onPress={() => {}}
          label={i10n.delete}
          labelStyle={{color: theme.colors.error}}
          leadingIcon={() => <TrashIcon stroke={theme.colors.error} />}
        />
        <Menu.Separator />
        <Menu.Item
          onPress={() => {}}
          label={i10n.makeChatTemporary}
          leadingIcon={() => (
            <ClockFastForwardIcon stroke={theme.colors.primary} />
          )}
        />
      </Menu>
    </View>
  );
});
