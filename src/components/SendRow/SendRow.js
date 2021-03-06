// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { AutoGrowInput } from 'AppComponents';
import { DARK_GRAY } from 'AppColors';
import { SEND_ROW_DEFAULT_HEIGHT } from 'AppConstants';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  input: {
    alignSelf: 'center',
    flex: 1,
    backgroundColor: 'white',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 8,
    fontSize: 16,
    color: DARK_GRAY,
  },
  sendContainer: {
    marginLeft: 15,
    padding: 5,
  },
  send: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: DARK_GRAY,
  },
});

type Props = {
  insertMessage: Function,
  onBlur: ?Function,
  autoFocus: ?boolean,
  defaultValue: ?string,
  onChangeText: ?((text: string) => void),
  onEndEditing: ?Function,
  style: ?(number | {}),
  textInputStyle: ?(number | {}),
  onFocus: ?Function,
  initialValue: ?string
};

type State = {
  showSend: boolean,
  inputText: string,
  rowHeight: number,
  initialValueSet: ?string,
  prevValue: ?string,
};


class SendRow extends Component<Props, State> {
  _textInputRef: TextInput;

  static propTypes = {
    insertMessage: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    autoFocus: PropTypes.bool,
    defaultValue: PropTypes.string,
    onChangeText: PropTypes.func,
    onEndEditing: PropTypes.func,
    style: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    textInputStyle: PropTypes.any,
    onFocus: PropTypes.func,
    initialValue: PropTypes.string,
  };

  static defaultProps = {
    onBlur: () => null,
    autoFocus: false,
    defaultValue: '',
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      showSend: false,
      inputText: props.defaultValue,
      rowHeight: SEND_ROW_DEFAULT_HEIGHT,
      initialValueSet: null,
      prevValue: null,
    };
    this._textInputRef = null;
  }

  componentWillReceiveProps() {
    const { initialValue } = this.props;
    const { prevValue } = this.state;
    if (initialValue && prevValue !== initialValue) {
      this.setState({ inputText: initialValue, prevValue: initialValue });
    }
  }

  onChangeHeight = (rowHeight) => {
    this.setState({ rowHeight: rowHeight + 16 });
  }

  getTextInputRef = () => {
    return this._textInputRef ? this._textInputRef._getInputRef() : null;
  }

  insertMessage = () => {
    this.props.insertMessage(this.state.inputText);
    this.setState({
      inputText: '',
      showSend: false,
    });
  }

  changeText = (inputText) => {
    if (this.props.onChangeText) {
      this.props.onChangeText(inputText);
    }
    this.setState({
      inputText,
      showSend: inputText.length > 0,
    });
  }

  render() {
    const { onBlur, autoFocus, style, textInputStyle } = this.props;
    const { showSend, inputText, rowHeight } = this.state;

    return (
      <View style={[styles.container, { height: rowHeight }, style]}>
        <AutoGrowInput
          ref={ref => this._textInputRef = ref}
          underlineColorAndroid={'transparent'}
          onEndEditing={this.props.onEndEditing}
          placeholder="Write a message..."
          minHeight={30}
          style={[styles.input, textInputStyle]}
          onChangeText={this.changeText}
          value={inputText}
          onChangeHeight={this.onChangeHeight}
          autoFocus={autoFocus}
          onFocus={this.props.onFocus}
          onBlur={onBlur}
          placeholderTextColor={DARK_GRAY}
        />
          <TouchableOpacity
            style={styles.sendContainer}
            onPress={this.insertMessage}
            disabled={!showSend}
            hitSlop={{ left: 13, right: 20, top: 12, bottom: 20 }}
          >
            <Text style={styles.send}>
              Send
            </Text>
          </TouchableOpacity>
      </View>
    );
  }
}

export default SendRow;
