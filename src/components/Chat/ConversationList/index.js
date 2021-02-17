/** @jsx jsx */

import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import styled from '@emotion/styled/macro';
import css from '@emotion/css/macro'
import { jsx } from '@emotion/core'
import ConversationListItem from '../ConversationListItem';
import { ReactComponent as Loader } from '../../../images/loading.svg';

const ConversationListWrapper = styled.ul({
  "height": "360px",
  "width": "360px",
  "overflowY": "scroll",
  "display": "flex",
  "flexDirection": "column",
  "border": "1px solid #ddd",
  "list-style": 'none',
})

const LoadMoreBox = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  padding: 10
})

const LoadMoreMessage = styled.div({
  color: '#999',
  fontSize: '0.8em',
}, ({ hasMore}) =>  {
  const styles = []
  if (hasMore) {
    styles.push({
      cursor: 'pointer',
    })
  }
  return styles;
});

const LoadMore = ({ 
  hasNextPage, 
  fetchMore, 
  loadingInitial,
  loadingMore,
}) => {
  if (loadingInitial) return <div/>
  if (loadingMore) {
    return (
      <LoadMoreBox>
        <Loader width={40} height={40} />
      </LoadMoreBox>
    );
  }
  if (hasNextPage) {
    return (
      <LoadMoreBox>
        <LoadMoreMessage 
          hasMore={true}
          onScroll={fetchMore}>更に読み込む</LoadMoreMessage>
      </LoadMoreBox>
    );
  }
  return (
    <LoadMoreBox>
      <LoadMoreMessage>これ以上ありません</LoadMoreMessage>
    </LoadMoreBox>
  );
}

const EmptyBox = () => (
  <div css={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    "height": "300px",
    "width": "360px",
    "border": "1px solid #ddd",
  }}>
    <Loader width={60} height={60} />
  </div>
);

export default class extends Component {
  constructor() {
    super();
    this.chatListBox = React.createRef();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.loadingInitial && !this.props.loadingInitial) {
      const chatListBox = this.chatListBox.current;
      const el = findDOMNode(chatListBox);
      el.addEventListener('scroll', this.handleScroll)
    }
  }

  componentWillUnmount() {}

  handleScroll = (e) => {
    /* 
      ステップ1.
      会話リストの一番下までスクロールされたときにfetchMoreが一度だけ呼ばれるようにしてください。
      (ヒント1: hasNextPageとloadingMoreを使います。)
      (ヒント2: DOMエレメントの高さなどいくつかの情報が必要です。)
    *///
    //scrollHeight 要素のスクロールビューの高さを表す数字を返す　＝　スクロールして読み取った高さ
    //clientHeight 要素の内部の高さを表す数字を返す　＝　元のスタイルの高さ
    //scrollTop 文書の上端がスクロールされた量をピクセル数で表す数字
    const { 
      fetchMore, 
      hasNextPage, 
      loadingMore 
    } = this.props;

    const wrapperHeight = findDOMNode(this.chatListBox.current);
    // const wrapperHeight = e.element.clientHeight;

    // 読み込むページがない場合、何も返さない
    if (!hasNextPage && loadingMore) return;

    if(wrapperHeight.scrollHeight - wrapperHeight.scrollTop === wrapperHeight.clientHeight) {
      console.log(wrapperHeight.clientHeight);
      return fetchMore;
    }
  }

  render() {
    const { 
      chosenId,
      hasNextPage,
      conversations,
      loadingInitial,
      loadingMore,
      fetchMore,
      handleChooseConversation,
    } = this.props;
    if (loadingInitial) {
      return <EmptyBox />
    }
    const conversationsPart = conversations.map((c) => {
      const isChosen = chosenId === c.id
      return <ConversationListItem 
        handleChooseConversation={handleChooseConversation}
        isChosen={isChosen}
        key={`conversation-${c.id}`} 
        conversation={c} />
    })
    return (
      <ConversationListWrapper ref={this.chatListBox}>
        {conversationsPart}
        <LoadMore 
          fetchMore={fetchMore}
          hasNextPage={hasNextPage}
          loadingInitial={loadingInitial}
          loadingMore={loadingMore} />
      </ConversationListWrapper>
    );
  }

}