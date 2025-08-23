import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const RequestScreen=()=>{
    return(
     <View>
        <Text style={styles.word}>Requests</Text>
    </View>
    )
}
export default RequestScreen;
const styles=StyleSheet.create({
  word:{
    fontSize: 35,
     color:'#fff',
     marginTop:20,
     marginLeft:20,
  }
});