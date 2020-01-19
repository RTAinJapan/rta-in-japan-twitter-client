import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Component, { ComponentProps } from '.';
import { ArrayItem } from '../../../types/global';

const tweet: ArrayItem<ComponentProps['tweets']> = {
  id_str: '0123456789012345678901234567890123456789',
  text:
    'あいうえおかきくけこあいうえおかきくけこあいうえおかきくけこあいうえおかきくけこあいうえおかきくけこ\nあいうえおかきくけこあいうえおかきくけこあいうえおかきくけこあいうえおかきくけこあいうえおかきくけこ',
  user: {
    id_str: '123456',
    name: 'RTA走り太郎',
    screen_name: 'rta_runner',
    profile_image_url_https: 'images/rtainjapan-icon.png',
    created_at: '2019/10/10 12:10',
  },
};

const actionProps = {
  deleteTweet: action(''),
};

storiesOf('TweetList', module)
  .add('normal', () => (
    <div style={{ width: 600, backgroundColor: 'orange' }}>
      <Component tweets={[tweet, tweet]} {...actionProps} />
    </div>
  ))
  .add('削除ボタン日活性', () => (
    <div style={{ width: 600, backgroundColor: 'orange' }}>
      <Component tweets={[tweet, tweet]} />
    </div>
  ));
