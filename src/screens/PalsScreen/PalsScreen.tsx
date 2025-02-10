import React, {useState} from 'react';
import {View, ScrollView, Pressable} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Text, Divider} from 'react-native-paper';
import {observer} from 'mobx-react-lite';

import {useTheme} from '../../hooks';
import {createStyles} from './styles';
import {
  ChevronRightIcon,
  ChevronDownIcon,
  PlusIcon,
  PencilLineIcon,
} from '../../assets/icons';
import {
  AssistantPalSheet,
  RoleplayPalSheet,
  PalType,
} from '../../components/PalsSheets';
import {palStore, Pal} from '../../store/PalStore';

const PalDetails = ({pal}: {pal: Pal}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme, insets);

  if (pal.palType === PalType.ASSISTANT) {
    return (
      <View style={styles.infoContainer}>
        <View style={styles.infoColumn}>
          <Text style={theme.fonts.titleMediumLight}>System Prompt</Text>
          <Text style={styles.itemDescription}>{pal.systemPrompt}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.infoContainer}>
      <View style={styles.infoColumn}>
        <Text style={theme.fonts.titleMediumLight}>World</Text>
        <Text style={styles.itemDescription}>{pal.world}</Text>
      </View>

      <View style={styles.infoColumn}>
        <Text style={theme.fonts.titleMediumLight}>Tone/Style</Text>
        <Text style={styles.itemDescription}>{pal.toneStyle}</Text>
      </View>

      <View style={styles.infoColumn}>
        <Text style={theme.fonts.titleMediumLight}>AI's Role</Text>
        <Text style={styles.itemDescription}>{pal.aiRole}</Text>
      </View>

      <View style={styles.infoColumn}>
        <Text style={theme.fonts.titleMediumLight}>My Role</Text>
        <Text style={styles.itemDescription}>{pal.userRole}</Text>
      </View>

      <View style={styles.infoColumn}>
        <Text style={theme.fonts.titleMediumLight}>Prompt</Text>
        <Text style={styles.itemDescription}>{pal.systemPrompt}</Text>
      </View>
    </View>
  );
};

const PalCard = ({pal, onEdit}: {pal: Pal; onEdit: (pal: Pal) => void}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme, insets);

  return (
    <View style={styles.palCard}>
      <Pressable
        onPress={() => setIsExpanded(!isExpanded)}
        style={[styles.itemContainer, isExpanded && styles.expandedItem]}>
        <Text style={theme.fonts.titleMediumLight}>{pal.name}</Text>
        <View style={styles.itemRight}>
          <PencilLineIcon
            stroke={theme.colors.onSurface}
            onPress={() => onEdit(pal)}
          />
          {isExpanded ? (
            <ChevronDownIcon stroke={theme.colors.onSurface} />
          ) : (
            <ChevronRightIcon stroke={theme.colors.onSurface} />
          )}
        </View>
      </Pressable>

      {isExpanded && <PalDetails pal={pal} />}
    </View>
  );
};

export const PalsScreen: React.FC = observer(() => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = createStyles(theme, insets);

  const [showAssistantSheet, setShowAssistantSheet] = useState(false);
  const [showRoleplaySheet, setShowRoleplaySheet] = useState(false);
  const [editPal, setEditPal] = useState<Pal | undefined>();

  const handleCreatePal = (type: PalType) => {
    setEditPal(undefined);
    if (type === PalType.ASSISTANT) {
      setShowAssistantSheet(true);
    } else {
      setShowRoleplaySheet(true);
    }
  };

  const handleEditPal = (pal: Pal) => {
    setEditPal(pal);
    if (pal.palType === PalType.ASSISTANT) {
      setShowAssistantSheet(true);
    } else {
      setShowRoleplaySheet(true);
    }
  };

  const pals = palStore.getPals();

  return (
    <ScrollView
      style={styles.scrollview}
      contentContainerStyle={styles.scrollviewContent}>
      <View style={styles.createBtnsContainer}>
        <Pressable
          style={styles.itemContainer}
          onPress={() => handleCreatePal(PalType.ASSISTANT)}>
          <Text style={theme.fonts.titleMediumLight}>Assistant</Text>
          <PlusIcon stroke={theme.colors.onSurface} />
        </Pressable>
        <Pressable
          style={styles.itemContainer}
          onPress={() => handleCreatePal(PalType.ROLEPLAY)}>
          <Text style={theme.fonts.titleMediumLight}>Roleplay</Text>
          <PlusIcon stroke={theme.colors.onSurface} />
        </Pressable>
      </View>

      <Divider style={styles.divider} />

      <View style={styles.palContainer}>
        {pals.map(pal => (
          <PalCard key={pal.id} pal={pal} onEdit={handleEditPal} />
        ))}
      </View>

      <AssistantPalSheet
        isVisible={showAssistantSheet}
        onClose={() => setShowAssistantSheet(false)}
        editPal={editPal?.palType === PalType.ASSISTANT ? editPal : undefined}
      />

      <RoleplayPalSheet
        isVisible={showRoleplaySheet}
        onClose={() => setShowRoleplaySheet(false)}
        editPal={editPal?.palType === PalType.ROLEPLAY ? editPal : undefined}
      />
    </ScrollView>
  );
});
