import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView } from 'react-native';
import ListItem from './components/ListItem';
import Chart from "./components/Chart";
import { SAMPLE_DATA } from "./assets/data/sample-date";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
if (Platform.OS === 'android') { // only android needs polyfill
  require('intl'); // import intl object
  require('intl/locale-data/jsonp/en-US'); // load the required locale details
}


const ListHeader = () => {
  return (<>
    <View style={styles.titleWrapper}>
      <Text style={styles.largeTitle}>Markets</Text>
    </View>
    <View style={styles.divider} />
  </>)
}

export default function App() {

  const [selectedCoinData, setSelectedCoinData] = useState(null);

  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['50%'], []);

  const openModal = (item) => {
    setSelectedCoinData(item);
    bottomSheetModalRef.current.present();
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider style={styles.bottonSheet}>
        <SafeAreaView style={styles.container}>


          <FlatList
            keyExtractor={(item) => item.id}
            data={SAMPLE_DATA}
            renderItem={({ item }) =>
              <ListItem
                name={item.name}
                symbol={item.symbol}
                currentPrice={item.current_price}
                priceChangePercentage7d={item.price_change_percentage_7d_in_currency}
                logoUrl={item.image}
                onPress={() => openModal(item)}
              />
            }
            ListHeaderComponent={<ListHeader />}

          />

        </SafeAreaView>

        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          style={styles.bottonSheet}
        >
         { selectedCoinData ? <Chart 
            currentPrice={selectedCoinData.current_price}
            logoUrl={selectedCoinData.image}
            name={selectedCoinData.name}
            symbol={selectedCoinData.symbol}
            priceChangePercentage7d={selectedCoinData.price_change_percentage_7d_in_currency}
            sparkline={selectedCoinData.sparkline_in_7d.price}
          /> : null }

        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  largeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff"
  },
  titleWrapper: {
    marginTop: 60,
    paddingHorizontal: 16,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
  },
  bottonSheet: {
    shadowOffset: { width: 10, height: 10 },
    shadowColor: 'black',
    shadowOpacity: 1,
    elevation: 3,
  }
});
