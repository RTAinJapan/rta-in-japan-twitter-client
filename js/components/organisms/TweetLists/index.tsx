import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@mui/styles';
import * as actions from '../../../actions';
import { RootState } from '../../../reducers';
import { Button, Hidden } from '@mui/material';
import Modal from '../../molecules/Modal';
import TweetListMobile from '../TweetListMobile';
import TweetListPC from '../TweetListPC';
import ArrowBackIosNew from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import { Media } from '../../../types/api';

const useStyles = () =>
  makeStyles({
    root: {
      display: 'flex',
      position: 'relative',
    },
  })();

type ComponentProps = ReturnType<typeof mapStateToProps>;
type ActionProps = typeof mapDispatchToProps;

type PropsType = ComponentProps & ActionProps;
const TweetLists: React.SFC<PropsType> = (props: PropsType) => {
  const classes = useStyles();

  const modalClose = () => {
    props.closeMedia();
  };

  const changeMedia = (index: number) => () => {
    if (index < 0) return;
    if (index > props.preview.media.length - 1) return;

    props.changeMediaIndex(index);
  };

  /** ツイート一覧における画像、動画のプレビューモーダル */
  const createModal = () => {
    if (!props.preview.isShow || props.preview.media.length < 1) return <></>;

    const targetMedia = props.preview.media[props.preview.showIndex];
    const isFirstMedia = props.preview.showIndex === 0;
    const isLastMedia = props.preview.showIndex === props.preview.media.length - 1;

    switch (targetMedia.type) {
      case 'video': {
        if (targetMedia.variants) {
          const mp4Video = targetMedia.variants
            .filter((item) => item.content_type === 'video/mp4')
            .sort((a, b) => {
              if (a.bit_rate > b.bit_rate) return 1;
              if (a.bit_rate < b.bit_rate) return -1;
              return 0;
            });
          if (mp4Video.length > 0) {
            const lastVideo = mp4Video[mp4Video.length - 1];
            return (
              <div>
                <video style={{ objectFit: 'contain', width: '100%', height: '100%', minWidth: 330 }} src={lastVideo.url} playsInline autoPlay controls muted />
              </div>
            );
          }
        }
        break;
      }
      case 'photo': {
        return (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div style={{ width: 50, height: '100%' }}>
              {isFirstMedia ? (
                ''
              ) : (
                <Button style={{ position: 'absolute', height: '100%', left: 0, color: 'white' }} onClick={changeMedia(props.preview.showIndex - 1)}>
                  <ArrowBackIosNew />
                </Button>
              )}
            </div>
            <img style={{ objectFit: 'contain', width: '100%', height: '100%', minWidth: 330 }} src={targetMedia.url} />
            <div style={{ width: 50, height: '100%', top: 0, right: 0, position: 'absolute' }}>
              {isLastMedia ? (
                ''
              ) : (
                <Button style={{ position: 'absolute', height: '100%', right: 0, color: 'white' }} onClick={changeMedia(props.preview.showIndex + 1)}>
                  <ArrowForwardIos />
                </Button>
              )}
            </div>
          </div>
        );
      }
    }

    return <></>;
  };

  return (
    <div>
      <>
        <Hidden smUp>
          <TweetListMobile />
        </Hidden>
        <Hidden smDown>
          <TweetListPC />
        </Hidden>
      </>
      <Modal open={props.preview.isShow} modalClose={modalClose}>
        {createModal()}
      </Modal>
    </div>
  );
};

// state
const mapStateToProps = (state: RootState) => {
  return {
    preview: state.reducer.mediaPreview,
  };
};

// action
const mapDispatchToProps = {
  closeMedia: actions.closeMedia,
  changeMediaIndex: actions.changeMediaIndex,
};

export default connect(mapStateToProps, mapDispatchToProps)(TweetLists);
