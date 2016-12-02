'use strict';
import './shim';
import LibCrypto from 'mudamos-libcrypto';

import React, { Component, } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';

class PowTest1 extends Component {

  constructor(props) {
    super(props);
    this.state = {
      animating: false,
      message: '',
      difficulty: '3',
    };
    
  }

  startPow (){
    var startTime = new Date();

    var message = 'Nome do usuario;Endereco do usuario;Titulo de Eleitor;Sat Dec 10 2016 02:41:02 GMT-0200 (BRST);Nome da Petição;PetiçãoID;1LZk8TPrt77rV6uSoaZWErtaZY1EPwsDm;H1yKwa6j5q738ueLTIjhcBzNhn4veRGKOqBGd1pYSYTGEsM8oiPqRlX1grXNWuSEH6pvqcDbuPRdm0kQD4yVen4=';
    var block = LibCrypto.mineMessage(message,parseInt(this.state.difficulty));

    var timeElapsed = (new Date() - startTime)/1000;

    var checkBlock = LibCrypto.checkMinedMessage(message,parseInt(this.state.difficulty),block);

    var alertMessage = 'Difficulty: ' + this.state.difficulty + '\n\nBlock: ' + block + '\n\nCheck block: ' + checkBlock + '\n\n Tempo: ' + timeElapsed;
    Alert.alert( 
      'Mudamos PoC', alertMessage, [ 
        {text: 'OK', onPress: () => console.log('OK Pressed') },
      ]
    );
  }

  startCreateSeedAndWallet(){
    var startTime = new Date();

    var seed = LibCrypto.createSeedAndWallet('BRAZILIAN-PORTUGUESE', 'ExtraEntropy');

    var timeElapsed = (new Date() - startTime)/1000;
    
    var alertMessage = 'Seed: ' + seed.seed + '\n\nWallet: ' + seed.publicKey + '\n\n Tempo: ' + timeElapsed;

    Alert.alert( 
      'Mudamos PoC', alertMessage, [ 
        {text: 'OK', onPress: () => console.log('OK Pressed') },
      ]
    );

  }

  startSignMessage(){
    var startTime = new Date();

    var seed = LibCrypto.createSeedAndWallet('BRAZILIAN-PORTUGUESE', 'DeviceInfoForExtraEntropy');;
    var message = 'Nome do usuario;Endereco do usuario;Titulo de Eleitor;Sat Dec 10 2016 02:41:02 GMT-0200 (BRST);Nome da Petição;PetiçãoID;' + startTime;
    var difficulty = parseInt(this.state.difficulty);
    var result =  LibCrypto.signMessage(seed.seed,message, difficulty);

    var signature = result.split(';');
    
    var verifyMessage = LibCrypto.verifyMessage(seed.publicKey, message, signature[5]); 

    var timeElapsed = (new Date() - startTime)/1000;

    var alertMessage = 'Mensagem: ' + message + '\n\nSignature: ' + signature[5] + '\n\nWallet: ' + seed.publicKey + '\n\nBloco: ' + result + '\n\nVerify Message: ' + verifyMessage +  '\n\n Tempo: ' + timeElapsed;
    Alert.alert( 
      'Mudamos PoC', alertMessage, [ 
        {text: 'OK', onPress: () => console.log('OK Pressed') },
      ]
    );

  }

  _clickPow(){
    this.setState({ animating: true, message: 'Minerando um Bloco' });
    setTimeout(() => {
      this.startPow();
      this.setState({animating: false, message: ''});
    }, 500);
  }

  _clickSeedAndWallet(){
    this.setState({ animating: true, message: 'Criando Seed e Wallet' });
    setTimeout(() => {
      this.startCreateSeedAndWallet();
      this.setState({animating: false, message: ''});
    }, 500);
  }

  _clickSignMessage(){
    this.setState({ animating: true, message: 'Assinando Mensagem' });
    setTimeout(() => {
      this.startSignMessage();
      this.setState({animating: false, message: ''});
    }, 500);
  }

  render() {    
    var spinner = this.state.animating ?
      ( <ActivityIndicator
        animating={this.state.animating}
        style={[styles.centering, {height: 80}]}
        size="large"
        /> ):
      ( <View/>);      
      
    return (
        
        <View style={styles.container}>
          
          <View style={styles.welcome}> 
            <Text >Mudamos PoC</Text>
            <Text>Blockchain - PoW</Text> 
          </View>   

          <View style={styles.welcome}>
              <Text>Dificuldade (1-5)</Text> 
              <TextInput 
                keyboardType='numeric' 
                maxLength={1}
                clearTextOnFocus={true}
                onChangeText={(text) => this.setState({difficulty: text})}
                value={this.state.difficulty}
              />
          </View>
          
          <View style={styles.button}>
            <Button 
              onPress = {this._clickPow.bind(this)}
              title="Start Proof-of-Work"
              color="#841584"
              accessibilityLabel="Inicia os testes de compatibilidade"
            />  
          </View>
          <View style={styles.button}>
            <Button 
              onPress = {this._clickSeedAndWallet.bind(this)}
              title="Create Seed and Wallet"
              color="#841584"
              accessibilityLabel="Inicia os testes de compatibilidade"
            />  
          </View>
          <View style={styles.button}>
            <Button 
              onPress = {this._clickSignMessage.bind(this)}
              title="Sign Message"
              color="#841584"
              accessibilityLabel="Inicia os testes de compatibilidade"
            />  
          </View>
          
          <View style={styles.container}>
            {spinner}
            <Text>{this.state.message}</Text>
          </View> 
        </View> 
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  button: { padding: 10},
  wrapper: { borderRadius: 5, marginBottom: 5, },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  gray: {
    backgroundColor: '#cccccc',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
  },
  default: { 
    height: 26, 
    borderWidth: 0.5, 
    borderColor: '#0f0f0f', 
    flex: 1, 
    fontSize: 13, 
    padding: 4, 
  }
});

AppRegistry.registerComponent('PowTest1', () => PowTest1);
