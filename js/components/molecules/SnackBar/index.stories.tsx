import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Component, { CustomeProps } from '.';

const props: CustomeProps = {
  open: true,
  message: 'あいうえおかきくけこさしすせそ',
  variant: 'info',
  closable: true,
  onClose: action('') as CustomeProps['onClose'],
};

storiesOf('SnackBar', module)
  .add('info', () => <Component {...props} />)
  .add('success', () => <Component {...props} variant={'success'} />)
  .add('warning', () => <Component {...props} variant={'warning'} />)
  .add('error', () => <Component {...props} variant={'error'} />)
  .add('長い文字', () => <Component {...props} message={'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん'} />);
