import React, {useContext} from 'react';
import {View} from 'react-native';

import {Text, Chip, Tooltip} from 'react-native-paper';

import {useTheme} from '../../../../hooks';
import {ModelTypeTag, TextDivider} from '../../../../components';

import {createStyles} from './styles';
import {ModelFileCard} from './ModelFileCard';

import {HuggingFaceModel} from '../../../../utils/types';
import {
  isVisionRepo,
  getMmprojFiles,
  getLLMFiles,
} from '../../../../utils/multimodalHelpers';
import {
  extractHFModelTitle,
  formatNumber,
  L10nContext,
  timeAgo,
} from '../../../../utils';

interface DetailsViewProps {
  hfModel: HuggingFaceModel;
}

export const DetailsView = ({hfModel}: DetailsViewProps) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const l10n = useContext(L10nContext);

  // Check if this is a vision repository
  const isVision = isVisionRepo(hfModel.siblings || []);

  // Get mmproj files
  const mmprojFiles = getMmprojFiles(hfModel.siblings || []);

  // Get LLM files (non-mmproj files)
  const llmFiles = getLLMFiles(hfModel.siblings || []);

  return (
    <View style={styles.content}>
      <View style={styles.authorRow}>
        <Text variant="headlineSmall" style={styles.modelAuthor}>
          {hfModel.author}
        </Text>
        {isVision && (
          <ModelTypeTag
            type="vision"
            label={l10n.models?.vision || 'Vision'}
            size="medium"
          />
        )}
      </View>
      <View style={styles.titleContainer}>
        <Tooltip title={hfModel.id}>
          <Text
            ellipsizeMode="middle"
            numberOfLines={1}
            variant="headlineSmall"
            style={styles.modelTitle}>
            {extractHFModelTitle(hfModel.id)}
          </Text>
        </Tooltip>
      </View>
      <View style={styles.modelStats}>
        <Chip icon="clock" compact style={styles.stat}>
          {timeAgo(hfModel.lastModified, l10n, 'long')}
        </Chip>
        <Chip icon="download" compact style={styles.stat}>
          {formatNumber(hfModel.downloads, 0)}
        </Chip>
        <Chip icon="heart" compact style={styles.stat}>
          {formatNumber(hfModel.likes, 0)}
        </Chip>
        {hfModel.trendingScore > 20 && (
          <Chip icon="trending-up" style={styles.stat} compact mode="outlined">
            🔥
          </Chip>
        )}
      </View>
      <Text variant="titleLarge" style={styles.sectionTitle}>
        {l10n.models.details.title}
      </Text>

      {/* Show LLM files first */}
      {llmFiles.length > 0 &&
        llmFiles.map((file, index) => (
          <ModelFileCard
            key={`llm-${index}`}
            modelFile={file}
            hfModel={hfModel}
          />
        ))}

      {/* Then show mmproj files */}
      {mmprojFiles.length > 0 && (
        <>
          <TextDivider text="Projector Files" />
          {mmprojFiles.map((file, index) => (
            <ModelFileCard
              key={`mmproj-${index}`}
              modelFile={file}
              hfModel={hfModel}
            />
          ))}
        </>
      )}
    </View>
  );
};
