import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  NavBar,
  Icon,
  List,
  InputItem,
  Modal,
  Card,
  WhiteSpace,
  Toast,
  Button
} from 'antd-mobile';

import {GOODS_PATH, ICON_PATH} from '../../path';
import {pay} from '../../redux/user.redux';

const Item = List.Item;
const alert = Modal.alert;

@connect (
  state => state,
  {pay}
)
class Order extends Component {
  constructor(props) {
    super(props);

    this.state = {
      phoneNumber: '',
      to: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleBuyClick = this.handleBuyClick.bind(this);
  }
  
  componentDidMount() {
    this.setState({
      phoneNumber: this.props.user.phoneNumber
    });
  }

  handleChange(value, key) {
    value = value.replace(/\s/g, '');
    this.setState({
      [key]: value
    });
  }

  handleBuyClick() {
    const {phoneNumber, to} = this.state;
    const orders = this.props.order.orderList.map(v => ({
      goodsId: v._id,
      price: v.price,
      owner: v.owner,
      status: '已付款',
      buyer: this.props.user.mail,
      to: to,
      phoneNumber: phoneNumber
    }));
    if(phoneNumber && to) {
      this.props.pay(orders);
      setTimeout(() => {
        if(this.props.user.isPay)
          this.props.history.push('/');
      }, 1000);
    } else {
      Toast.info('基本信息未填写完整', 1.5);
    }
  }

  render() {
    return (
      <div
        style={{
          height: '93vh',
          overflow: 'auto'
        }}
      >
        <NavBar
          mode='light'
          icon={<Icon type='left' />}
          onLeftClick={() => this.props.history.goBack()}
        >
          {
            this.props.order.orderList[0] ?
              '创建订单':
              '加载中...'
          }
        </NavBar>
        <List renderHeader={() => '个人信息'} className="my-list">
          <Item extra={this.props.user.name}>卖家姓名</Item>
          <InputItem
            type='phone'
            defaultValue={this.state.phoneNumber}
            onChange={(v) => this.handleChange(v, 'phoneNumber')}
            value={this.state.phoneNumber}
          >
            手机号
          </InputItem>
          <InputItem
            onChange={(v) => this.handleChange(v, 'to')}
            value={this.state.to}
          >
            地址
          </InputItem>
        </List>
        {
          this.props.order.orderList.map(v => (
            <React.Fragment key={v.name}>
              <WhiteSpace />
              <Card>
                <Card.Header
                  onClick={() => this.toGoodsInfo(v._id)}
                  title={v.name}
                  thumb={v.images[0]?`${GOODS_PATH}${v.images[0]}`:null}
                  extra={<span>购入时间：{v.boughtTime}</span>}
                />
                <Card.Body
                  onClick={() => this.toGoodsInfo(v._id)}
                >
                  <div>{v.introduction}</div>
                </Card.Body>
                <Card.Footer
                  content={
                    <>
                      {v.price + ' '}
                      <img style={{height: '1rem'}} src={`${ICON_PATH}star-coin.svg`} alt='' />
                    </>
                  }
                />
              </Card>
            </React.Fragment>
          ))
        }
        <Button
          onClick={
            () =>
            alert('付款', '确认付款？', [
              { text: 'Cancel', onPress: () => console.log('cancel') },
              { text: 'Ok', onPress: this.handleBuyClick },
            ])
          }
          type='primary'
          disabled={!(this.state.phoneNumber&&this.state.to)}
          style={{
            position: 'fixed',
            width: '100%',
            bottom: 0
          }}
        >
          购买
        </Button>
      </div>
    );
  }
}

export default Order;