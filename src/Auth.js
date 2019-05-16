import { Component } from 'react'

class Auth extends Component {
  state = {
    me: JSON.parse(localStorage.getItem('me')),
    isLoggedIn: localStorage.getItem('isLoggedIn')
  }
  login = (e = null) => {
    /* 
      アップデートして、メールアドレスがtest@test.com、
      パスワードがpasswordの時のみログインに成功するように
      してください。
    */
    if (e) e.preventDefault()
    const me = {
      email: "test@test.com",
      authToken: 'test',
      name: "テストユーザー",
      username: "testuser"
    }
    localStorage.setItem('me', JSON.stringify(me))
    this.setState({ 
      me, 
      isLoggedIn: true 
    });
  }
  logout = (e = null) => {
    if (e) e.preventDefault()
    localStorage.removeItem('me')
    this.setState({
      me: null, 
      isLoggedIn: false
    })
  }
  getMe = () => {
    return localStorage.getItem('me')
  }
  render() {
    // childrenに対してファンクションとstateを渡す。
    const handleProps = {
      login: this.login,
      logout: this.logout,
      ...this.state
    }
    return this.props.children(handleProps)
  }
}

export default Auth;