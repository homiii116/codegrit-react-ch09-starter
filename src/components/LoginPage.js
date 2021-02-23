import React, { Component } from 'react';
import styled from '@emotion/styled/macro';
import { Button } from 'react-bootstrap';
import { emailValidator, passwordValidator } from './../lib/validators';
import { Formik, Form, Field } from 'formik';

const Wrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: 'auto',
  width: 400,
  height: 400,
  padding: 20,
})

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: '400px'
}

const fieldStyle = {
  marginBottom: '1em',
  padding: '5px 10px',
}

const ErrorMessage = styled.div({
  color: 'red',
  margin: '0 0 3px',
  fontSize: '0.9em'
})

const CustomLabel = styled.label({
  marginBottom: 3,
  fontSize: '0.9em',
})

const handleSubmit = (values, actions) => {
  mockSignup(values)
  .then(data => {
    actions.setSubmitting(false)
    alert(data.message)
  })
  .catch((error) => {
    const errors = {
      server: error.message
    }
    actions.setSubmitting(false);
    actions.setErrors(errors);
  })
}

const validate = (({ email, password }) => {
  return Promise.all([
    passwordValidator(password),
    emailValidator(email),
  ])
  .then((results) => {
    const errors = {}
    results.forEach(result => {
      if(result.error) {
        errors[result.type] = result.error
      }
    })
    if(Object.keys(errors).length > 0) {
      throw errors
    }
  })
})

function mockSignup(values) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const randomNum = Math.floor(Math.random() * 10)
      if(randomNum <= 1) {
        resolve({
          success: true,
          message: 'ログインに成功しました。'
        })
      } else {
        reject({
          success: false,
          message: 'ネットワークエラーが発生しました。'
        })
      }
    }, 2000)
  })
}

export default class extends Component {
  render() {

    return (    
    <Wrapper>
      <Formik
        validateOnBlur={true}
        validateOnChange={false}
        initialValues={{
          email: '',
          password: '',
        }}
        validate={validate}
        onSubmit={handleSubmit}
      >
        {({
          errors,
          handleSubmit,
          isSubmitting,　
          //isSubmiting確認
        }) => {
          return (
            <Form onSubmit={handleSubmit} css={formStyle}>
              <p>利用にはログインが必要です。</p>
              {errors.server && <ErrorMessage>{errors.server}</ErrorMessage>}
              
              <CustomLabel>メールアドレス</CustomLabel>
              <Field type="email" name="email" css={fieldStyle} />
              {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
              
              <CustomLabel>パスワード</CustomLabel>
              <Field type="text" name="password" css={fieldStyle} />
              {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}

              <Button type="info" onClick={this.props.login} >ログインする</Button>
            </Form>  
          );
        }}
      </Formik>
    </Wrapper>
    );      
  }
}