import React from 'react';
import {View, StyleSheet} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import {Spacing, Colors, Typography} from '../metrics';
import { Highlight } from '../utils';

interface Props {}

const SearchBar = ({}: Props) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.text}
        placeholderTextColor={Colors.LIGHT_TEXT}
        placeholder="Search here"
      />
      <Highlight style={styles.searchButton}>
        <Icon name="ios-search" style={styles.searchIcon}  />
      </Highlight>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    height: Spacing.SCALE_55,
    alignItems: 'center',
    marginTop: Spacing.SCALE_12,
    marginHorizontal: Spacing.SCALE_12,
    paddingLeft: Spacing.SCALE_20,
    borderRadius: Spacing.SCALE_55 / 2,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GREY,
  },
  text: {
    fontSize: Typography.FONT_SIZE_16,
    flex: 1,
    fontWeight: Typography.FONT_WEIGHT_600,
  },
  searchButton: {
    width: Spacing.SCALE_40,
    height: Spacing.SCALE_40,
    borderRadius: Spacing.SCALE_20,
    justifyContent: 'center',
    marginRight: Spacing.SCALE_12,

    alignItems: 'center',
  },
  searchIcon: {
    fontSize: Spacing.SCALE_20,
    color: Colors.LIGHT_TEXT,
    fontWeight: Typography.FONT_WEIGHT_600,
  },
});

export default SearchBar;
