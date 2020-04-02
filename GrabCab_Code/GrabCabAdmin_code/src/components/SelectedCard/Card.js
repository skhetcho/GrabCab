import React from 'react';


/*jshint esversion: 6 */
import './styles.css';

export default class Card extends React.Component {
    render() {
      return (<div className="card">{this.props.children}</div>)
    }
  }