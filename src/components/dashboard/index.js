import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
// components
import NavLinkBar from '../navLinkBar';
import Me from '../../containers/me';
import Category from '../category';
import Cart from '../../containers/cart';
import ChatList from '../../containers/chat/chatList';
import Home from '../../containers/home';

class Dashboard extends Component {
  render() {
    const navList = [
      {
        path: '/',
        text: '首页',
        icon: 'home',
        component: Home,
      },
      {
        path: '/category',
        text: '分类',
        icon: 'category',
        component: Category,
      },
      {
        path: '/cart',
        text: '购物车',
        icon: 'cart',
        component: Cart,
      },
      {
        path: '/chatlist',
        text: '消息',
        icon: 'msg',
        component: ChatList,
      },
      {
        path: '/me',
        text: '我',
        icon: 'me',
        component: Me,
      },
    ];
    
    return (
      <div>
        <div>
          <Switch>
            {
              navList.map(v=>(
                <Route exact={v.text === '首页' || v.text === '消息'} key={v.path} path={v.path} component={v.component} />
                )
              )
            }
          </Switch>
        </div>
        <NavLinkBar data={navList}></NavLinkBar>
      </div>
    );
  }
}

export default Dashboard;