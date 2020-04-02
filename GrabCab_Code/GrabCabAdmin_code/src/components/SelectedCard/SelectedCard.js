import React from 'react';
import Card from './Card.js';
import "./styles.css";
class SelectableCard extends React.Component {

    render() {
      var isSelected = this.props.selected ? "selected" : "";
      var className = "selectable " + isSelected;
      return (
        <Card>
          <div className={className} onClick={this.props.onClick}>
            {this.props.children}
            <div className="check"><span className="checkmark">✔</span></div>
          </div>
        </Card>
      );
    }
  }

  class SelectableTitleCard extends React.Component {

    render() {
      var {
        title,
        description,
        minTime,
        selected
      } = this.props;
      return (
        <SelectableCard onClick={this.props.onClick}
          selected={selected}>
          <div className="content">
            <h1 className="title">{title}</h1>
            <img className="description" src={description}/>
            <p className="availability">{minTime != "" ? minTime : "Not Available"}</p>
          </div>
        </SelectableCard>
      );
    }
  }

export default class SelectableCardList extends React.Component {

  constructor(props) {
    super(props);
    var selected = props.multiple ? [] : -1;
    var initialState = {
      selected: selected
    };
    this.state = initialState;
  }

  onItemSelected(index) {
    this.setState((prevState, props) => {
      if (props.multiple) {
        var selectedIndexes = prevState.selected;
        var selectedIndex = selectedIndexes.indexOf(index);
        if (selectedIndex > -1) {
          selectedIndexes.splice(selectedIndex, 1);
          props.onChange(selectedIndexes);
        } else {
          if (!(selectedIndexes.length >= props.maxSelectable)) {
            selectedIndexes.push(index);
            props.onChange(selectedIndexes);
          }
        }
        return {
          selected: selectedIndexes
        };
      } else {
        props.onChange(index);
        return {
          selected: index
        }
      }
    });
  }

  render() {
    var {
      contents,
      multiple
    } = this.props;

    var content = contents.map((cardContent, i) => {
      var {
        name,
        image,
        minTime,
        selected
      } = cardContent;
      var selected = multiple ? this.state.selected.indexOf(i) > -1 : this.state.selected == i;
      return (
        <SelectableTitleCard key={i} 
          title={name}
          description={image}
          minTime={minTime}
          selected={selected}
          onClick={(e) => this.onItemSelected(i)} />
      );
    });
    return (<div className="cardlist">{content}</div>);
  }
}