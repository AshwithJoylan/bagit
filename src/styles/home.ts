import {StyleSheet} from 'react-native';
import {Colors, Spacing, Typography} from '../metrics';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    backgroundColor: Colors.BACKGROUND,
    paddingTop: Spacing.SCALE_12,
    paddingBottom: Spacing.SCALE_12,
  },
  bag: {
    height: Spacing.SCALE_50,
    width: Spacing.SCALE_50,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  icon: {
    width: '50%',
    alignSelf: 'flex-end',
    height: '50%',
  },
  header: {
    alignSelf: 'stretch',
    marginHorizontal: Spacing.SCALE_12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badge: {
    padding: Spacing.SCALE_2,
    position: 'absolute',
    top: Spacing.SCALE_50 / 2 - Spacing.SCALE_12,
    backgroundColor: Colors.PRIMARY,
    borderRadius: Spacing.SCALE_16,
  },
  badgeText: {
    fontSize: Typography.FONT_SIZE_6,
    color: Colors.WHITE,
    fontWeight: Typography.FONT_WEIGHT_600,
  },
  tabHeader: {
    alignSelf: 'stretch',
    marginTop: Spacing.SCALE_12,
    marginHorizontal: Spacing.SCALE_12,
    height: Spacing.SCALE_50,
  },
  tabTitleContainer: {
    paddingVertical: Spacing.SCALE_12,
    paddingHorizontal: Spacing.SCALE_16,
  },
  tabTitle: {
    textTransform: 'none',
    fontSize: Typography.FONT_SIZE_16,
    color: Colors.LIGHT_TEXT,
    fontWeight: Typography.FONT_WEIGHT_600,
  },
  flat: {
    backgroundColor: Colors.BACKGROUND,
  },
});
