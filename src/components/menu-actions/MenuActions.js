import React, { Component } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import CustomButton from '../button/CustomButton';

class MenuActions extends Component {
  constructor(props) {
    super(props);
    this.state = { anchorEl: null };
  }

  openMenu(event) {
    this.setState({ anchorEl: event.currentTarget });
  }

  closeMenu() {
    this.setState({ anchorEl: null });
  }

  render() {
    let { actions } = this.props;
    let { anchorEl } = this.state;
    return (
      <div>
        <CustomButton iconName='more_horiz' onClick={(event) => this.openMenu(event)} />
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => this.closeMenu()}>
        {actions ? actions.map((action) => {
          return (
            <MenuItem
              key={action.name}
              onClick={() => {
                action.handler();
                this.closeMenu();
              }}>
              {action.name}
            </MenuItem>
          );
        }) : null}
      </Menu>
      </div>
    );
  }
}

export default MenuActions;
