import React, {useState, useEffect} from 'react';
import {Keyboard, Platform, TouchableOpacity} from 'react-native';

import {observer} from 'mobx-react';
import {Text} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import {BottomSheetFlatList, BottomSheetView} from '@gorhom/bottom-sheet';

import {Searchbar} from '../../../../components';

import {useTheme} from '../../../../hooks';

import {createStyles} from './styles';

import {hfStore} from '../../../../store';

import {HuggingFaceModel} from '../../../../utils/types';

interface SearchViewProps {
  testID?: string;
  onModelSelect: (model: HuggingFaceModel) => void;
  onChangeSearchQuery: (query: string) => void;
}

export const SearchView = observer(
  ({testID, onModelSelect, onChangeSearchQuery}: SearchViewProps) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
      const keyboardWillShow = Keyboard.addListener(
        Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
        () => setKeyboardVisible(true),
      );
      const keyboardWillHide = Keyboard.addListener(
        Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
        () => setKeyboardVisible(false),
      );

      return () => {
        keyboardWillShow.remove();
        keyboardWillHide.remove();
      };
    }, []);

    const styles = createStyles(theme, keyboardVisible ? 0 : insets.bottom);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (query: string) => {
      setSearchQuery(query);
      onChangeSearchQuery(query);
    };

    const renderItem = ({item}: {item: HuggingFaceModel}) => (
      <TouchableOpacity
        key={item.id}
        onPress={() => onModelSelect(item)}
        style={styles.modelItem}>
        <Text style={styles.modelName}>{item.id}</Text>
      </TouchableOpacity>
    );

    return (
      <BottomSheetView style={styles.contentContainer} testID={testID}>
        {hfStore.isLoading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : hfStore.models.length === 0 ? (
          <Text style={styles.noResultsText}>No models found</Text>
        ) : (
          <BottomSheetFlatList
            data={hfStore.models}
            keyExtractor={(item: HuggingFaceModel) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            renderScrollComponent={props => (
              <KeyboardAwareScrollView bottomOffset={100} {...props} />
            )}
          />
        )}
        <Searchbar
          value={searchQuery}
          onChangeText={handleSearchChange}
          placeholder="Search Hugging Face models"
          containerStyle={styles.searchbarContainer}
        />
      </BottomSheetView>
    );
  },
);
