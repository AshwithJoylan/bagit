import React, {useContext, useEffect, useState} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import ListItem, {ListItemContext} from './list_item';
import styles from '../styles/home';
import {firestore} from '../actions';
import {ActivityIndicator, View} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const HomeTab = () => {
  const route = useRoute()
  const navigation = useNavigation();
  const {modal} = useContext(ListItemContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  console.log('route:', route, navigation)

  useEffect(() => {
    setLoading(true);
    firestore
      .collection('home')
      .get()
      .then(res => {
        const da = res.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(da);
        setLoading(false);
      })

      .catch(err => {});
  }, []);

  return loading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator />
    </View>
  ) : (
    <FlatList
      shouldRasterizeIOS
      style={styles.flat}
      contentContainerStyle={styles.contentContainer}
      pointerEvents={modal ? 'none' : 'auto'}
      data={data || []}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      renderItem={({item, index}) => <ListItem {...{item, index}} />}
      keyExtractor={(_, i) => i.toString()}
    />
  );
};

export default HomeTab;
