/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
//import 'mathjs';
const math = require('mathjs');
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Button
} from 'react-native';


export default class App extends Component {
  constructor() {
    super()
    this.state = {
      resultText: "0",
      result: "0"
    }
  }

  //inesrt commas as thousands separators
  format(text){
    let temp = text.split(".");
    temp[0] = temp[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return temp.join(".");
  }

  //check dot format
  hasDot(text) {
    console.log(text)
    let temp = text.split(/[*\/^+-]/);
    //in case the last element is an empty string
    temp = temp.filter( x=> x != '')
    return temp[temp.length-1].includes('.');
  }

  isOperator(op) {
    if(op == '+' || op == '*' || op == '-' || op == '*' || op == '.')
      return true;

    return false;
  }

  calculateResult() {
    let text = this.state.resultText;
    text = text.split("").map(x => x == '%' ? '*0.01' : x).join("");
    this.setState({
        result: math.evaluate(text)
    });
  }

  buttonPressed(text) {
    let length = this.state.resultText.length;

    //calculate the result
    if(text == '=') {
      //verify expression first
      if(!this.isOperator(this.state.resultText[length-1]))
        this.calculateResult();
    }

    //delete last input
    else if(text == 'DEL') {
      this.setState({
          resultText: length == 1 ? "0" : this.state.resultText.substring(0, length-1)
      });
    }

    //reset
    else if(text == 'AC') {
      this.setState({
          resultText: "0"
      });
    }

    //leading 0's should not precede other digits
    //first 0's will be replaced with other digits
    else if (!this.isOperator(text) && this.state.resultText == '0') {
      this.state.resultText = "";
      this.setState({
          resultText: this.state.resultText + text
      });
    }

    //prevent 10%61 case
    else if (!this.isOperator(text) && this.state.resultText[length-1] == '%') {}
    //prevent repeated '%'
    else if (text == '%' && this.state.resultText[length-1] == '%') {}

    else if(this.isOperator(text) && this.isOperator(this.state.resultText[length-1])) {
      //if the 'cur operator' is different from the 'input operaotr', update it
      if(text != this.state.resultText[length-1]) {
        this.setState({
          resultText: text == '.' && this.hasDot(this.state.resultText)?  this.state.resultText : this.state.resultText.substring(0,length-1) + text
        });
      }
    }

    else{
      this.setState({
          resultText: text == '.' && this.hasDot(this.state.resultText)? this.state.resultText : this.state.resultText + text
      });
    }
  }

  render() {
    //keypad interface
    ////////////////////////////////////////////////////////////////////////////////////
    let rows = [];
    let topRow = [];
    topRow.push(
        <TouchableOpacity key={'AC'} onPress={() => this.buttonPressed('AC')} style={styles.btn}>
          <Text style={[styles.btnText, styles.white]}>AC</Text>
        </TouchableOpacity>
    );

    topRow.push(
        <TouchableOpacity key={'DEL'} onPress={() => this.buttonPressed('DEL')} style={styles.btn}>
          <Text style={[styles.btnText, styles.white]}>DEL</Text>
        </TouchableOpacity>
    );

    topRow.push(
        <TouchableOpacity key={'%'} onPress={() => this.buttonPressed('%')} style={styles.btn}>
          <Text style={[styles.btnText, styles.white]}>%</Text>
        </TouchableOpacity>
    );

    rows.push(<View key={'top'} style={styles.topRow}>{topRow}</View>)

    //number pad
    // 3 rows
    for(let i = 0; i < 3; i++) {
      let row = [];
      //3 buttons
      for(let j = 0; j < 3; j++) {
        let cur = j+1+(i*3);
        row.push(
          <TouchableOpacity key={cur} onPress={() => this.buttonPressed(cur)} style={styles.btn}>
            <Text style={styles.btnText}>{cur}</Text>
          </TouchableOpacity>
        );
      }
      rows.push(<View key={i} style={styles.rows}>{row}</View>);
    }

    let lastRow = [];
    //lase row
    lastRow.push(
        <TouchableOpacity key={'0'} onPress={() => this.buttonPressed('0')} style={styles.btn}>
          <Text style={styles.btnText}>0</Text>
        </TouchableOpacity>
    );

    lastRow.push(
        <TouchableOpacity key={'.'} onPress={() => this.buttonPressed('.')} style={styles.btn}>
          <Text style={styles.btnText}>.</Text>
        </TouchableOpacity>
    );

    lastRow.push(
        <TouchableOpacity key={'='} onPress={() => this.buttonPressed('=')} style={styles.btn}>
          <Text style={styles.btnText}>=</Text>
        </TouchableOpacity>
    );

    rows.push(<View key={'last'} style={styles.rows}>{lastRow}</View>);

    let ops = ['+', '-', '*', '/'];
    let operations = [];
    for(let i = 0; i < 4; i++) {
      operations.push(
        <TouchableOpacity key={ops[i]} onPress={() => this.buttonPressed(ops[i])} style={styles.btn}>
          <Text style={[styles.btnText, styles.white]}>{ops[i]}</Text>
        </TouchableOpacity>
      );
    }

    ////////////////////////////////////////////////////////////////////////////////////

    return (
        <View style={styles.container}>
          <View style={styles.result}>
            <Text style={styles.resultText}>
              {this.format(this.state.resultText)}
            </Text>
          </View>
          <View style={styles.calculation}>
            <Text style={styles.calculationText}>
              {this.format(this.state.result+"")}
            </Text>
          </View>
          <View style={styles.buttons}>
            <View style={styles.numbers}>
              {rows}
            </View>
            <View style={styles.operations}>
              {operations}
            </View>
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  calculationText: {
    fontSize: 40,
    color: 'white'
  },

  resultText: {
      fontSize: 45,
      color: 'white'
  },

  white: {
    color: 'white'
  },

  topRow: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#636363'
  },

  rows: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  result: {
    flexGrow: 2,
    backgroundColor: '#E84A5F',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  calculation: {
    flexGrow: 1,
    backgroundColor: '#E84A5F',
    alignItems: 'flex-end',
    justifyContent: 'center'
  },

  btnText: {
    fontSize: 30,
    color: 'white'
  },

  btn: {
    flexGrow : 1,
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#434343',
  },

  buttons: {
    flex: 7,
    flexDirection: 'row'
  },

  numbers: {
    flexGrow: 3,
    backgroundColor: '#636363',
  },

  operations: {
    flexGrow : 1,
    backgroundColor: '#636363',
    justifyContent: 'space-around',
    alignItems: 'center',
  }

});
