import "../style/style.css";
import React, { Component } from "react";
import gql from "graphql-tag";
import { graphql } from "react-apollo";

class LyricList extends Component {
  onClick(id, likes) {
    this.props.mutate({
      variables: { id },
      optimisticResponse: {
        __typename: "Mutation",
        likeLyric: {
          id,
          __typename: "LyricType",
          likes: likes + 1
        }
      }
    });
  }
  renderList() {
    return this.props.lyrics.map(({ id, content, likes }) => {
      return (
        <li key={id} className="collection-item">
          {content}
          <div className="vote-box">
            <i
              className="material-icons"
              onClick={() => this.onClick(id, likes)}
            >
              thumb_up
            </i>

            {likes}
          </div>
        </li>
      );
    });
  }

  render() {
    return <ul className="collection">{this.renderList()}</ul>;
  }
}

const likeLyric = gql`
  mutation LikeLyric($id: ID) {
    likeLyric(id: $id) {
      id
      likes
    }
  }
`;

export default graphql(likeLyric)(LyricList);
